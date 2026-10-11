#!/usr/bin/env python3
"""Read-only production export; restore and compare in a private temporary local DB."""
import hashlib, json, os, pathlib, sqlite3, subprocess, tempfile
root = pathlib.Path(__file__).resolve().parents[1]
os.umask(0o077)
def wrangler(*args):
    result = subprocess.run([str(root/'node_modules/.bin/wrangler'), 'd1', *args], cwd=root, capture_output=True, text=True)
    if result.returncode: raise RuntimeError('Wrangler backup operation failed; no customer data logged')
    return result.stdout
with tempfile.TemporaryDirectory(prefix='st-inquiry-restore-') as folder:
    dump = pathlib.Path(folder)/'backup.sql'
    wrangler('export','st-tour-inquiries','--remote','--output',str(dump))
    db = sqlite3.connect(str(pathlib.Path(folder)/'restore.sqlite'))
    db.row_factory = sqlite3.Row
    db.executescript(dump.read_text())
    assert db.execute('PRAGMA integrity_check').fetchone()[0] == 'ok'
    assert not db.execute('PRAGMA foreign_key_check').fetchall()
    report = {}
    for table in ['inquiries','notifications','alimtalk_jobs','audit_events','rate_limits']:
        remote = json.loads(wrangler('execute','st-tour-inquiries','--remote','--json','--command',f'SELECT * FROM {table} ORDER BY 1'))[0]['results']
        restored = [dict(row) for row in db.execute(f'SELECT * FROM {table} ORDER BY 1')]
        assert remote == restored, f'{table}: snapshot changed or restore mismatch; retry while intake is disabled'
        report[table] = {'rows':len(restored),'sha256':hashlib.sha256(json.dumps(restored,sort_keys=True,ensure_ascii=False).encode()).hexdigest()}
    db.close()
    print(json.dumps({'integrity':'ok','foreignKeys':'ok','comparison':'all rows match','tables':report,'temporaryCopies':'removed on exit'},ensure_ascii=False,indent=2))
