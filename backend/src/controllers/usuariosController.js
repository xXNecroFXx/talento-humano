const { dbAll, dbGet, dbRun } = require('../config/database');
const bcrypt = require('bcryptjs');

async function getUsuarios(req, res) {
  try {
    const usuarios = await dbAll('SELECT id, nombre, correo, tipo_usuario, created_at FROM usuarios ORDER BY created_at DESC');
    return res.json(usuarios);
  } catch { return res.status(500).json({ error: 'Error interno del servidor' }); }
}

async function createUsuario(req, res) {
  const { nombre, correo, clave, tipo_usuario = 'CANDIDATO' } = req.body;
  if (!nombre || !correo || !clave) return res.status(400).json({ error: 'Nombre, correo y clave son requeridos' });
  try {
    const existing = await dbGet('SELECT id FROM usuarios WHERE correo = ?', [correo]);
    if (existing) return res.status(409).json({ error: 'El correo ya está registrado' });
    const hash = bcrypt.hashSync(clave, 10);
    const result = await dbRun('INSERT INTO usuarios (nombre, correo, clave, tipo_usuario) VALUES (?, ?, ?, ?)', [nombre, correo, hash, tipo_usuario]);
    return res.status(201).json({ id: result.lastID, nombre, correo, tipo_usuario });
  } catch { return res.status(500).json({ error: 'Error interno del servidor' }); }
}

async function deleteUsuario(req, res) {
  try {
    const user = await dbGet('SELECT id FROM usuarios WHERE id = ?', [req.params.id]);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    await dbRun('DELETE FROM usuarios WHERE id = ?', [req.params.id]);
    return res.json({ message: 'Usuario eliminado' });
  } catch { return res.status(500).json({ error: 'Error interno del servidor' }); }
}

module.exports = { getUsuarios, createUsuario, deleteUsuario };
