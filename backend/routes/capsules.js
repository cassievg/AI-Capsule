const express = require('express');
const { db } = require('../db');
const router = express.Router();

router.get('/', (req, res) => {
    db.all(
        `SELECT * from capsules`,
        [],
        (err, rows) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: 'Internal server error.' });
            }

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