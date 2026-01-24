import { pool } from './db.js';

async function debugFilters() {
  try {
    console.log('🔍 DEBUG: Checking database and filters...\n');

    // Test basic connection
    const client = await pool.connect();
    console.log('✅ Database connected');

    // Check if table exists
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'apollo_contacts'
      );
    `);

    if (!tableCheck.rows[0].exists) {
      console.log('❌ Table "apollo_contacts" does not exist!');
      client.release();
      return;
    }
    console.log('✅ Table "apollo_contacts" exists');

    // Check row count
    const countResult = await client.query('SELECT COUNT(*) as count FROM apollo_contacts');
    const totalRows = parseInt(countResult.rows[0].count);
    console.log(`📊 Total rows in table: ${totalRows}`);

    if (totalRows === 0) {
      console.log('❌ Table is empty! No data to filter.');
      client.release();
      return;
    }

    // Test each filter query individually
    const filterQueries = {
      industry: "SELECT DISTINCT industry FROM apollo_contacts WHERE industry IS NOT NULL AND industry != '' ORDER BY industry",
      sub_industry: "SELECT DISTINCT sub_industry FROM apollo_contacts WHERE sub_industry IS NOT NULL AND sub_industry != '' ORDER BY sub_industry",
      job_title: "SELECT DISTINCT job_title FROM apollo_contacts WHERE job_title IS NOT NULL AND job_title != '' ORDER BY job_title",
      sub_role: "SELECT DISTINCT sub_role FROM apollo_contacts WHERE sub_role IS NOT NULL AND sub_role != '' ORDER BY sub_role",
      metro: "SELECT DISTINCT company_metro FROM apollo_contacts WHERE company_metro IS NOT NULL AND company_metro != '' ORDER BY company_metro",
      region: "SELECT DISTINCT company_region FROM apollo_contacts WHERE company_region IS NOT NULL AND company_region != '' ORDER BY company_region"
    };

    console.log('\n🔍 Testing individual filter queries:');
    
    for (const [filterName, query] of Object.entries(filterQueries)) {
      try {
        console.log(`\nTesting ${filterName}...`);
        const startTime = Date.now();
        const result = await client.query(query);
        const endTime = Date.now();
        
        console.log(`✅ ${filterName}: ${result.rows.length} items (took ${endTime - startTime}ms)`);
        
        if (result.rows.length > 0) {
          console.log(`   Sample: ${result.rows.slice(0, 3).map(r => {
            const key = filterName === 'metro' ? 'company_metro' : 
                       filterName === 'region' ? 'company_region' : filterName;
            return r[key];
          }).join(', ')}`);
        } else {
          console.log(`   ⚠️ No data found for ${filterName}`);
        }
      } catch (error) {
        console.log(`❌ Error in ${filterName}:`, error.message);
      }
    }

    client.release();
    console.log('\n🎯 Debug completed');

  } catch (error) {
    console.error('❌ Debug failed:', error.message);
    }
}

debugFilters();