import api from './api';

/**
 * Descarga el CV como PDF
 * @param {string} cvId - ID del CV
 * @param {string} fileName - Nombre del archivo (opcional)
 * @returns {Promise<void>}
 */
export const downloadCVAsPDF = async (cvId, fileName) => {
  try {
    const response = await api.post(`/cv/${cvId}/download`, {}, {
      responseType: 'blob', // Important for file download
      timeout: 30000 // 30 seconds timeout for PDF generation
    });

    // Create blob link to download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName || `CV_${cvId}.pdf`);
    
    // Append to body, click and remove
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    
    // Clean up the URL object
    window.URL.revokeObjectURL(url);
    
    return { success: true };
  } catch (error) {
    console.error('Download error:', error);
    
    if (error.response?.status === 403) {
      throw new Error('Has alcanzado el límite de descargas. Actualiza a Premium para descargas ilimitadas.');
    }
    
    throw new Error(error.response?.data?.message || 'Error al descargar el PDF');
  }
};

/**
 * Verifica el estado de descargas del usuario
 * @returns {Promise<Object>}
 */
export const checkDownloadStatus = async () => {
  try {
    const response = await api.get('/user/download-status');
    return response.data;
  } catch (error) {
    console.error('Check download status error:', error);
    throw error;
  }
};
