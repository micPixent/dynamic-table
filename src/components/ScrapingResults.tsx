import React from 'react';
import { FileText } from 'lucide-react';

interface ScrapingResultsProps {
  data: string | null;
}

export function ScrapingResults({ data }: ScrapingResultsProps) {
  if (!data) return null;

  return (
    <div className="mt-6 w-full max-w-lg">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center mb-4">
          <FileText className="h-6 w-6 text-blue-500 mr-2" />
          <h2 className="text-lg font-medium text-gray-900">Scraping Results</h2>
        </div>
        <div className="bg-gray-50 rounded-md p-4">
          <pre className="text-sm text-gray-700 whitespace-pre-wrap">{data}</pre>
        </div>
      </div>
    </div>
  );
}