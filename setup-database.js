require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function setupDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Connecting to Neon database...');
    
    // Create users table
    console.log('📋 Creating users table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        company_name VARCHAR(255),
        role VARCHAR(20) DEFAULT 'client',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP,
        created_by INTEGER REFERENCES users(id)
      )
    `);
    console.log('✅ Users table created');

    // Create media table
    console.log('📋 Creating media table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS media (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        file_type VARCHAR(50) NOT NULL,
        file_url VARCHAR(500) NOT NULL,
        thumbnail_url VARCHAR(500),
        file_size BIGINT,
        upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        project_name VARCHAR(255),
        tags TEXT[]
      )
    `);
    console.log('✅ Media table created');

    // Create projects table
    console.log('📋 Creating projects table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        project_name VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(50) DEFAULT 'active'
      )
    `);
    console.log('✅ Projects table created');

    // Create super admin account
    console.log('👤 Creating super admin account...');
    const adminEmail = 'kevin@aibridgesolutions.co.uk';
    const adminPassword = 'a15Dz6fl!';
    
    const adminExists = await client.query(
      'SELECT * FROM users WHERE email = $1',
      [adminEmail]
    );

    if (adminExists.rows.length === 0) {
      const passwordHash = await bcrypt.hash(adminPassword, 10);
      await client.query(
        'INSERT INTO users (email, password_hash, first_name, last_name, role) VALUES ($1, $2, $3, $4, $5)',
        [adminEmail, passwordHash, 'Kevin', 'Admin', 'admin']
      );
      console.log('✅ Super admin account created');
      console.log('   Email: kevin@aibridgesolutions.co.uk');
      console.log('   Password: a15Dz6fl!');
    } else {
      console.log('ℹ️  Super admin account already exists');
    }

    console.log('\n🎉 Database setup complete!');
    console.log('\n📝 Summary:');
    console.log('   - Users table: ✓');
    console.log('   - Media table: ✓');
    console.log('   - Projects table: ✓');
    console.log('   - Admin account: ✓');
    console.log('\n🚀 You can now login at: /client-login.html');
    
  } catch (error) {
    console.error('❌ Error setting up database:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

setupDatabase()
  .then(() => {
    console.log('\n✅ Setup completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Setup failed:', error);
    process.exit(1);
  });
