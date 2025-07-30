import React, { useEffect } from 'react';
import { Crown, Check } from 'lucide-react';
import useCVStore from '../store/cvStore';
import useAuthStore from '../store/authStore';

const TemplatesPage = () => {
  const { templates, fetchTemplates } = useCVStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleSelectTemplate = (templateId) => {
    // This would integrate with CV creation
    console.log('Selected template:', templateId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Choose Your CV Template
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Professional templates designed by experts to help you stand out to employers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {templates.map((template) => (
          <div key={template.id} className="card hover:shadow-lg transition-shadow">
            <div className="relative">
              {template.isPremium && (
                <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                  <Crown className="h-3 w-3 mr-1" />
                  Premium
                </div>
              )}
              <div className="h-64 bg-gray-100 rounded-t-lg flex items-center justify-center">
                <span className="text-gray-500">Template Preview</span>
              </div>
            </div>
            
            <div className="card-content">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {template.name}
              </h3>
              <p className="text-gray-600 mb-4">
                {template.description}
              </p>
              
              <button
                onClick={() => handleSelectTemplate(template.id)}
                disabled={template.isPremium && !user?.isPremium}
                className={`btn w-full ${
                  template.isPremium && !user?.isPremium
                    ? 'btn-outline opacity-50 cursor-not-allowed'
                    : 'btn-primary'
                }`}
              >
                {template.isPremium && !user?.isPremium ? (
                  <>
                    <Crown className="h-4 w-4 mr-2" />
                    Upgrade to Use
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Use Template
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {!user?.isPremium && (
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Unlock All Templates</h2>
            <p className="text-primary-100 mb-6">
              Get access to all premium templates and advanced customization options.
            </p>
            <button className="bg-white text-primary-600 px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors">
              Upgrade to Premium
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplatesPage;