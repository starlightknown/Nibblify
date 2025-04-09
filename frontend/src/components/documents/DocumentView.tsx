import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import documentsApi from '../../api/documents';

const DocumentView: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { data: document, isLoading, error } = useQuery({
    queryKey: ['document', id],
    queryFn: () => documentsApi.getById(id!),
  });

  if (isLoading) {
    return (
      <div className="text-center py-4">
        <div className="text-gray-500">Loading document...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4">
        <div className="text-red-500">Error loading document</div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="text-center py-4">
        <div className="text-gray-500">Document not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{document.title}</h1>
            <p className="text-sm text-gray-500 mt-1">
              Created on {new Date(document.created_at).toLocaleDateString()}
            </p>
          </div>
          <div className="space-x-2">
            <Link
              to={`/documents/${document.id}/edit`}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Edit
            </Link>
            <Link
              to="/documents"
              className="bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Back
            </Link>
          </div>
        </div>

        {document.file_type === 'pdf' && document.file_path && (
          <div className="mb-6">
            <a
              href={`/api/v1/knowledge/documents/${document.id}/file`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-800"
            >
              View Original PDF
            </a>
          </div>
        )}

        <div className="prose max-w-none">
          <pre className="whitespace-pre-wrap font-sans">{document.content}</pre>
        </div>
      </div>
    </div>
  );
};

export default DocumentView; 