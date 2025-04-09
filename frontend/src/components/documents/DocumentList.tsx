import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import documentsApi from '../../api/documents';
import { Document } from '../../types/document';

const DocumentList: React.FC = () => {
  const queryClient = useQueryClient();

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
    <div className="bg-white">
      <div>
        <ul className="divide-y divide-gray-200">
          {documents.length === 0 ? (
            <li className="px-4 py-5">
              <div className="text-gray-500 text-center">No documents found</div>
            </li>
          ) : (
            documents.map((document: Document) => (
              <li key={document.id} className="hover:bg-gray-50">
                <div className="flex items-center px-6 py-4">
                  <div className="flex-shrink-0">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="min-w-0 flex-1 flex items-center justify-between px-4">
                    <div>
                      <Link
                        to={`/documents/${document.id}`}
                        className="text-sm font-medium text-gray-900 hover:text-gray-600"
                      >
                        {document.title}
                      </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Link
                        to={`/documents/${document.id}/edit`}
                        className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(document.id)}
                        className="text-red-600 hover:text-red-900 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
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