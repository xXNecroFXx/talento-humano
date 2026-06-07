const express = require('express');
const router = express.Router();
const { getUsuarios, createUsuario, deleteUsuario } = require('../controllers/usuariosController');
const { authMiddleware, soloReclutador } = require('../middleware/auth');

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Listar todos los usuarios (solo reclutador)
 *     tags: [Usuarios]
 *     responses:
 *       200: { description: Lista de usuarios }
 */
router.get('/', authMiddleware, soloReclutador, getUsuarios);

/**
 * @swagger
 * /api/usuarios:
 *   post:
 *     summary: Crear usuario (solo reclutador)
 *     tags: [Usuarios]
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
 */
router.post('/', authMiddleware, soloReclutador, createUsuario);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   delete:
 *     summary: Eliminar usuario (solo reclutador)
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Usuario eliminado }
 */
router.delete('/:id', authMiddleware, soloReclutador, deleteUsuario);

module.exports = router;
