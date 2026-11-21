const express = require('express');
const capsuleRouter = express.Router();

const { db } = require('../db');
const { authToken } = require('../middleware/auth');

capsuleRouter.get('/', authToken, (req, res) => {
    req.userId = String(req.user.userId);

    db.all(
        `SELECT * from capsules WHERE user_id = ?`,
        [req.userId],
        (err, rows) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: 'Internal server error' });
            };

            res.json(rows);
        }
    );
});

capsuleRouter.get('/:id', (req, res) => {
    const { id } = req.params;

    db.get(
        `SELECT * from capsules WHERE id = ?`,
        [id],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ error: 'Internal server error.' });
            }

            if (!rows) {
                return res.status(404).json({ error: 'Capsule not found.' });
            }

            res.json(rows);
        }
    );
});

capsuleRouter.post('/', authToken, (req, res) => {
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
            1,
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
        function (err) {
            if (err) {
                return res.status(500).json({ error: 'Internal server error' });
            }
            else {
                return res.status(201).json({ id: this.lastID });
            }
        }
    );
});

capsuleRouter.put('/:id', authToken, (req, res) => {
    req.userId = String(req.user.userId);

    const { id } = req.params;
    const upd = req.body;

    db.get(
        `SELECT * FROM capsules WHERE (user_id = ? AND id = ?)`,
        [req.userId, id],
        (err, existing) => {
            if (err) {
                return res.status(500).json({ error: 'Internal server error' });
            };
            
            if (!existing) {
                return res.status(404).json({ error: 'Capsule not found' });
            };

            let ver = existing.prompt_version;

            if (upd.prompt_text !== existing.prompt_text) {
                ver = Number(existing.prompt_version || 1) + 1;
            };

            db.run(
                `UPDATE capsules
                SET
                    project_name = ?,
                    prompt_title = ?,
                    prompt_text = ?,
                    prompt_version =?,
                    response_summary = ?,
                    category = ?,
                    usefulness = ?,
                    reviewed = ?,
                    improved = ?,
                    screenshot_url = ?,
                    notes = ?
                WHERE id = ? AND user_id = ?`,
                [
                    upd.project_name,
                    upd.prompt_title,
                    upd.prompt_text,
                    ver,
                    upd.response_summary,
                    upd.category,
                    upd.usefulness,
                    upd.reviewed,
                    upd.improved,
                    upd.screenshot_url,
                    upd.notes,
                    id, 
                    req.userId
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

capsuleRouter.delete('/:id', authToken, (req, res) => {
    req.userId = String(req.user.userId);

    const { id } = req.params;

    db.run(
        `DELETE FROM capsules
        WHERE (user_id = ? AND id = ?)`,
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

module.exports = { capsuleRouter };
