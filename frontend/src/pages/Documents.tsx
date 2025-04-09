import React from 'react';
import { Link } from 'react-router-dom';
import DocumentList from '../components/documents/DocumentList';

const Documents: React.FC = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
        <div className="space-x-4">
          <Link
            to="/documents/new"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create Document
          </Link>
          <Link
            to="/documents/upload"
            className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Upload PDF
          </Link>
        </div>
      </div>
      <DocumentList />
    </div>
  );
};

export default Documents; 