/**
 * server.js - OPTIMIZED FOR 40M RECORDS ON 8GB RAM
 * Memory-efficient with streaming, timeouts, and monitoring
 */

import express from "express";
import cors from "cors";
import morgan from "morgan";
import compression from "compression";
import dotenv from "dotenv";
import { Pool } from "pg";
import { Transform } from "stream";

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(morgan("combined"));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Memory monitoring middleware
app.use((req, res, next) => {
  const used = process.memoryUsage();
  const heapUsedMB = Math.round(used.heapUsed / 1024 / 1024);
  if (heapUsedMB > 500) {
    console.warn(`🚨 High memory usage: ${heapUsedMB}MB`);
  }
  next();
});

// Configuration
const PORT = process.env.PORT || 4002;
const DB_URL = process.env.DATABASE_URL;

if (!DB_URL) {
  console.error("❌ DATABASE_URL is required in .env file");
  console.log("💡 Example: DATABASE_URL=postgresql://user:pass@localhost:5432/dbname");
  process.exit(1);
}

// Database connection with optimizations for 8GB RAM
const pool = new Pool({
  connectionString: DB_URL,
  max: 10, // Reduced from 20 for memory efficiency
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  statement_timeout: 30000, // 30 second query timeout
  query_timeout: 30000,
  ...(process.env.NODE_ENV === 'production' ? {} : {
    ssl: false
  })
});

// Query timeout wrapper
const executeWithTimeout = async (query, params, timeoutMs = 30000) => {
  const client = await pool.connect();
  try {
    await client.query(`SET statement_timeout = ${timeoutMs}`);
    const result = await client.query(query, params);
    return result;
  } finally {
    client.release();
  }
};

// Test database connection on startup
async function initializeDatabase() {
  let client;
  try {
    console.log("🔌 Testing database connection...");
    client = await pool.connect();
    
    // Test query with timeout
    const testQuery = await executeWithTimeout(`
      SELECT 
        table_name,
        column_name,
        data_type
      FROM information_schema.columns 
      WHERE table_name = 'apollo_contacts'
      ORDER BY ordinal_position
      LIMIT 50
    `);
    
    console.log("✅ Database connected successfully");
    console.log(`📋 Table structure: ${testQuery.rows.length} columns found`);
    
    // Log available columns for debugging
    const columns = testQuery.rows.map(row => row.column_name);
    console.log("📊 Available columns:", columns.slice(0, 20)); // Limit output
    
    return columns;
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    console.log("💡 Check your DATABASE_URL and ensure PostgreSQL is running");
    process.exit(1);
  } finally {
    if (client) client.release();
  }
}

// Column mapping with fallbacks
let columnMapping = {};

async function initializeColumnMapping(availableColumns) {
  console.log("🎯 Initializing column mapping...");
  
  const findBestColumn = (preferredColumns) => {
    for (const col of preferredColumns) {
      if (availableColumns.includes(col)) {
        console.log(`✅ Using column: ${col}`);
        return col;
      }
    }
    console.log(`❌ No column found for: ${preferredColumns.join(', ')}`);
    return null;
  };

  columnMapping = {
    industry: findBestColumn(['industry_clean', 'industry', 'company_industry']),
    sub_industry: findBestColumn(['sub_industry_clean', 'sub_industry']),
    job_title: findBestColumn(['job_title_clean', 'job_title', 'title']),
    sub_role: findBestColumn(['sub_role_clean', 'sub_role', 'role', 'job_role', 'position']),
    metro: findBestColumn(['company_metro_clean', 'company_metro', 'metro', 'city', 'company_city', 'location_metro', 'location_city', 'metro_area']),
    region: findBestColumn(['company_region_clean', 'company_region', 'region', 'state', 'company_state']),
    first_name: findBestColumn(['first_name_clean', 'first_name']),
    last_name: findBestColumn(['last_name_clean', 'last_name'])
  };

  console.log("🎯 Final column mapping:", columnMapping);
  return columnMapping;
}

// Health check endpoint with memory info
app.get("/health", async (req, res) => {
  let client;
  try {
    client = await pool.connect();
    
    // Get basic stats with timeout
    const statsQuery = `
      SELECT 
        COUNT(*) as total_records,
        ${columnMapping.metro ? `
          COUNT(DISTINCT ${columnMapping.metro}) as unique_metros,
          COUNT(${columnMapping.metro}) as metro_records
        ` : '0 as unique_metros, 0 as metro_records'},
        ${columnMapping.region ? `
          COUNT(DISTINCT ${columnMapping.region}) as unique_regions
        ` : '0 as unique_regions'},
        ${columnMapping.industry ? `
          COUNT(DISTINCT ${columnMapping.industry}) as unique_industries
        ` : '0 as unique_industries'}
      FROM apollo_contacts
      LIMIT 1
    `;
    
    const statsResult = await executeWithTimeout(statsQuery);
    const stats = statsResult.rows[0];
    
    // Memory usage
    const used = process.memoryUsage();
    const memoryInfo = {
      heapUsed: Math.round(used.heapUsed / 1024 / 1024) + 'MB',
      heapTotal: Math.round(used.heapTotal / 1024 / 1024) + 'MB',
      rss: Math.round(used.rss / 1024 / 1024) + 'MB'
    };

    res.json({
      success: true,
      message: "✅ Server is healthy and running",
      database: "✅ Connected",
      memory: memoryInfo,
      column_mapping: columnMapping,
      metro_available: !!columnMapping.metro,
      sub_role_available: !!columnMapping.sub_role,
      stats: {
        total_records: parseInt(stats.total_records) || 0,
        unique_metros: parseInt(stats.unique_metros) || 0,
        metro_records: parseInt(stats.metro_records) || 0,
        unique_regions: parseInt(stats.unique_regions) || 0,
        unique_industries: parseInt(stats.unique_industries) || 0
      },
      optimizations: {
        query_timeout: "30s",
        max_connections: 10,
        streaming_exports: true,
        memory_monitoring: true
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error("Health check error:", error);
    res.status(500).json({
      success: false,
      error: "Database connection failed",
      details: error.message
    });
  } finally {
    if (client) client.release();
  }
});

// Build filters with proper parameter handling
function buildFiltersFromQuery(queryParams) {
  const conditions = [];
  const params = [];
  let paramCount = 0;

  console.log("🔄 Building filters from:", Object.keys(queryParams).filter(k => !['page', 'limit'].includes(k)));

  const addFilter = (fieldName, columnName, filterType) => {
    if (!queryParams[fieldName] || !columnName) return;
    
    const values = Array.isArray(queryParams[fieldName]) 
      ? queryParams[fieldName] 
      : [queryParams[fieldName]];
    
    const validValues = values.filter(v => v && v.trim() !== '');
    if (validValues.length === 0) return;
    
    console.log(`🎯 Applying ${filterType} filter on ${columnName}:`, validValues.slice(0, 3)); // Limit logging
    
    // Use ILIKE for case-insensitive matching
    const placeholders = validValues.map(value => {
      paramCount++;
      params.push(`%${value}%`);
      return `${columnName} ILIKE $${paramCount}`;
    });
    
    conditions.push(`(${placeholders.join(' OR ')})`);
  };

  // Apply all filters
  addFilter('industry', columnMapping.industry, 'industry');
  addFilter('sub_industry', columnMapping.sub_industry, 'sub_industry');
  addFilter('job_title', columnMapping.job_title, 'job_title');
  addFilter('sub_role', columnMapping.sub_role, 'sub_role');
  addFilter('metro', columnMapping.metro, 'metro');
  addFilter('region', columnMapping.region, 'region');

  console.log(`✅ Built ${conditions.length} filter conditions with ${params.length} parameters`);
  return { conditions, params };
}

// Contacts endpoint with timeout protection
app.get("/contacts", async (req, res) => {
  const { page = 1, limit = 50 } = req.query;
  const pageNum = Math.max(parseInt(page), 1);
  const limitNum = Math.min(Math.max(parseInt(limit), 1), 1000);
  const offset = (pageNum - 1) * limitNum;

  console.log("📥 Contacts request:", { 
    page: pageNum, 
    limit: limitNum,
    filters: Object.keys(req.query).filter(k => !['page', 'limit'].includes(k))
  });

  let client;
  try {
    const { conditions, params } = buildFiltersFromQuery(req.query);
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    client = await pool.connect();

    // Count query with timeout
    const countSql = `SELECT COUNT(*) as total FROM apollo_contacts ${whereClause}`;
    console.log(`🔢 Count SQL: ${countSql}`, params.slice(0, 3)); // Limit logging
    
    const countResult = await executeWithTimeout(countSql, params);
    const totalRecords = parseInt(countResult.rows[0]?.total || 0);
    const totalPages = Math.ceil(totalRecords / limitNum);

    // Data query with timeout
    const dataSql = `
      SELECT * 
      FROM apollo_contacts 
      ${whereClause}
      ORDER BY id ASC
      LIMIT $${params.length + 1} 
      OFFSET $${params.length + 2}
    `;
    
    const dataParams = [...params, limitNum, offset];
    console.log(`📊 Data SQL: ${dataSql}`, dataParams.slice(0, 3)); // Limit logging
    
    const dataResult = await executeWithTimeout(dataSql, dataParams);

    console.log(`✅ Returning ${dataResult.rows.length} records (Total: ${totalRecords})`);

    res.json({
      success: true,
      data: {
        rows: dataResult.rows,
        applied_filters: conditions,
        metro_available: !!columnMapping.metro,
        sub_role_available: !!columnMapping.sub_role,
        pagination: {
          currentPage: pageNum,
          recordsPerPage: limitNum,
          totalRecords,
          totalPages,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1
        }
      }
    });

  } catch (error) {
    console.error("❌ Contacts endpoint error:", error);
    if (error.message.includes('timeout')) {
      res.status(408).json({
        success: false,
        error: "Query timeout - try simplifying your filters",
        details: "The query took too long to execute. Please use more specific filters."
      });
    } else {
      res.status(500).json({
        success: false,
        error: "Failed to fetch contacts",
        details: error.message,
        query: req.query
      });
    }
  } finally {
    if (client) client.release();
  }
});

// Filter search endpoint with pagination and timeout
app.get("/filters/search", async (req, res) => {
  const { type, query = "", limit = 100, page = 1 } = req.query; // Added pagination
  const limitNum = Math.min(parseInt(limit), 1000);
  const pageNum = Math.max(parseInt(page), 1);
  const offset = (pageNum - 1) * limitNum;

  console.log(`🔍 Filter search: ${type}`, { query, limit: limitNum, page: pageNum });

  let client;
  try {
    // Get the correct column name
    const columnName = columnMapping[type];
    
    if (!columnName) {
      return res.json({
        success: true,
        data: {
          type,
          items: [],
          total: 0,
          available: false,
          message: `Column mapping not found for ${type}`
        }
      });
    }

    client = await pool.connect();
    const params = [];
    
    // Build the search query with pagination
    let sql = `
      SELECT DISTINCT ${columnName} as item, COUNT(*) as item_count
      FROM apollo_contacts 
      WHERE ${columnName} IS NOT NULL AND ${columnName} != ''
    `;
    
    if (query && query.trim() !== '') {
      params.push(`%${query}%`);
      sql += ` AND ${columnName} ILIKE $${params.length}`;
    }
    
    sql += ` GROUP BY ${columnName} ORDER BY item_count DESC, item ASC`;
    sql += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limitNum, offset);

    console.log(`📊 Filter SQL: ${sql}`, params);
    
    const result = await executeWithTimeout(sql, params);
    const items = result.rows.map(row => row.item).filter(item => item && item.trim() !== '');

    // Get total count for pagination
    let totalCount = 0;
    try {
      const countSql = `
        SELECT COUNT(DISTINCT ${columnName}) as total
        FROM apollo_contacts 
        WHERE ${columnName} IS NOT NULL AND ${columnName} != ''
        ${query && query.trim() !== '' ? `AND ${columnName} ILIKE $1` : ''}
      `;
      const countParams = query && query.trim() !== '' ? [`%${query}%`] : [];
      const countResult = await executeWithTimeout(countSql, countParams);
      totalCount = parseInt(countResult.rows[0]?.total || 0);
    } catch (countError) {
      console.warn('Count query failed, using estimate:', countError.message);
      totalCount = items.length;
    }

    console.log(`✅ Returned ${items.length} ${type} options (page ${pageNum})`);

    res.json({
      success: true,
      data: {
        type,
        items,
        total: totalCount,
        page: pageNum,
        limit: limitNum,
        has_more: (pageNum * limitNum) < totalCount,
        available: true,
        column_used: columnName
      }
    });

  } catch (error) {
    console.error(`❌ Filter search error for ${type}:`, error);
    if (error.message.includes('timeout')) {
      res.status(408).json({
        success: false,
        error: `Search timeout for ${type}`,
        details: "Try a more specific search term"
      });
    } else {
      res.status(500).json({
        success: false,
        error: `Failed to search ${type} options`,
        details: error.message
      });
    }
  } finally {
    if (client) client.release();
  }
});

// Stream CSV export to handle large datasets
app.get("/export/csv", async (req, res) => {
  let client;
  try {
    const { conditions, params } = buildFiltersFromQuery(req.query);
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    client = await pool.connect();

    // Get column names first
    const columnsQuery = `SELECT * FROM apollo_contacts LIMIT 1`;
    const columnsResult = await executeWithTimeout(columnsQuery);
    const headers = Object.keys(columnsResult.rows[0]).join(',');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="apollo_export_${new Date().toISOString().split('T')[0]}.csv"`);
    
    // Write headers
    res.write(headers + '\n');

    // Stream data in chunks
    const query = `SELECT * FROM apollo_contacts ${whereClause} ORDER BY id`;
    console.log(`📤 Stream CSV: ${query}`, params.slice(0, 3));

    const batchSize = 1000;
    let offset = 0;
    let hasMore = true;

    while (hasMore && !res.destroyed) {
      const batchQuery = `${query} LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
      const batchParams = [...params, batchSize, offset];
      
      const batchResult = await executeWithTimeout(batchQuery, batchParams);
      const rows = batchResult.rows;

      if (rows.length === 0) {
        hasMore = false;
        break;
      }

      // Convert batch to CSV and stream
      const csvBatch = rows.map(row => 
        Object.values(row).map(val => 
          `"${String(val || '').replace(/"/g, '""')}"`
        ).join(',')
      ).join('\n');

      res.write(csvBatch + '\n');
      offset += batchSize;

      // Add small delay to prevent memory buildup
      await new Promise(resolve => setTimeout(resolve, 10));
    }

    res.end();
    console.log(`✅ CSV export completed: ${offset} records`);

  } catch (error) {
    console.error("Export CSV error:", error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        error: "Failed to export CSV",
        details: error.message
      });
    }
  } finally {
    if (client) client.release();
  }
});

// Performance monitoring endpoint
app.get("/performance", (req, res) => {
  const used = process.memoryUsage();
  const memoryInfo = {
    heapUsed: Math.round(used.heapUsed / 1024 / 1024) + 'MB',
    heapTotal: Math.round(used.heapTotal / 1024 / 1024) + 'MB',
    rss: Math.round(used.rss / 1024 / 1024) + 'MB',
    external: Math.round(used.external / 1024 / 1024) + 'MB'
  };

  res.json({
    success: true,
    memory: memoryInfo,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    recommendations: [
      "Ensure database indexes are created for filtered columns",
      "Use specific search terms for better performance",
      "Export data in smaller batches if needed",
      "Monitor memory usage during large operations"
    ]
  });
});

// Refresh data endpoint
app.post("/refresh", async (req, res) => {
  try {
    const availableColumns = await initializeDatabase();
    const mapping = await initializeColumnMapping(availableColumns);
    
    res.json({
      success: true,
      message: "Data refreshed successfully",
      column_mapping: mapping,
      memory_optimized: true,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Refresh error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to refresh data",
      details: error.message
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Endpoint not found: ${req.method} ${req.path}`,
    available_endpoints: [
      "GET  /health",
      "GET  /contacts",
      "GET  /filters/search",
      "GET  /debug/metro", 
      "GET  /test/metro",
      "GET  /export/csv",
      "GET  /performance",
      "POST /refresh"
    ]
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("🚨 Unhandled error:", error);
  res.status(500).json({
    success: false,
    error: "Internal server error",
    details: error.message
  });
});

// Start server
async function startServer() {
  try {
    console.log("🚀 Starting Apollo Database Backend - OPTIMIZED FOR 40M RECORDS");
    console.log("💡 Memory optimizations enabled for 8GB RAM system");
    
    // Initialize database and column mapping
    const availableColumns = await initializeDatabase();
    await initializeColumnMapping(availableColumns);
    
    // Start HTTP server
    app.listen(PORT, () => {
      console.log(`✅ OPTIMIZED BACKEND RUNNING on http://localhost:${PORT}`);
      console.log(`📊 Available endpoints:`);
      console.log(`   GET  /health - Health check with memory info`);
      console.log(`   GET  /contacts - Get contacts with filters (30s timeout)`);
      console.log(`   GET  /filters/search - Filter options with pagination`);
      console.log(`   GET  /export/csv - Stream CSV export for large datasets`);
      console.log(`   GET  /performance - Memory and performance metrics`);
      console.log(`   POST /refresh - Refresh data mapping`);
      console.log(`\n🔧 Optimizations:`);
      console.log(`   • Query timeout: 30 seconds`);
      console.log(`   • Max connections: 10`);
      console.log(`   • Streamed CSV exports`);
      console.log(`   • Memory monitoring`);
      console.log(`   • Paginated filter searches`);
      console.log(`\n💡 For 40M records, ensure PostgreSQL has proper indexes!`);
    });
    
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server gracefully...');
  await pool.end();
  console.log('✅ Server shut down successfully');
  process.exit(0);
});

process.on('uncaughtException', (error) => {
  console.error('🚨 Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('🚨 Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Memory usage monitoring
setInterval(() => {
  const used = process.memoryUsage();
  const heapUsedMB = Math.round(used.heapUsed / 1024 / 1024);
  if (heapUsedMB > 800) {
    console.warn(`🚨 CRITICAL MEMORY USAGE: ${heapUsedMB}MB - Consider restarting`);
  }
}, 30000); // Check every 30 seconds

// Start the server
startServer();