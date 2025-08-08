/**
 * Normalizes CV payload to ensure backward compatibility
 * Converts old format with 'personal' field to new format with 'personalInfo'
 */
function normalizeCvPayload(payload) {
  const normalized = { ...payload };

  // Handle backward compatibility: convert 'personal' to 'personalInfo'
  if (payload.personal && !payload.personalInfo) {
    normalized.personalInfo = payload.personal;
    delete normalized.personal;
  }

  // Ensure personalInfo has required structure
  if (normalized.personalInfo) {
    // Map old field names to new ones if needed
    if (normalized.personalInfo.name && !normalized.personalInfo.firstName) {
      const nameParts = normalized.personalInfo.name.split(' ');
      normalized.personalInfo.firstName = nameParts[0] || '';
      normalized.personalInfo.lastName = nameParts.slice(1).join(' ') || '';
      delete normalized.personalInfo.name;
    }
  }

  // Ensure contact section exists
  if (!normalized.contact) {
    normalized.contact = {};
  }

  // Handle old contact fields that might be in personalInfo
  if (normalized.personalInfo) {
    ['email', 'phone', 'address', 'linkedin', 'github'].forEach(field => {
      if (normalized.personalInfo[field] && !normalized.contact[field]) {
        normalized.contact[field] = normalized.personalInfo[field];
        delete normalized.personalInfo[field];
      }
    });
  }

  return normalized;
}

/**
 * Validates CV payload structure
 */
function validateCvPayload(payload) {
  const errors = [];

  if (!payload.personalInfo) {
    errors.push('personalInfo is required');
  } else {
    if (!payload.personalInfo.firstName) {
      errors.push('personalInfo.firstName is required');
    }
    if (!payload.personalInfo.lastName) {
      errors.push('personalInfo.lastName is required');
    }
  }

  if (!payload.title || typeof payload.title !== 'string' || payload.title.trim() === '') {
    errors.push('title is required and must be a non-empty string');
  }

  return errors;
}

module.exports = {
  normalizeCvPayload,
  validateCvPayload
};