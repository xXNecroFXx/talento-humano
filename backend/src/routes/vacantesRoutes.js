const express = require('express');
const router = express.Router();
const { getVacantes, getVacanteById, createVacante, updateVacante, deleteVacante } = require('../controllers/vacantesController');
const { authMiddleware, soloReclutador } = require('../middleware/auth');

/**
 * @swagger
 * /api/vacantes:
 *   get:
 *     summary: Listar todas las vacantes
 *     tags: [Vacantes]
 *     security: []
 *     responses:
 *       200: { description: Lista de vacantes }
 */
router.get('/', getVacantes);

/**
 * @swagger
 * /api/vacantes/{id}:
 *   get:
 *     summary: Obtener vacante por ID
 *     tags: [Vacantes]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Vacante encontrada }
 *       404: { description: Vacante no encontrada }
 */
router.get('/:id', getVacanteById);

/**
 * @swagger
 * /api/vacantes:
 *   post:
 *     summary: Crear nueva vacante (solo reclutador)
 *     tags: [Vacantes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [titulo, descripcion, requisitos]
 *             properties:
 *               titulo: { type: string }
 *               descripcion: { type: string }
 *               requisitos: { type: string }
 *     responses:
 *       201: { description: Vacante creada }
 *       403: { description: Sin permisos }
 */
router.post('/', authMiddleware, soloReclutador, createVacante);

/**
 * @swagger
 * /api/vacantes/{id}:
 *   put:
 *     summary: Actualizar vacante (solo reclutador)
 *     tags: [Vacantes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Vacante actualizada }
 */
router.put('/:id', authMiddleware, soloReclutador, updateVacante);

/**
 * @swagger
 * /api/vacantes/{id}:
 *   delete:
 *     summary: Eliminar vacante (solo reclutador)
 *     tags: [Vacantes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Vacante eliminada }
 */
router.delete('/:id', authMiddleware, soloReclutador, deleteVacante);

module.exports = router;
