import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import documentsApi from '../../api/documents';
import { Document } from '../../types/document';

const DocumentList: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: documents = [], isLoading, error } = useQuery<Document[]>({
    queryKey: ['documents'],
    queryFn: () => documentsApi.getAll()
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => documentsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    }
  });

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-4">
        <div className="text-gray-500">Loading documents...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4">
        <div className="text-red-500">Error loading documents</div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Documents
        </h3>
        <Link
          to="/documents/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create Document
        </Link>
      </div>

      <div className="border-t border-gray-200">
        <form onSubmit={handleSearch} className="px-4 py-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documents..."
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      <div className="border-t border-gray-200">
        <ul className="divide-y divide-gray-200">
          {documents.length === 0 ? (
            <li className="px-4 py-5 sm:px-6">
              <div className="text-gray-500 text-center">No documents found</div>
            </li>
          ) : (
            documents.map((document: Document) => (
              <li key={document.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/documents/${document.id}`}
                      className="text-lg font-medium text-indigo-600 hover:text-indigo-900 truncate"
                    >
                      {document.title}
                    </Link>
                    <p className="mt-1 text-sm text-gray-500 truncate">
                      {document.content}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link
                      to={`/documents/${document.id}/edit`}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(document.id)}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default DocumentList; 