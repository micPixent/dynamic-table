import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ScrapingFormProps {
  url: string;
  setUrl: (url: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  error: string | null;
}

export function ScrapingForm({ url, setUrl, onSubmit, isLoading, error }: ScrapingFormProps) {
  return (
    <form onSubmit={onSubmit} className="w-full max-w-lg space-y-4">
      <div>
        <label htmlFor="url" className="block text-sm font-medium text-gray-700">
          Website URL
        </label>
        <div className="mt-1">
          <input
            type="url"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white px-4 py-2"
            placeholder="https://example.com"
            required
          />
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
      >
        {isLoading ? 'Scraping...' : 'Start Scraping'}
      </button>
    </form>
  );
}