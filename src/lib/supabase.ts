import { createClient } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function initializeDatabase() {
  try {
    // Create pages table
    const { error: pagesError } = await supabase.rpc('create_pages_table');
    if (pagesError && !pagesError.message.includes('relation "pages" already exists')) {
      throw pagesError;
    }

    // Create tables table
    const { error: tablesError } = await supabase.rpc('create_tables_table');
    if (tablesError && !tablesError.message.includes('relation "tables" already exists')) {
      throw tablesError;
    }

    // Create cells table
    const { error: cellsError } = await supabase.rpc('create_cells_table');
    if (cellsError && !cellsError.message.includes('relation "cells" already exists')) {
      throw cellsError;
    }

    // Create rows table
    const { error: rowsError } = await supabase.rpc('create_rows_table');
    if (rowsError && !rowsError.message.includes('relation "rows" already exists')) {
      throw rowsError;
    }

    return true;
  } catch (error) {
    console.error('Database initialization error:', error);
    toast.error('Failed to initialize database');
    return false;
  }
}