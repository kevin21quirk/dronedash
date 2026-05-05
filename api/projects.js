const { pool } = require('./db');
const jwt = require('jsonwebtoken');

async function getProjects(req, res) {
  try {
    const result = await pool.query(
      'SELECT p.*, u.first_name, u.last_name, u.email FROM projects p LEFT JOIN users u ON p.user_id = u.id ORDER BY p.created_at DESC'
    );

    res.json({
      success: true,
      projects: result.rows
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
}

async function createProject(req, res) {
  try {
    const { userId, projectName, description, status } = req.body;

    const result = await pool.query(
      'INSERT INTO projects (user_id, project_name, description, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, projectName, description, status || 'active']
    );

    res.json({
      success: true,
      project: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
}

async function deleteProject(req, res) {
  try {
    const { projectId } = req.body;

    await pool.query('DELETE FROM projects WHERE id = $1', [projectId]);

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const userResult = await pool.query('SELECT role FROM users WHERE id = $1', [userId]);
    if (userResult.rows.length === 0 || userResult.rows[0].role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    if (req.method === 'GET') {
      return getProjects(req, res);
    } else if (req.method === 'POST') {
      return createProject(req, res);
    } else if (req.method === 'DELETE') {
      return deleteProject(req, res);
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
