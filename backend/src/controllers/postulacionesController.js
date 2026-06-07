const { dbAll, dbGet, dbRun } = require('../config/database');

async function getPostulaciones(req, res) {
  try {
    let rows;
    if (req.user.tipo_usuario === 'RECLUTADOR') {
      rows = await dbAll(`SELECT p.*, u.nombre as candidato_nombre, u.correo as candidato_correo, v.titulo as vacante_titulo
        FROM postulaciones p JOIN usuarios u ON p.id_usuario=u.id JOIN vacantes v ON p.id_vacante=v.id ORDER BY p.fecha DESC`);
    } else {
      rows = await dbAll(`SELECT p.*, v.titulo as vacante_titulo, v.estado as vacante_estado
        FROM postulaciones p JOIN vacantes v ON p.id_vacante=v.id WHERE p.id_usuario=? ORDER BY p.fecha DESC`, [req.user.id]);
    }
    return res.json(rows);
  } catch { return res.status(500).json({ error: 'Error interno del servidor' }); }
}

async function getPostulacionesByVacante(req, res) {
  try {
    const rows = await dbAll(`SELECT p.*, u.nombre as candidato_nombre, u.correo as candidato_correo
      FROM postulaciones p JOIN usuarios u ON p.id_usuario=u.id WHERE p.id_vacante=? ORDER BY p.fecha DESC`, [req.params.id]);
    return res.json(rows);
  } catch { return res.status(500).json({ error: 'Error interno del servidor' }); }
}

async function createPostulacion(req, res) {
  const { id_vacante } = req.body;
  if (!id_vacante) return res.status(400).json({ error: 'id_vacante es requerido' });
  try {
    const vacante = await dbGet('SELECT * FROM vacantes WHERE id = ?', [id_vacante]);
    if (!vacante) return res.status(404).json({ error: 'Vacante no encontrada' });
    if (vacante.estado === 'CERRADA') return res.status(400).json({ error: 'La vacante está cerrada' });
    const existing = await dbGet('SELECT id FROM postulaciones WHERE id_usuario=? AND id_vacante=?', [req.user.id, id_vacante]);
    if (existing) return res.status(409).json({ error: 'Ya te postulaste a esta vacante' });
    const ruta = req.file ? req.file.path : null;
    const result = await dbRun('INSERT INTO postulaciones (id_usuario, id_vacante, ruta_archivo_pdf) VALUES (?, ?, ?)', [req.user.id, id_vacante, ruta]);
    return res.status(201).json({ id: result.lastID, message: 'Postulación enviada exitosamente' });
  } catch { return res.status(500).json({ error: 'Error interno del servidor' }); }
}

async function updateEstado(req, res) {
  const { id } = req.params;
  const { estado_proceso } = req.body;
  const estados = ['RECIBIDO', 'ENTREVISTA', 'PRUEBA', 'RECHAZADO', 'EMPLEADO'];
  if (!estado_proceso || !estados.includes(estado_proceso)) return res.status(400).json({ error: `Estado inválido. Valores: ${estados.join(', ')}` });
  try {
    const post = await dbGet('SELECT * FROM postulaciones WHERE id = ?', [id]);
    if (!post) return res.status(404).json({ error: 'Postulación no encontrada' });
    await dbRun('UPDATE postulaciones SET estado_proceso = ? WHERE id = ?', [estado_proceso, id]);
    return res.json({ message: 'Estado actualizado correctamente' });
  } catch { return res.status(500).json({ error: 'Error interno del servidor' }); }
}

module.exports = { getPostulaciones, getPostulacionesByVacante, createPostulacion, updateEstado };
