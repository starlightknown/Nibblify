import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import documentsApi from '../../api/documents';
import { HiOutlineDocumentText, HiOutlineArrowLeft, HiOutlineArchive, HiOutlineTrash, HiOutlineShare } from 'react-icons/hi';
import { useTheme } from '../layout/MainLayout';

const DocumentView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isDarkMode } = useTheme();

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
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-64 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg p-6`}>
        <div className="mb-8">
          <Link to="/documents" className="flex items-center text-indigo-600 hover:text-indigo-700">
            <span className="mr-2"><HiOutlineArrowLeft size={20} /></span>
            Back to Documents
          </Link>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wide mb-2`}>
              Document Info
            </h3>
            <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <p>Created on {new Date(document.created_at).toLocaleDateString()}</p>
              <p className="mt-1">Type: {document.file_type || 'Text Document'}</p>
            </div>
          </div>

          <div>
            <h3 className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wide mb-2`}>
              Actions
            </h3>
            <div className="space-y-2">
              <Link
                to={`/documents/${document.id}/edit`}
                className={`flex items-center w-full px-3 py-2 text-sm rounded-md ${
                  isDarkMode 
                    ? 'hover:bg-gray-700 text-gray-300' 
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <span className="mr-2"><HiOutlineDocumentText size={20} /></span>
                Edit Document
              </Link>
              <button
                className={`flex items-center w-full px-3 py-2 text-sm rounded-md ${
                  isDarkMode 
                    ? 'hover:bg-gray-700 text-gray-300' 
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <span className="mr-2"><HiOutlineArchive size={20} /></span>
                Archive
              </button>
              <button
                className={`flex items-center w-full px-3 py-2 text-sm rounded-md ${
                  isDarkMode 
                    ? 'hover:bg-gray-700 text-gray-300' 
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <span className="mr-2"><HiOutlineShare size={20} /></span>
                Share
              </button>
              <button
                className={`flex items-center w-full px-3 py-2 text-sm rounded-md text-red-600 hover:bg-red-50`}
              >
                <span className="mr-2"><HiOutlineTrash size={20} /></span>
                Delete
              </button>
            </div>
          </div>

          <div>
            <h3 className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wide mb-2`}>
              Settings
            </h3>
            <div className="flex items-center justify-between">
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Dark Mode</span>
              <button
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                  isDarkMode ? 'bg-indigo-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    isDarkMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        <div className={`max-w-4xl mx-auto ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg rounded-lg p-6`}>
          <h1 className="text-3xl font-bold mb-6">{document.title}</h1>
          <div className={`prose max-w-none ${isDarkMode ? 'prose-invert' : ''}`}>
            <pre className={`whitespace-pre-wrap font-sans ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {document.content}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentView; 