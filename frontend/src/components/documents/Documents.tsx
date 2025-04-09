import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { documentsApi, Document } from '../../api/documentsApi';

const Documents: React.FC = () => {
  const { data: documents = [], isLoading, error } = useQuery<Document[]>({
    queryKey: ['documents'],
    queryFn: documentsApi.getAll
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading documents</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Documents</h1>
        <div className="space-x-4">
          <Link
            to="/documents/new"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Create Document
          </Link>
          <Link
            to="/documents/upload"
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Upload Document
          </Link>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created At
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {documents.map((document: Document) => (
              <tr key={document.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link
                    to={`/documents/${document.id}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {document.title}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {document.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {format(new Date(document.createdAt), 'MMM d, yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Documents; 