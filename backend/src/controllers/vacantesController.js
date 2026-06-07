const { dbAll, dbGet, dbRun } = require('../config/database');

async function getVacantes(req, res) {
  try {
    const vacantes = await dbAll('SELECT * FROM vacantes ORDER BY fecha_creacion DESC');
    return res.json(vacantes);
  } catch { return res.status(500).json({ error: 'Error interno del servidor' }); }
}

async function getVacanteById(req, res) {
  try {
    const vacante = await dbGet('SELECT * FROM vacantes WHERE id = ?', [req.params.id]);
    if (!vacante) return res.status(404).json({ error: 'Vacante no encontrada' });
    return res.json(vacante);
  } catch { return res.status(500).json({ error: 'Error interno del servidor' }); }
}

async function createVacante(req, res) {
  const { titulo, descripcion, requisitos } = req.body;
  if (!titulo || !descripcion || !requisitos) return res.status(400).json({ error: 'Titulo, descripcion y requisitos son requeridos' });
  try {
    const result = await dbRun('INSERT INTO vacantes (titulo, descripcion, requisitos) VALUES (?, ?, ?)', [titulo, descripcion, requisitos]);
    const vacante = await dbGet('SELECT * FROM vacantes WHERE id = ?', [result.lastID]);
    return res.status(201).json(vacante);
  } catch { return res.status(500).json({ error: 'Error interno del servidor' }); }
}

async function updateVacante(req, res) {
  const { id } = req.params;
  const { titulo, descripcion, requisitos, estado } = req.body;
  try {
    const vacante = await dbGet('SELECT * FROM vacantes WHERE id = ?', [id]);
    if (!vacante) return res.status(404).json({ error: 'Vacante no encontrada' });
    await dbRun('UPDATE vacantes SET titulo=?, descripcion=?, requisitos=?, estado=? WHERE id=?',
      [titulo || vacante.titulo, descripcion || vacante.descripcion, requisitos || vacante.requisitos, estado || vacante.estado, id]);
    return res.json({ message: 'Vacante actualizada' });
  } catch { return res.status(500).json({ error: 'Error interno del servidor' }); }
}

async function deleteVacante(req, res) {
  try {
    const vacante = await dbGet('SELECT * FROM vacantes WHERE id = ?', [req.params.id]);
    if (!vacante) return res.status(404).json({ error: 'Vacante no encontrada' });
    await dbRun('DELETE FROM vacantes WHERE id = ?', [req.params.id]);
    return res.json({ message: 'Vacante eliminada' });
  } catch { return res.status(500).json({ error: 'Error interno del servidor' }); }
}

module.exports = { getVacantes, getVacanteById, createVacante, updateVacante, deleteVacante };
