export const BACKEND_URL = 'http://localhost:3001';

// Injected at build time by webpack.EnvironmentPlugin (see webpack.config.js).
export const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY ?? '';
