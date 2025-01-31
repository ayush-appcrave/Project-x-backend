import { config as dotenvConfig } from 'dotenv';
dotenvConfig();
const getEnvVar = (key, defaultValue) => {
  const value = process.env[key];
  if (!value) {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(`Environment variable ${key} is not defined`);
  }
  return value;
};

const config = {
  port: getEnvVar('PORT', '3000'),
  mongo_db_uri: getEnvVar('MONGODB_URI'),
  frontend_domain: getEnvVar('CORS_ORIGIN', '*'),
  access_token_secret: getEnvVar('ACCESS_TOKEN_SECRET'),
  access_token_expiry: getEnvVar('ACCESS_TOKEN_EXPIRY', '3600000'), // Default to 1 hour
  refresh_token_secret: getEnvVar('REFRESH_TOKEN_SECRET'),
  refresh_token_expiry: getEnvVar('REFRESH_TOKEN_EXPIRY', '86400000'), // Default to 1 day
  isDevelopment: process.env.NODE_ENV === 'development',
  uploadsDir: getEnvVar('UPLOADS_DIR', 'uploads'),
};

Object.freeze(config);

export { config };
