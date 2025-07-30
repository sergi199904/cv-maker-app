import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, Download, Eye, ArrowLeft } from 'lucide-react';
import useCVStore from '../store/cvStore';
import toast from 'react-hot-toast';

const CVEditorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentCV, fetchCV, createCV, updateCV, createEmptyCV } = useCVStore();
  const [cvData, setCVData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (id) {
      // Editing existing CV
      fetchCV(id).catch(() => {
        toast.error('CV not found');
        navigate('/dashboard');
      });
    } else {
      // Creating new CV
      setCVData(createEmptyCV());
    }
  }, [id]);

  useEffect(() => {
    if (currentCV && id) {
      setCVData(currentCV);
    }
  }, [currentCV, id]);

  const handleSave = async () => {
    if (!cvData) return;
    
    setIsLoading(true);
    try {
      if (id) {
        await updateCV(id, cvData);
        toast.success('CV updated successfully');
      } else {
        const newCV = await createCV(cvData);
        toast.success('CV created successfully');
        navigate(`/cv/edit/${newCV._id}`);
      }
    } catch (error) {
      toast.error('Failed to save CV');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (section, field, value) => {
    setCVData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  if (!cvData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading CV editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/dashboard')}
                className="btn btn-outline"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                {id ? 'Edit CV' : 'Create New CV'}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="btn btn-outline">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </button>
              <button className="btn btn-outline">
                <Download className="h-4 w-4 mr-2" />
                Download
              </button>
              <button 
                onClick={handleSave}
                disabled={isLoading}
                className="btn btn-primary"
              >
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Editor Panel */}
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="card">
              <div className="card-header">
                <h2 className="text-lg font-semibold text-gray-900">
                  Basic Information
                </h2>
              </div>
              <div className="card-content space-y-4">
                <div className="form-group">
                  <label className="form-label">CV Title</label>
                  <input
                    type="text"
                    className="input"
                    value={cvData.title || ''}
                    onChange={(e) => handleInputChange('title', null, e.target.value)}
                    placeholder="My Professional CV"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">First Name</label>
                    <input
                      type="text"
                      className="input"
                      value={cvData.personalInfo?.firstName || ''}
                      onChange={(e) => handleInputChange('personalInfo', 'firstName', e.target.value)}
                      placeholder="John"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Last Name</label>
                    <input
                      type="text"
                      className="input"
                      value={cvData.personalInfo?.lastName || ''}
                      onChange={(e) => handleInputChange('personalInfo', 'lastName', e.target.value)}
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Professional Title</label>
                  <input
                    type="text"
                    className="input"
                    value={cvData.personalInfo?.title || ''}
                    onChange={(e) => handleInputChange('personalInfo', 'title', e.target.value)}
                    placeholder="Software Engineer"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Professional Summary</label>
                  <textarea
                    rows={4}
                    className="input"
                    value={cvData.personalInfo?.summary || ''}
                    onChange={(e) => handleInputChange('personalInfo', 'summary', e.target.value)}
                    placeholder="Brief description of your professional background..."
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="card">
              <div className="card-header">
                <h2 className="text-lg font-semibold text-gray-900">
                  Contact Information
                </h2>
              </div>
              <div className="card-content space-y-4">
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="input"
                    value={cvData.contact?.email || ''}
                    onChange={(e) => handleInputChange('contact', 'email', e.target.value)}
                    placeholder="john@example.com"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input
                    type="tel"
                    className="input"
                    value={cvData.contact?.phone || ''}
                    onChange={(e) => handleInputChange('contact', 'phone', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">LinkedIn</label>
                  <input
                    type="url"
                    className="input"
                    value={cvData.contact?.linkedin || ''}
                    onChange={(e) => handleInputChange('contact', 'linkedin', e.target.value)}
                    placeholder="https://linkedin.com/in/johndoe"
                  />
                </div>
              </div>
            </div>

            {/* Placeholder for future sections */}
            <div className="card">
              <div className="card-content">
                <div className="text-center py-8 text-gray-500">
                  <p className="text-lg font-medium">More sections coming soon!</p>
                  <p>Experience, Education, Skills, and more...</p>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-gray-900">Live Preview</h2>
            </div>
            <div className="card-content">
              <div className="bg-white border border-gray-200 rounded-lg p-8 min-h-[600px]">
                {/* Basic CV Preview */}
                <div className="space-y-6">
                  <div className="text-center border-b border-gray-200 pb-6">
                    <h1 className="text-3xl font-bold text-gray-900">
                      {cvData.personalInfo?.firstName} {cvData.personalInfo?.lastName}
                    </h1>
                    {cvData.personalInfo?.title && (
                      <p className="text-lg text-primary-600 mt-2">
                        {cvData.personalInfo.title}
                      </p>
                    )}
                    <div className="flex justify-center space-x-4 mt-4 text-sm text-gray-600">
                      {cvData.contact?.email && <span>{cvData.contact.email}</span>}
                      {cvData.contact?.phone && <span>{cvData.contact.phone}</span>}
                    </div>
                  </div>

                  {cvData.personalInfo?.summary && (
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-3">
                        Professional Summary
                      </h2>
                      <p className="text-gray-700 leading-relaxed">
                        {cvData.personalInfo.summary}
                      </p>
                    </div>
                  )}

                  <div className="text-center text-gray-500 py-8">
                    <p>Additional sections will appear here as you add them</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVEditorPage;