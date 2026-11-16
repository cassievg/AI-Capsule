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

app.get('/auth/github/callback', async (req, res) => {
    const { code, state, error } = req.query;

    if (error) {
        return res.status(400).send('Github authorization denied');
    };

    const savedState = req.cookies.github_oauth_state;

    if (!state || !savedState || state !== savedState) {
        return res.status(403).send('Invalid oAuth state');
    };

    if (!code) {
        return res.status(400).send('Missing authorization code');
    };

    res.clearCookie('github_oauth_state', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/auth/github/callback'
    });

    try {
        const tokenResponse = await fetch(
            'https://github.com/login/oauth/access_token',
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-sType': 'application/json'
                },
                body: new URLSearchParams({
                    client_id: process.env.GITHUB_CLIENT_ID,
                    client_secret: process.env.GITHUB_CLIENT_SECRET,
                    code: code,
                    redirect_uri: process.env.GITHUB_CALLBACK_URL
                })
            }
        );

        const tokenData = await tokenResponse.json();

        if (!tokenResponse.ok || tokenData.error) {
            console.error('Token exchange failed:', tokenData);
            return res.status(400).send('Failed to obtain access token');
        };

        const accessToken = tokenData.access_token;

        const userResponse = await fetch(
            'https://api.github.com/user', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: 'application/vnd.github+json',
                'X-GitHub-Api-Version': '2022-11-28'
            }
        });

        const userData = await userResponse.json();

        if (!userResponse.ok) {
            console.error('Failed to retrieve Github user:', userData);
            return res.status(400).send('Failed to retrieve Github profile');
        };

        console.log({
            id: userData.id,
            username: userData.login
        });

        res.send(userData.login);
    } catch (e) {
        console.error('oAuth error:', e);
        res.status(500).send('Authentication failed');
    }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});