-- ============================================
-- CampusBoard — Initial Database Schema
-- ============================================

-- Domain enum for notice categories
CREATE TYPE domain_type AS ENUM (
  'internship',
  'fest',
  'hackathon',
  'research',
  'notice'
);

-- ── Users table ──
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(255) NOT NULL,
  email         VARCHAR(255) UNIQUE NOT NULL,
  google_id     VARCHAR(255) UNIQUE NOT NULL,
  is_admin      BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMP DEFAULT NOW()
);

-- ── Notices table ──
CREATE TABLE IF NOT EXISTS notices (
  id            SERIAL PRIMARY KEY,
  title         VARCHAR(500) NOT NULL,
  college       VARCHAR(255) NOT NULL,
  domain        domain_type NOT NULL,
  deadline      DATE,
  apply_link    TEXT,
  description   TEXT,
  posted_by     INTEGER REFERENCES users(id) ON DELETE SET NULL,
  posted_at     TIMESTAMP DEFAULT NOW()
);

-- ── Bookmarks (join table) ──
CREATE TABLE IF NOT EXISTS bookmarks (
  id            SERIAL PRIMARY KEY,
  user_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  notice_id     INTEGER NOT NULL REFERENCES notices(id) ON DELETE CASCADE,
  created_at    TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, notice_id)
);

-- ── Indexes for fast filtering ──
CREATE INDEX idx_notices_domain   ON notices(domain);
CREATE INDEX idx_notices_college  ON notices(college);
CREATE INDEX idx_notices_deadline ON notices(deadline);
CREATE INDEX idx_bookmarks_user   ON bookmarks(user_id);
