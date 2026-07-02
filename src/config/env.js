import dotenv from 'dotenv';

dotenv.config();

const required = ['DB_HOST', 'DB_USER', 'DB_NAME', 'JWT_SECRET'];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

const parseBoolean = (value, defaultValue) => {
  if (value === undefined) return defaultValue;
  return String(value).toLowerCase() === 'true';
};

const parseAdminEmails = (value) =>
  new Set(
    (value ?? '')
      .split(',')
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  );

export const env = {
  port: Number(process.env.PORT ?? 3000),
  host: process.env.HOST ?? '127.0.0.1',
  nodeEnv: process.env.NODE_ENV ?? 'development',
  db: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD ?? '',
    database: process.env.DB_NAME,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN ?? '1d',
  },
  adminEmails: parseAdminEmails(process.env.ADMIN_EMAILS),
  signupEnabled: parseBoolean(process.env.SIGNUP_ENABLED, true),
};
