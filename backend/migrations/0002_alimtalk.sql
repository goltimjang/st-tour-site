CREATE TABLE alimtalk_jobs (
 inquiry_id TEXT PRIMARY KEY REFERENCES inquiries(id),
 template_key TEXT NOT NULL CHECK(template_key='tour_received_v1'),
 status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','blocked','processing','accepted','failed','unknown')),
 attempts INTEGER NOT NULL DEFAULT 0,
 lease_token TEXT,
 lease_until INTEGER NOT NULL DEFAULT 0,
 provider_group_id TEXT,
 error_code TEXT,
 created_at INTEGER NOT NULL,
 updated_at INTEGER NOT NULL
);
CREATE INDEX alimtalk_status ON alimtalk_jobs(status,created_at);
