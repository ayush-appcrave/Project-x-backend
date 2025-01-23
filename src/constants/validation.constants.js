export const VALIDATION_REGEX = {
  EMAIL: /^[a-z0-9](\.?[a-z0-9_-])*@[a-z0-9-]+(\.[a-z]{2,})+$/, // Matches only lowercase email addresses
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
  PASSWORD_RULES: {
    UPPERCASE: /^(?=.*[A-Z])/,
    LOWERCASE: /^(?=.*[a-z])/,
    NUMBER: /^(?=.*[0-9])/,
    SPECIAL_CHAR: /^(?=.*[!@#$%^&*])/,
  },
};

export const VALIDATION_MESSAGES = {
  EMAIL: 'Please enter a valid email address in lowercase only',
  PASSWORD: {
    MIN_LENGTH: 'Password must be at least 8 characters',
    UPPERCASE: 'Password must contain at least one uppercase letter',
    LOWERCASE: 'Password must contain at least one lowercase letter',
    NUMBER: 'Password must contain at least one number',
    SPECIAL_CHAR:
      'Password must contain at least one special character (!@#$%^&*)',
  },
};
