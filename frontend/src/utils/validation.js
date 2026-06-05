// =============================================
// VALIDATION HELPERS
// =============================================

export const validators = {
  required: (value) => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return 'This field is required';
    }
    return null;
  },

  email: (value) => {
    if (!value) return 'Email is required';
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(value)) return 'Enter a valid email address';
    return null;
  },

  phone: (value) => {
    if (!value) return 'Phone number is required';
    const cleaned = value.replace(/[\s+\-()]/g, '');
    if (!/^\d{10,13}$/.test(cleaned)) return 'Enter a valid 10-digit phone number';
    return null;
  },

  password: (value) => {
    if (!value) return 'Password is required';
    if (value.length < 6) return 'Password must be at least 6 characters';
    return null;
  },

  confirmPassword: (value, password) => {
    if (!value) return 'Please confirm your password';
    if (value !== password) return 'Passwords do not match';
    return null;
  },

  minLength: (min) => (value) => {
    if (!value || value.length < min) return `Must be at least ${min} characters`;
    return null;
  },

  maxLength: (max) => (value) => {
    if (value && value.length > max) return `Must be at most ${max} characters`;
    return null;
  },

  positiveNumber: (value) => {
    if (!value && value !== 0) return 'This field is required';
    if (isNaN(value) || Number(value) <= 0) return 'Must be a positive number';
    return null;
  },

  time: (value) => {
    if (!value) return 'Time is required';
    const re = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!re.test(value)) return 'Enter a valid time (HH:MM)';
    return null;
  },

  date: (value) => {
    if (!value) return 'Date is required';
    const d = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (isNaN(d.getTime())) return 'Enter a valid date';
    if (d < today) return 'Date cannot be in the past';
    return null;
  },
};

// Validate a whole form object
export const validateForm = (fields, rules) => {
  const errors = {};
  let isValid = true;

  for (const [key, value] of Object.entries(fields)) {
    const fieldRules = rules[key] || [];
    for (const rule of fieldRules) {
      const error = typeof rule === 'function' ? rule(value, fields) : null;
      if (error) {
        errors[key] = error;
        isValid = false;
        break;
      }
    }
  }

  return { errors, isValid };
};

// Single field validation
export const validateField = (value, rules = []) => {
  for (const rule of rules) {
    const error = rule(value);
    if (error) return error;
  }
  return null;
};