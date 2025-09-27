// backend/controllers/userController.js
import client from '../config/db.js'; // Import the PostgreSQL client

// Add User
export const addUser = async (req, res) => {
  const { username, email, password } = req.body;

  const query = 'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *';
  const values = [username, email, password];

  try {
    const result = await client.query(query, values);
    res.status(201).json({ user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add user' });
  }
};

// Update User
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, email, password } = req.body;

  const query = 'UPDATE users SET username = $1, email = $2, password = $3 WHERE id = $4 RETURNING *';
  const values = [username, email, password, id];

  try {
    const result = await client.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

// Delete User
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM users WHERE id = $1 RETURNING *';
  const values = [id];

  try {
    const result = await client.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted', user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

// Fetch all users (for testing)
export const getUsers = async (req, res) => {
  const query = 'SELECT * FROM users';
  try {
    const result = await client.query(query);
    res.status(200).json({ users: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};
