const jwt = require('jsonwebtoken');

/**
 * Middleware de autenticación JWT
 * Verifica el token en el header Authorization
 */
function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token requerido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'talento_humano_secret_2026');
    req.user = decoded;
    next();
  } catch {
    return res.status(403).json({ error: 'Token inválido o expirado' });
  }
}

/**
 * Middleware que verifica que el usuario sea RECLUTADOR
 */
function soloReclutador(req, res, next) {
  if (req.user?.tipo_usuario !== 'RECLUTADOR') {
    return res.status(403).json({ error: 'Acceso solo para reclutadores' });
  }
  next();
}

module.exports = { authMiddleware, soloReclutador };
