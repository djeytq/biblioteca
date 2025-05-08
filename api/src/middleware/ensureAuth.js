const { verify } = require('jsonwebtoken');
const AUTH = require('../config/auth');

async function ensureAuth(req, res, next) {
    try {
        const authorization = req.headers.authorization;
        if (!authorization) {
            return res.status(401).json({ message: "Token não fornecido!" });
        }

        const [, token] = authorization.split(' ');
        if (!token) {
            return res.status(401).json({ message: "Token inválido!" });
        }

        const user = await verify(token, AUTH.secretKEY);
        req.user = { id: user.id, name: user.name };

        next();
    } catch (err) {
        console.error('Erro no middleware:', err.message);
        res.status(401).json({ message: "Falha na autenticação!" });
    }
}

module.exports = ensureAuth;