require('dotenv').config();

const express = require('express');
const authRouter = express.Router();

const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const { authToken } = require('../middleware/auth');


authRouter.get('/github', (req, res) => {
    const state = crypto.randomBytes(32).toString('hex');

    res.cookie('github_oauth_state', state, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 10 * 60 * 1000,
        path: '/api/auth/github/callback'
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

authRouter.get('/github/callback', async (req, res) => {
    const { code, state, error } = req.query;

    if (error) {
        return res.status(400).send('Github authorization denied');
    };

    const savedState = req.cookies.github_oauth_state;

    if (!state || !savedState || state !== savedState) {
        return res.status(403).send('Invalid OAuth state');
    };

    if (!code) {
        return res.status(400).send('Missing authorization code');
    };

    res.clearCookie('github_oauth_state', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/api/auth/github/callback'
    });

    try {
        const tokenResponse = await fetch(
            'https://github.com/login/oauth/access_token',
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded'
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

        const appToken = jwt.sign(
            {
                userId: userData.id,
                username: userData.login
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '1h'
            }
        );

        res.cookie('token', appToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 60 * 60 * 1000,
            path: '/',
        });

        res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
    } catch (e) {
        console.error('OAuth error:', e);
        res.status(500).send('Authentication failed');
    }
});

authRouter.get('/me', authToken, (req, res) => {
    res.json({
        userId: req.user.userId,
        username: req.user.username
    });
});

module.exports = { authRouter };
