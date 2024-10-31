import React from 'react';
import { useTableStore } from '../../store/tableStore';
import { ChevronRight } from 'lucide-react';

export function SidePanel() {
  const { pages, currentPage } = useTableStore();
  
  const getCurrentPageData = () => {
    return pages?.find(page => page.id === currentPage);
  };

  const pageData = getCurrentPageData();

  if (!pageData) return null;

  return (
    <div className="w-64 bg-gray-50 border-r p-4 h-screen">
      <h2 className="text-lg font-semibold mb-4">Navigation</h2>
      <div className="space-y-2">
        {pageData.tables.map(table => (
          <div key={table.id} className="space-y-1">
            <a
              href={`#table-${table.id}`}
              className="flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              <ChevronRight className="w-4 h-4 mr-1" />
              {table.name}
            </a>
            <div className="pl-4 space-y-1">
              {table.columns.map((column, index) => (
                <a
                  key={index}
                  href={`#table-${table.id}-column-${index}`}
                  className="block text-xs text-gray-500 hover:text-gray-700"
                >
                  {column}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}