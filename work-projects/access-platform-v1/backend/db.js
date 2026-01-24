import pg from 'pg';
const { Pool } = pg;
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Database configuration - FIXED: Proper environment variable handling
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'postgres',
  password: process.env.DB_PASSWORD || 'At12345',
  port: parseInt(process.env.DB_PORT) || 5432,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Event listeners for connection pool
pool.on('connect', (client) => {
  console.log('✅ New client connected to PostgreSQL database');
});

pool.on('error', (err, client) => {
  console.error('❌ Unexpected error on idle client:', err);
});

// Test connection on startup
const testConnection = async () => {
  let client;
  try {
    client = await pool.connect();
    console.log('✅ Database connection test successful');
    
    // Test query to verify database accessibility
    const result = await client.query('SELECT version()');
    console.log('📊 PostgreSQL Version:', result.rows[0].version);
    
    // Check if our table exists
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'apollo_contacts'
      );
    `);
    
    if (tableCheck.rows[0].exists) {
      console.log('✅ apollo_contacts table exists');
      
      // Get row count for information
      const countResult = await client.query('SELECT COUNT(*) as total FROM apollo_contacts');
      console.log(`📈 Total records in apollo_contacts: ${parseInt(countResult.rows[0].total).toLocaleString()}`);
    } else {
      console.log('⚠️ apollo_contacts table does not exist');
    }
    
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    console.log('💡 Please check your:');
    console.log('   - Database server is running');
    console.log('   - Connection credentials in .env file');
    console.log('   - Database name exists');
  } finally {
    if (client) {
      client.release();
    }
  }
};

// Initialize connection test
testConnection();

// Enhanced query function with error handling
const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log(`📊 Executed query in ${duration}ms: ${text.substring(0, 100)}...`);
    return res;
  } catch (error) {
    console.error('❌ Query error:', error.message);
    console.error('📝 Failed query:', text);
    throw error;
  }
};

// Health check function
const healthCheck = async () => {
  try {
    const result = await pool.query('SELECT 1 as health_check');
    return {
      healthy: true,
      message: 'Database connection is healthy',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      healthy: false,
      message: `Database connection failed: ${error.message}`,
      timestamp: new Date().toISOString()
    };
  }
};

// Graceful shutdown
const gracefulShutdown = () => {
  console.log('🛑 Received shutdown signal, closing database pool...');
  pool.end(() => {
    console.log('✅ Database pool has been closed');
    process.exit(0);
  });
};

// Handle process termination
process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

// Export everything
export { 
  pool, 
  query, 
  healthCheck, 
  gracefulShutdown 
};

export default pool;