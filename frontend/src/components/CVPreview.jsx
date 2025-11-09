import React from 'react';
import PropTypes from 'prop-types';

const CVPreview = ({ cvData, template = 'classic' }) => {
  if (!cvData) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">No hay datos para previsualizar</p>
      </div>
    );
  }

  // Classic template preview
  if (template === 'classic') {
    return (
      <div className="w-full h-full bg-white shadow-lg overflow-auto">
        <div className="max-w-[210mm] mx-auto p-12 font-sans">
          {/* Header */}
          <div className="text-center pb-6 border-b-4 border-gray-800 mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-1">
              {cvData.firstName || 'Nombre'} {cvData.lastName || 'Apellido'}
            </h1>
            {cvData.title && (
              <p className="text-lg text-gray-600 mb-4">{cvData.title}</p>
            )}
            <div className="flex justify-center flex-wrap gap-4 text-sm text-gray-600">
              {cvData.contactInfo?.email && (
                <span>📧 {cvData.contactInfo.email}</span>
              )}
              {cvData.contactInfo?.phone && (
                <span>📱 {cvData.contactInfo.phone}</span>
              )}
              {cvData.contactInfo?.address && (
                <span>📍 {cvData.contactInfo.address}</span>
              )}
              {cvData.contactInfo?.linkedin && (
                <span>💼 LinkedIn</span>
              )}
              {cvData.contactInfo?.github && (
                <span>💻 GitHub</span>
              )}
            </div>
          </div>

          {/* Summary */}
          {cvData.summary && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-blue-500 pb-2 mb-4 uppercase tracking-wide">
                Perfil Profesional
              </h2>
              <p className="text-sm leading-relaxed text-gray-700 text-justify">
                {cvData.summary}
              </p>
            </div>
          )}

          {/* Experience */}
          {cvData.experience && cvData.experience.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-blue-500 pb-2 mb-4 uppercase tracking-wide">
                Experiencia Laboral
              </h2>
              {cvData.experience.map((exp, index) => (
                <div key={index} className="mb-6">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-lg font-bold text-gray-800">
                      {exp.position || 'Posición'}
                    </h3>
                    <span className="text-xs text-gray-500 italic">
                      {exp.startDate || 'Inicio'} - {exp.endDate || 'Presente'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{exp.company || 'Empresa'}</p>
                  {exp.description && (
                    <p className="text-sm text-gray-700 ml-4">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Education */}
          {cvData.education && cvData.education.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-blue-500 pb-2 mb-4 uppercase tracking-wide">
                Educación
              </h2>
              {cvData.education.map((edu, index) => (
                <div key={index} className="mb-6">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-lg font-bold text-gray-800">
                      {edu.degree || 'Título'}
                    </h3>
                    <span className="text-xs text-gray-500 italic">
                      {edu.startDate || 'Inicio'} - {edu.endDate || 'Fin'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {edu.institution || 'Institución'}
                    {edu.field && ` • ${edu.field}`}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Skills */}
          {cvData.skills && cvData.skills.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-blue-500 pb-2 mb-4 uppercase tracking-wide">
                Habilidades
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {cvData.skills.map((skill, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-800">{skill.name || 'Habilidad'}</span>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full ${
                            i < (skill.level || 3) ? 'bg-blue-500' : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Add more templates here (Modern, Creative, etc.)
  return <div>Template {template} no disponible</div>;
};

CVPreview.propTypes = {
  cvData: PropTypes.object,
  template: PropTypes.string
};

export default CVPreview;
