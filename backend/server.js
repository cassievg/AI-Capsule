require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: 'https://ai-capsule-w0vs.onrender.com',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: "backend running"
  });
});

app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: "test success"
  });
});

app.get('/auth/github', (req, res) => {
    const state = crypto.randomBytes(32).toString('hex');

    res.cookie('github_oauth_state', state, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 10 * 60 * 1000,
        path: '/auth/github/callback'
    });

    const params = new URLSearchParams({
        client_id: process.env.GITHUB_CLIENT_ID,
        redirect_uri: process.env.GITHUB_CALLBACK_URL,
        scope: 'read:user user:email',
        state: state
    });

    res.redirect(
        `https://github.com/login/oauth/authorize?${params.toString()}`
    );
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});