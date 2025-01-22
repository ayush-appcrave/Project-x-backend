export const VALIDATION_REGEX = {
    EMAIL: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
    PASSWORD_RULES: {
      UPPERCASE: /^(?=.*[A-Z])/,
      LOWERCASE: /^(?=.*[a-z])/,
      NUMBER: /^(?=.*[0-9])/,
      SPECIAL_CHAR: /^(?=.*[!@#$%^&*])/,
    },
  };
  
  export const VALIDATION_MESSAGES = {
    EMAIL: 'Please enter a valid email address',
    PASSWORD: {
      MIN_LENGTH: 'Password must be at least 8 characters',
      UPPERCASE: 'Password must contain at least one uppercase letter',
      LOWERCASE: 'Password must contain at least one lowercase letter',
      NUMBER: 'Password must contain at least one number',
      SPECIAL_CHAR: 'Password must contain at least one special character (!@#$%^&*)',
      GENERAL: 'Password must meet all requirements',
    },
  };
  