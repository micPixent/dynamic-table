import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Cell } from './Cell';
import { useTableStore } from '../../store/tableStore';

interface TableProps {
  id: string;
  name: string;
  rows: any[];
  columns: string[];
  level?: number;
}

export function Table({ id, name, rows, columns, level = 0 }: TableProps) {
  const [expandedCells, setExpandedCells] = useState<Set<string>>(new Set());
  const { pages, currentPage, addRow, addColumn } = useTableStore();

  const toggleExpand = (cellId: string) => {
    const newExpanded = new Set(expandedCells);
    if (expandedCells.has(cellId)) {
      newExpanded.delete(cellId);
    } else {
      newExpanded.add(cellId);
    }
    setExpandedCells(newExpanded);
  };

  return (
    <div className="w-full overflow-x-auto bg-white rounded-lg shadow">
      <div className="p-4 flex items-center justify-between border-b">
        <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => addColumn(currentPage, id, 'New Column')}
            className="flex items-center px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add Column
          </button>
          <button
            onClick={() => addRow(currentPage, id)}
            className="flex items-center px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add Row
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rows.map((row) => (
              <React.Fragment key={row.id}>
                <tr>
                  {row.cells.map((cell: any) => (
                    <td key={cell.id} className="px-6 py-4">
                      <Cell
                        {...cell}
                        pageId={currentPage}
                        tableId={id}
                        rowId={row.id}
                        onExpand={() => toggleExpand(cell.id)}
                        isExpanded={expandedCells.has(cell.id)}
                      />
                    </td>
                  ))}
                </tr>
                {expandedCells.has(row.cells[0].id) && row.cells[0].nestedTableId && (
                  <tr>
                    <td colSpan={columns.length} className="px-6 py-4">
                      <div className="pl-8">
                        <Table
                          {...row.cells[0].nestedTable}
                          level={level + 1}
                        />
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}