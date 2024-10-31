import React, { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './components/Auth/AuthProvider';
import { SidePanel } from './components/Navigation/SidePanel';
import { Table } from './components/Table/Table';
import { useTableStore } from './store/tableStore';
import toast from 'react-hot-toast';

function App() {
  const { pages, currentPage, loading, error, fetchData } = useTableStore();

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchData();
      } catch (err) {
        toast.error('Failed to load data. Using offline mode.');
      }
    };

    loadData();
  }, [fetchData]);

  const currentPageData =
    pages?.find((page) => page.id === currentPage) || null;

  console.log(currentPageData, 'current');

  return (
    <AuthProvider>
      <div className="flex min-h-screen bg-gray-50">
        <SidePanel />
        <main className="flex-1 p-8">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : error ? (
            <div className="text-red-600 bg-red-50 p-4 rounded-md">
              {error}
              <button
                onClick={() => fetchData()}
                className="ml-4 text-sm text-red-700 underline"
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {currentPageData?.tables.map((table) => (
                <Table key={table.id} {...table} />
              ))}
            </div>
          )}
        </main>
        <Toaster position="top-right" />
      </div>
    </AuthProvider>
  );
}

export default App;
