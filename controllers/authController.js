const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'my_super_secret_key_123';

const signup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        // Check if user already exists
        const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            // Update password if they exist but don't have one
            if (!userExists.rows[0].password) {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);
                await pool.query('UPDATE users SET password = $1 WHERE email = $2', [hashedPassword, email]);
                const token = jwt.sign({ id: userExists.rows[0].id }, JWT_SECRET, { expiresIn: '1d' });
                return res.status(200).json({ message: 'Account claimed', token });
            }
            return res.status(400).json({ error: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await pool.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id',
            [name, email, hashedPassword]
        );

        const token = jwt.sign({ id: newUser.rows[0].id }, JWT_SECRET, { expiresIn: '1d' });
        res.status(201).json({ message: 'Signup successful', token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error during signup' });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userResult.rows.length === 0) return res.status(400).json({ error: 'Invalid credentials' });

        const user = userResult.rows[0];
        if (!user.password) return res.status(400).json({ error: 'Please sign up first' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1d' });
        res.status(200).json({ message: 'Login successful', token, name: user.name });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error during login' });
    }
};

module.exports = { signup, login };
