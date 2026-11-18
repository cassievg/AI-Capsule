const express = require('express');
const { db } = require('../db');
const router = express.Router();
const { authToken } = require('../server.js');

router.get('/', authToken, (req, res) => {
    req.userId = String(req.user.userId);

    db.all(
        `SELECT * from capsules WHERE user_id = ?`,
        [req.userId],
        (err, rows) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: 'Internal server error.' });
            };

            if (!rows) {
                return res.status(404).json({ error: 'User not found.' });
            };

            res.json(rows);
        }
    );
});

router.post('/', (req, res) => {
    const createdAt = new Date().toISOString();

    db.run(
        `INSERT INTO capsules
        (
            
        )`
    );
});

router.put('/:id', (req, res) => {
    const { id } = req.params;
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;
});