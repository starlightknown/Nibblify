import React from 'react';
import { Link } from 'react-router-dom';

interface Document {
  id: string;
  title: string;
  status: string;
  created_at: string;
}

const DocumentList: React.FC = () => {
  // This would normally come from an API
  const documents: Document[] = [
    {
      id: '1',
      title: 'Sample Document 1',
      status: 'Draft',
      created_at: '2024-04-07',
    },
    {
      id: '2',
      title: 'Sample Document 2',
      status: 'Published',
      created_at: '2024-04-06',
    },
  ];

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Documents</h3>
        <Link
          to="/documents/new"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          New Document
        </Link>
      </div>
      <ul className="divide-y divide-gray-200">
        {documents.map((document) => (
          <li key={document.id}>
            <Link to={`/documents/${document.id}/edit`} className="block hover:bg-gray-50">
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-indigo-600 truncate">{document.title}</p>
                  <div className="ml-2 flex-shrink-0 flex">
                    <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {document.status}
                    </p>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      Created on {document.created_at}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DocumentList; 