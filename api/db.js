const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Track if database has been initialized
let isInitialized = false;

// Initialize database tables
async function initializeDatabase() {
  // Skip if already initialized
  if (isInitialized) {
    return;
  }

  const client = await pool.connect();
  try {
    console.log('Initializing database...');
    
    // Users table
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
        created_by INTEGER
      )
    `);
    console.log('Users table ready');

    // Create super admin if doesn't exist
    const bcrypt = require('bcryptjs');
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
      console.log('Super admin account created');
    } else {
      console.log('Super admin already exists');
    }

    // Media library table
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

    // Projects table
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

    console.log('Database tables initialized successfully');
    isInitialized = true;
  } catch (error) {
    console.error('Error initializing database:', error);
    console.error('Error details:', error.message);
    console.error('Stack:', error.stack);
    throw error;
  } finally {
    client.release();
  }
}

module.exports = { pool, initializeDatabase };
