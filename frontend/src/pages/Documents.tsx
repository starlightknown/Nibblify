import React from 'react';
import DocumentList from '../components/documents/DocumentList';
import DocumentForm from '../components/documents/DocumentForm';

const Documents: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Documents</h1>
      </div>
      <DocumentList />
    </div>
  );
};

export default Documents; 