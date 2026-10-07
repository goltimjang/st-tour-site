CREATE TABLE inquiries (
 id TEXT PRIMARY KEY,
 receipt TEXT NOT NULL UNIQUE,
 request_key TEXT NOT NULL UNIQUE,
 content_hash TEXT NOT NULL,
 kind TEXT NOT NULL CHECK(kind IN ('tour','booking')),
 name TEXT NOT NULL,
 phone TEXT NOT NULL,
 email TEXT NOT NULL,
 payload TEXT NOT NULL CHECK(json_valid(payload)),
 consent_version TEXT NOT NULL,
 created_at INTEGER NOT NULL,
 updated_at INTEGER NOT NULL,
 status TEXT NOT NULL DEFAULT 'new' CHECK(status IN ('new','consulting','quoted','booked','closed','review')),
 note TEXT NOT NULL DEFAULT '',
 version INTEGER NOT NULL DEFAULT 1
);
CREATE INDEX inquiries_created ON inquiries(created_at DESC, id DESC);
CREATE INDEX inquiries_status ON inquiries(status, created_at DESC);
CREATE TABLE notifications (
 inquiry_id TEXT PRIMARY KEY REFERENCES inquiries(id),
 status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','processing','retry','accepted','failed','blocked')),
 attempts INTEGER NOT NULL DEFAULT 0,
 next_at INTEGER NOT NULL,
 lease_until INTEGER NOT NULL DEFAULT 0,
 lease_token TEXT,
 first_attempt_at INTEGER,
 provider_id TEXT,
 error_code TEXT,
 updated_at INTEGER NOT NULL
);
CREATE INDEX notification_due ON notifications(status,next_at);
CREATE TABLE audit_events (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 inquiry_id TEXT NOT NULL REFERENCES inquiries(id),
 actor TEXT NOT NULL,
 action TEXT NOT NULL,
 created_at INTEGER NOT NULL
);
CREATE TABLE rate_limits (bucket TEXT PRIMARY KEY, count INTEGER NOT NULL, expires_at INTEGER NOT NULL);
