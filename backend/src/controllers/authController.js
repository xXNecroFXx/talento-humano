const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { dbGet, dbRun } = require('../config/database');

const SECRET = process.env.JWT_SECRET || 'talento_humano_secret_2026';

async function register(req, res) {
  const { nombre, correo, clave, tipo_usuario = 'CANDIDATO' } = req.body;
  if (!nombre || !correo || !clave) return res.status(400).json({ error: 'Nombre, correo y clave son requeridos' });
  if (!['RECLUTADOR', 'CANDIDATO'].includes(tipo_usuario)) return res.status(400).json({ error: 'tipo_usuario inválido' });
  try {
    const existing = await dbGet('SELECT id FROM usuarios WHERE correo = ?', [correo]);
    if (existing) return res.status(409).json({ error: 'El correo ya está registrado' });
    const hash = bcrypt.hashSync(clave, 10);
    const result = await dbRun('INSERT INTO usuarios (nombre, correo, clave, tipo_usuario) VALUES (?, ?, ?, ?)', [nombre, correo, hash, tipo_usuario]);
    return res.status(201).json({ id: result.lastID, nombre, correo, tipo_usuario });
  } catch (err) {
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}

async function login(req, res) {
  const { correo, clave } = req.body;
  if (!correo || !clave) return res.status(400).json({ error: 'Correo y clave son requeridos' });
  try {
    const user = await dbGet('SELECT * FROM usuarios WHERE correo = ?', [correo]);
    if (!user || !bcrypt.compareSync(clave, user.clave)) return res.status(401).json({ error: 'Credenciales inválidas' });
    const token = jwt.sign({ id: user.id, nombre: user.nombre, correo: user.correo, tipo_usuario: user.tipo_usuario }, SECRET, { expiresIn: '8h' });
    return res.json({ token, user: { id: user.id, nombre: user.nombre, correo: user.correo, tipo_usuario: user.tipo_usuario } });
  } catch {
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}

async function getProfile(req, res) {
  try {
    const user = await dbGet('SELECT id, nombre, correo, tipo_usuario, created_at FROM usuarios WHERE id = ?', [req.user.id]);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    return res.json(user);
  } catch {
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}

async function updateProfile(req, res) {
  const { nombre } = req.body;
  if (!nombre) return res.status(400).json({ error: 'Nombre requerido' });
  try {
    await dbRun('UPDATE usuarios SET nombre = ? WHERE id = ?', [nombre, req.user.id]);
    return res.json({ message: 'Perfil actualizado correctamente' });
  } catch {
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}

module.exports = { register, login, getProfile, updateProfile };
