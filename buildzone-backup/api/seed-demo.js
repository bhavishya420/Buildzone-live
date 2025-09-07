import { seedDemoData } from '../scripts/seed-demo.js';

export default async function handler(req, res) {
  // Set CORS headers
  res?.setHeader('Access-Control-Allow-Credentials', true);
  res?.setHeader('Access-Control-Allow-Origin', '*');
  res?.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res?.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, x-seed-token');

  if (req?.method === 'OPTIONS') {
    res?.status(200)?.end();
    return;
  }

  try {
    // Security: Check for seed token
    const seedToken = req?.headers?.['x-seed-token'] || req?.query?.token;
    const expectedToken = process.env?.SEED_TOKEN;

    if (!expectedToken) {
      return res?.status(500)?.json({
        success: false,
        error: 'Seed token not configured on server'
      });
    }

    if (seedToken !== expectedToken) {
      return res?.status(401)?.json({
        success: false,
        error: 'Invalid or missing seed token'
      });
    }

    // Check environment
    if (process.env?.NODE_ENV === 'production' && !req?.query?.force) {
      return res?.status(403)?.json({
        success: false,
        error: 'Demo seeding is disabled in production. Use ?force=true to override.',
        warning: 'This will modify production data!'
      });
    }

    console.log('🌱 API: Starting demo data seeding...');
    
    // Run the seeding function
    const result = await seedDemoData();

    // Return appropriate status code
    const statusCode = result?.success ? 200 : 500;
    
    return res?.status(statusCode)?.json({
      ...result,
      timestamp: new Date()?.toISOString(),
      environment: process.env?.NODE_ENV || 'development'
    });

  } catch (error) {
    console.error('❌ Seed demo API error:', error);
    
    return res?.status(500)?.json({
      success: false,
      error: 'Demo seeding failed',
      message: error?.message,
      timestamp: new Date()?.toISOString(),
      details: process.env?.NODE_ENV === 'development' ? error?.stack : undefined
    });
  }
}

// Handle different HTTP methods
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};