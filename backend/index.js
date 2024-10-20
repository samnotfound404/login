const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt'); // For password hashing
const cors = require('cors');
const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json()); // To parse incoming JSON requests

// MySQL database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '12345678',
  database: 'iit_indore', // Replace with your database name
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// Hash the password with bcrypt
const hashPassword = (password) => {
  return bcrypt.hash(password, 10);
};

// Compare the password with hashed password
const verifyPassword = (password, hash) => {
  return bcrypt.compare(password, hash);
};

// Register route
app.post('/api/register', async (req, res) => {
  const { userId, mobileNumber, password } = req.body;

  if (!userId || !mobileNumber || !password) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  try {
    // Check if user already exists
    db.query('SELECT * FROM users WHERE userId = ?', [userId], async (err, results) => {
      if (err) return res.status(500).json({ success: false, message: 'Database error' });
      if (results.length > 0) {
        return res.status(400).json({ success: false, message: 'User ID already exists' });
      }

      // Hash the password before storing it
      const hashedPassword = await hashPassword(password);

      // Insert new user into the database
      db.query(
        'INSERT INTO users (userId, mobileNumber, password) VALUES (?, ?, ?)',
        [userId, mobileNumber, hashedPassword],
        (err) => {
          if (err) return res.status(500).json({ success: false, message: 'Database error' });
          res.status(201).json({ success: true, message: 'User registered successfully' });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
// GET route to fetch courses data
app.get('/api/courses', (req, res) => {
    const query = 'SELECT course_code, course_name, professor_name FROM courses';
    db.query(query, (err, results) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Database query failed' });
      }
      return res.status(200).json({ success: true, data: results });
    });
  });
  
  

// Login route
app.post('/api/login', (req, res) => {
  const { userId, password } = req.body;

  if (!userId || !password) {
    return res.status(400).json({ success: false, message: 'User ID and password are required' });
  }

  // Check if the user exists
  db.query('SELECT * FROM users WHERE userId = ?', [userId], async (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Database error' });
    if (results.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid User ID or password' });
    }

    // Check if password matches
    const user = results[0];
    const passwordMatch = await verifyPassword(password, user.password);

    if (!passwordMatch) {
      return res.status(400).json({ success: false, message: 'Invalid User ID or password' });
    }

    res.status(200).json({ success: true, message: 'Login successful' });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
