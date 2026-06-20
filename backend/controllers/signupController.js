const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const express = require('express');
const router = express.Router();

const signupController = async (req, res) => {
    const {name,  email, password} = req.body;
    if(!name || !email || !password) {
        return res.status(400).json({
            message: 'Name, email and password are required fields'
        });
    }

    try {
        //check if th user already exists
        existingUser = await db.query('SELECT id FROM users WHERE email = $1', [email]);
        if(existingUser.rows.length > 0){
            return res.status(400).json({
                message: 'An account with this ueamil already exist'
            });
        }
        //hashing the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        //save the user to db
        const insertQuery = `
        INSERT INTO users (name, email, password_hash)
        VALUES ($1, $2, $3)
        RETURNING id, name, email, role, created_at;
        `;

        const newUser = await db.query(insertQuery, [name,email,hashedPassword]);
        const user = newUser.rows[0];

        //generate jwt
        const token = jwt.sign(
            {id : user.id, email: user.email, role: user.role},
            process.env.JWT_SECRET,
            { expiresIn: '24h'}
        );

        return res.status(201).json({
        message: 'User registered successfully',
        token,
        user
        });
    }catch (error) {
    console.error('Signup Error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}

module.exports = signupController;