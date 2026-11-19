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
                return res.status(500).json({ error: 'Internal server error' });
            };

            if (!rows) {
                return res.status(404).json({ error: 'User not found' });
            };

            res.json(rows);
        }
    );
});

router.post('/', authToken, (req, res) => {
    req.userId = String(req.user.userId);

    const capsuleDetails = req.body;
    const createdAt = new Date().toISOString();

    db.run(
        `INSERT INTO capsules
        (   
            user_id,
            project_name,
            prompt_title,
            prompt_version,
            prompt_text,
            response_summary,
            category,
            usefulness,
            reviewed,
            improved,
            screenshot_url,
            notes,
            created_at
        ) VALUES
        (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [
            req.userId,
            capsuleDetails.project_name,
            capsuleDetails.prompt_title,
            capsuleDetails.prompt_version,
            capsuleDetails.prompt_text,
            capsuleDetails.response_summary,
            capsuleDetails.category,
            capsuleDetails.usefulness,
            capsuleDetails.reviewed,
            capsuleDetails.improved,
            capsuleDetails.screenshot_url,
            capsuleDetails.notes,
            createdAt
        ],
        (err) => {
            if (err) {
                return res.status(500).json({ error: 'Internal server error' });
            }
            else {
                return res.status(200).json({ id: this.lastID });
            }
        }
    );
});

router.put('/:id', (req, res) => {
    req.userId = String(req.user.userId);

    const { id } = req.params;
    const upd = req.body;

    db.get(
        `SELECT * FROM capsules WHERE (userId = ? AND id = ?)`,
        [req.userId, id],
        (err, existing) => {
            if (err) {
                return res.status(500).json({ error: 'Internal server error' });
            };
            
            if (!existing) {
                return res.status(404).json({ error: 'Capsule not found' });
            };

            db.run(
                `UPDATE capsules
                SET
                    project_name,
                    prompt_title,
                    prompt_text,
                    response_summary,
                    category,
                    usefulness,
                    reviewed,
                    improved,
                    screenshot_url,
                    notes
                WHERE id = ?`,
                [
                    upd.project_name,
                    upd.prompt_title,
                    upd.prompt_text,
                    upd.response_summary,
                    upd.category,
                    upd.usefulness,
                    upd.reviewed,
                    upd.improved,
                    upd.screenshot_url,
                    upd.notes
                ],
                (err) => {
                    if (err) {
                        return res.status(500).json({ error: 'Internal server error' });
                    }
                    
                    return res.status(200).json({ message: `Capsule ${id} has been updated` });
                }
            )
        }
    )
});

router.delete('/:id', (req, res) => {
    req.userId = String(req.user.userId);

    const { id } = req.params;

    db.run(
        `DELETE FROM capsules
        WHERE (userId = ? AND id = ?)`,
        [req.userId, id],
        function (err) {
            if (err) {
                return res.status(500).json({ error: 'Internal server error' });
            }
            else {
                if (this.changes === 0) {
                    return res.status(404).json({ error: 'Capsule not found' });
                }
                
                return res.status(200).json({ id: `Casule ${id} deleted` });
            }
        }
    );
});

module.exports = { router };
