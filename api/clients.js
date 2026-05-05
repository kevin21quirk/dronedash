const { pool } = require('./db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function getClients(req, res, userId) {
  try {
    const result = await pool.query(
      'SELECT id, email, first_name, last_name, company_name, created_at, last_login FROM users WHERE role = $1 ORDER BY created_at DESC',
      ['client']
    );

    res.json({
      success: true,
      clients: result.rows
    });
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ error: 'Failed to fetch clients' });
  }
}

async function createClient(req, res, adminId) {
  try {
    const { email, password, firstName, lastName, companyName } = req.body;

    // Check if client already exists
    const existingClient = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (existingClient.rows.length > 0) {
      return res.status(400).json({ error: 'Client with this email already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert new client
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, first_name, last_name, company_name, role, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, email, first_name, last_name, company_name',
      [email, passwordHash, firstName, lastName, companyName, 'client', adminId]
    );

    res.json({
      success: true,
      client: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating client:', error);
    res.status(500).json({ error: 'Failed to create client' });
  }
}

async function deleteClient(req, res) {
  try {
    const { clientId } = req.body;

    await pool.query('DELETE FROM users WHERE id = $1 AND role = $2', [clientId, 'client']);

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({ error: 'Failed to delete client' });
  }
}

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Verify token and admin role
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Check if user is admin
    const userResult = await pool.query('SELECT role FROM users WHERE id = $1', [userId]);
    if (userResult.rows.length === 0 || userResult.rows[0].role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    if (req.method === 'GET') {
      return getClients(req, res, userId);
    } else if (req.method === 'POST') {
      return createClient(req, res, userId);
    } else if (req.method === 'DELETE') {
      return deleteClient(req, res);
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
