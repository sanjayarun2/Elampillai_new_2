-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
    id TEXT PRIMARY KEY,
    whatsapp_link TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default settings record
INSERT INTO settings (id, whatsapp_link, updated_at)
VALUES ('1', '', CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for settings
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to settings"
ON settings FOR SELECT
TO anon
USING (true);

CREATE POLICY "Allow authenticated update to settings"
ON settings FOR UPDATE
TO anon
USING (true)
WITH CHECK (true);