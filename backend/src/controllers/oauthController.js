const { signToken } = require('../utils/jwt');

exports.oauthCallback = (req, res) => {
    try {
        const user = req.user;
        if (!user) return res.status(400).send('Authentication failed');

        const token = signToken({ id: user.id, role: user.role });
        const frontend = process.env.FRONTEND_URL || 'http://localhost:5173';
        // Redirect to frontend with token
        const redirectUrl = `${frontend.replace(/\/$/, '')}/auth/callback?token=${token}`;
        return res.redirect(redirectUrl);
    } catch (err) {
        return res.status(500).send('OAuth callback error');
    }
};