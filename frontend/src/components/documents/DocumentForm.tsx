import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import documentsApi, { Document, CreateDocumentInput, UpdateDocumentInput } from '../../api/documents';

const DocumentForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  // Fetch document data if editing
  const { data: document, isLoading } = useQuery<Document>({
    queryKey: ['document', id],
    queryFn: () => documentsApi.getById(id!),
    enabled: !!id, // Only run the query if we have an ID
  });

  // Update form when document data is loaded
  useEffect(() => {
    if (document) {
      setTitle(document.title);
      setContent(document.content);
    }
  }, [document]);

  const createMutation = useMutation({
    mutationFn: (data: CreateDocumentInput) => documentsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      navigate('/documents');
    },
    onError: (err: Error) => {
      setError(err.message || 'Error creating document');
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdateDocumentInput) => documentsApi.update(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['document', id] });
      navigate('/documents');
    },
    onError: (err: Error) => {
      setError(err.message || 'Error updating document');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title || !content) {
      setError('Title and content are required');
      return;
    }

    const documentData = {
      title,
      content
    };

    if (id) {
      updateMutation.mutate(documentData);
    } else {
      createMutation.mutate(documentData);
    }
  };

  if (id && isLoading) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <div className="text-center py-4">Loading document...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        {id ? 'Edit Document' : 'Create Document'}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>
        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/documents')}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={createMutation.isPending || updateMutation.isPending}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {createMutation.isPending || updateMutation.isPending ? 'Saving...' : (id ? 'Update' : 'Create')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DocumentForm; 