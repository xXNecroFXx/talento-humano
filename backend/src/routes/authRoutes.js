const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfile } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar nuevo usuario
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, correo, clave]
 *             properties:
 *               nombre: { type: string }
 *               correo: { type: string }
 *               clave: { type: string }
 *               tipo_usuario: { type: string, enum: [CANDIDATO, RECLUTADOR] }
 *     responses:
 *       201: { description: Usuario creado }
 *       400: { description: Datos inválidos }
 *       409: { description: Correo ya registrado }
 */
router.post('/register', register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [correo, clave]
 *             properties:
 *               correo: { type: string, example: admin@talento.com }
 *               clave: { type: string, example: Admin123! }
 *     responses:
 *       200: { description: Login exitoso, retorna token JWT }
 *       401: { description: Credenciales inválidas }
 */
router.post('/login', login);

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Obtener perfil del usuario autenticado
 *     tags: [Auth]
 *     responses:
 *       200: { description: Datos del perfil }
 *       401: { description: No autenticado }
 */
router.get('/profile', authMiddleware, getProfile);

/**
 * @swagger
 * /api/auth/profile:
 *   put:
 *     summary: Actualizar perfil del usuario autenticado
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre: { type: string }
 *     responses:
 *       200: { description: Perfil actualizado }
 */
router.put('/profile', authMiddleware, updateProfile);

module.exports = router;
