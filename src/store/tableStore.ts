import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

// ... (previous interfaces remain the same)

export const useTableStore = create<TableState>((set, get) => ({
  // ... (previous state remains the same)

  updateCell: async (pageId, tableId, rowId, cellId, value) => {
    set({ error: null });
    try {
      // First update local state
      set((state) => ({
        pages: state.pages.map((page) =>
          page.id === pageId
            ? {
                ...page,
                tables: page.tables.map((table) =>
                  table.id === tableId
                    ? {
                        ...table,
                        rows: table.rows.map((row) =>
                          row.id === rowId
                            ? {
                                ...row,
                                cells: row.cells.map((cell) =>
                                  cell.id === cellId
                                    ? { ...cell, value }
                                    : cell
                                ),
                              }
                            : row
                        ),
                      }
                    : table
                ),
              }
            : page
        ),
      }));

      // Then update in Supabase
      const { error: supabaseError } = await supabase
        .from('cells')
        .upsert({
          id: cellId,
          value,
          row_id: rowId,
          table_id: tableId,
          page_id: pageId,
          updated_at: new Date().toISOString()
        });

      if (supabaseError) {
        throw supabaseError;
      }

      toast.success('Cell updated successfully');
    } catch (error) {
      console.error('Failed to update cell:', error);
      toast.error('Failed to update cell');
      // Revert local state on error
      get().fetchData();
    }
  },

  // ... (rest of the store remains the same)
}));