import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import documentsApi from '../../api/documents';

const UploadDocument: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      return documentsApi.upload(formData);
    },
    onSuccess: () => {
      navigate('/documents');
    },
    onError: (err: any) => {
      setError(err.response?.data?.detail || 'Failed to upload document');
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.pdf')) {
      setError('Only PDF files are supported');
      return;
    }

    setError('');
    setIsUploading(true);
    uploadMutation.mutate(file);
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Upload PDF Document</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select PDF File
          </label>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            disabled={isUploading}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100"
          />
        </div>

        {error && (
          <div className="text-red-600 text-sm mb-4">{error}</div>
        )}

        {isUploading && (
          <div className="text-gray-600 text-sm">
            Processing PDF and extracting text...
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadDocument; 