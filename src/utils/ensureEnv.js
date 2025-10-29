const requiredEnv = [
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET',
  'JWT_SECRET',
  'MONGODB_URL',
];

export function ensureEnv() {
  const missing = requiredEnv.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    const list = missing.join(', ');
    throw new Error(`Missing required environment variables: ${list}`);
  }
}