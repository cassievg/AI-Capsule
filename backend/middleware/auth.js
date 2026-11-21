const jwt = require('jsonwebtoken');

const authToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized token' });
    };

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);

        req.user = {
            userId: decode.userId,
            username: decode.username
        };

        next();
    } catch (e) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = { authToken };