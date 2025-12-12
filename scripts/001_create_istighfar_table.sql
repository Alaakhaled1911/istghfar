-- Create istighfar_entries table
CREATE TABLE IF NOT EXISTS istighfar_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(name, entry_date)
);

-- Enable RLS
ALTER TABLE istighfar_entries ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow public read" ON istighfar_entries FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON istighfar_entries FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON istighfar_entries FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON istighfar_entries FOR DELETE USING (true);
