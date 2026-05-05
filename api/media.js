const { pool } = require('./db');
const { verifyToken } = require('./auth');

async function getMedia(req, res, userId) {
  try {
    const result = await pool.query(
      'SELECT * FROM media WHERE user_id = $1 ORDER BY upload_date DESC',
      [userId]
    );

    res.json({
      success: true,
      media: result.rows
    });
  } catch (error) {
    console.error('Error fetching media:', error);
    res.status(500).json({ error: 'Failed to fetch media' });
  }
}

async function addMedia(req, res, userId) {
  try {
    const { title, description, fileType, fileUrl, thumbnailUrl, fileSize, projectName, tags } = req.body;

    const result = await pool.query(
      'INSERT INTO media (user_id, title, description, file_type, file_url, thumbnail_url, file_size, project_name, tags) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [userId, title, description, fileType, fileUrl, thumbnailUrl, fileSize, projectName, tags]
    );

    res.json({
      success: true,
      media: result.rows[0]
    });
  } catch (error) {
    console.error('Error adding media:', error);
    res.status(500).json({ error: 'Failed to add media' });
  }
}

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Verify token
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    if (req.method === 'GET') {
      return getMedia(req, res, userId);
    } else if (req.method === 'POST') {
      return addMedia(req, res, userId);
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
