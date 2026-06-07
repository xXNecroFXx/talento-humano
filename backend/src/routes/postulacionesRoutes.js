const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { getPostulaciones, getPostulacionesByVacante, createPostulacion, updateEstado } = require('../controllers/postulacionesController');
const { authMiddleware, soloReclutador } = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, process.env.UPLOAD_PATH || './uploads'),
  filename: (req, file, cb) => cb(null, `cv_${Date.now()}${path.extname(file.originalname)}`)
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Solo se permiten archivos PDF'));
  },
  limits: { fileSize: 5 * 1024 * 1024 }
});

/**
 * @swagger
 * /api/postulaciones:
 *   get:
 *     summary: Listar postulaciones (reclutador ve todas, candidato ve las suyas)
 *     tags: [Postulaciones]
 *     responses:
 *       200: { description: Lista de postulaciones }
 */
router.get('/', authMiddleware, getPostulaciones);

/**
 * @swagger
 * /api/postulaciones/vacante/{id}:
 *   get:
 *     summary: Postulaciones de una vacante específica (solo reclutador)
 *     tags: [Postulaciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Lista de candidatos de la vacante }
 */
router.get('/vacante/:id', authMiddleware, soloReclutador, getPostulacionesByVacante);

/**
 * @swagger
 * /api/postulaciones:
 *   post:
 *     summary: Crear postulación con CV en PDF (candidato)
 *     tags: [Postulaciones]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               id_vacante: { type: integer }
 *               cv: { type: string, format: binary }
 *     responses:
 *       201: { description: Postulación creada }
 *       409: { description: Ya postulado }
 */
router.post('/', authMiddleware, upload.single('cv'), createPostulacion);

/**
 * @swagger
 * /api/postulaciones/{id}/estado:
 *   patch:
 *     summary: Actualizar estado de postulación (solo reclutador)
 *     tags: [Postulaciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               estado_proceso:
 *                 type: string
 *                 enum: [RECIBIDO, ENTREVISTA, PRUEBA, RECHAZADO, EMPLEADO]
 *     responses:
 *       200: { description: Estado actualizado }
 */
router.patch('/:id/estado', authMiddleware, soloReclutador, updateEstado);

module.exports = router;
