import React, { useState } from 'react';
import { ChevronDown, ChevronRight, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useTableStore } from '../../store/tableStore';
import toast from 'react-hot-toast';

interface CellProps {
  id: string;
  value: string;
  votes: number;
  nestedTableId?: string;
  onExpand: () => void;
  isExpanded: boolean;
  pageId: string;
  tableId: string;
  rowId: string;
}

export function Cell({ 
  id, 
  value, 
  votes, 
  nestedTableId, 
  onExpand, 
  isExpanded,
  pageId,
  tableId,
  rowId
}: CellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [isUpdating, setIsUpdating] = useState(false);
  const { updateCell, vote } = useTableStore();

  const handleSave = async () => {
    if (isUpdating) return;
    
    try {
      setIsUpdating(true);
      await updateCell(pageId, tableId, rowId, id, editValue);
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update cell');
      setEditValue(value); // Revert to original value on error
    } finally {
      setIsUpdating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditValue(value);
      setIsEditing(false);
    }
  };

  return (
    <div className="relative group border border-gray-200 p-2 rounded">
      <div className="flex items-center space-x-2">
        {nestedTableId && (
          <button
            onClick={onExpand}
            className="p-1 hover:bg-gray-100 rounded"
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        )}
        
        {isEditing ? (
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="w-full p-1 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            autoFocus
            disabled={isUpdating}
          />
        ) : (
          <div
            onDoubleClick={() => setIsEditing(true)}
            className="flex-1 cursor-pointer min-h-[1.5rem] px-1 hover:bg-gray-50 rounded"
          >
            {value}
          </div>
        )}
      </div>

      <div className="absolute top-0 right-0 hidden group-hover:flex items-center space-x-1 bg-white p-1 rounded shadow-sm">
        <button
          onClick={() => vote(id, 1)}
          className="p-1 hover:bg-gray-100 rounded"
          disabled={isUpdating}
        >
          <ThumbsUp className="w-4 h-4" />
        </button>
        <span className="text-sm font-medium">{votes}</span>
        <button
          onClick={() => vote(id, -1)}
          className="p-1 hover:bg-gray-100 rounded"
          disabled={isUpdating}
        >
          <ThumbsDown className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}