require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const { dbCreate } = require('./db');

const { capsuleRouter } = require('./routes/capsules');
const { authRouter } = require('./routes/auth');
const app = express();

app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://ai-capsule-frontend-uopt.onrender.com'
    ],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/capsules', capsuleRouter);
app.use('/api/auth', authRouter);

app.get('/api/health', async (req, res) => {
    res.json({
        status: 'ok'
    });
});

const run = async () => {
    try {
        await dbCreate();

        const PORT = process.env.PORT || 5000;

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (e) {
        console.error('DB init failed:', e);
    };
};

run();