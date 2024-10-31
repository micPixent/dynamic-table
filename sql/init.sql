-- Create tables function
CREATE OR REPLACE FUNCTION create_pages_table()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS pages (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );
END;
$$;

CREATE OR REPLACE FUNCTION create_tables_table()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS tables (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    page_id TEXT REFERENCES pages(id) ON DELETE CASCADE,
    columns JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );
END;
$$;

CREATE OR REPLACE FUNCTION create_rows_table()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS rows (
    id TEXT PRIMARY KEY,
    table_id TEXT REFERENCES tables(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );
END;
$$;

CREATE OR REPLACE FUNCTION create_cells_table()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS cells (
    id TEXT PRIMARY KEY,
    row_id TEXT REFERENCES rows(id) ON DELETE CASCADE,
    table_id TEXT REFERENCES tables(id) ON DELETE CASCADE,
    page_id TEXT REFERENCES pages(id) ON DELETE CASCADE,
    value TEXT NOT NULL,
    votes INTEGER DEFAULT 0,
    nested_table_id TEXT REFERENCES tables(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );
END;
$$;

-- Create trigger for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_pages_updated_at
    BEFORE UPDATE ON pages
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_tables_updated_at
    BEFORE UPDATE ON tables
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_rows_updated_at
    BEFORE UPDATE ON rows
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_cells_updated_at
    BEFORE UPDATE ON cells
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();