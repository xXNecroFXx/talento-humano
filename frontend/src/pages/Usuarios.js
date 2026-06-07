import React, { useEffect, useState } from 'react';
import { getUsuariosApi, createUsuarioApi, deleteUsuarioApi } from '../services/api';

export function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ nombre: '', correo: '', clave: '', tipo_usuario: 'CANDIDATO' });
  const [error, setError] = useState('');

  const load = async () => {
    try { const res = await getUsuariosApi(); setUsuarios(res.data); } catch { }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    try {
      await createUsuarioApi(form);
      setShowModal(false);
      setForm({ nombre: '', correo: '', clave: '', tipo_usuario: 'CANDIDATO' });
      load();
    } catch (err) { setError(err.response?.data?.error || 'Error'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar usuario?')) return;
    try { await deleteUsuarioApi(id); load(); } catch { }
  };

  if (loading) return <div className="loading">Cargando usuarios...</div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">👤 Usuarios</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Agregar Usuario</button>
      </div>
      <div className="card">
        <div className="table-wrapper">
          <table>
            <thead><tr><th>Nombre</th><th>Correo</th><th>Tipo</th><th>Fecha Registro</th><th>Acciones</th></tr></thead>
            <tbody>
              {usuarios.map(u => (
                <tr key={u.id}>
                  <td><strong>{u.nombre}</strong></td>
                  <td>{u.correo}</td>
                  <td><span className={`badge badge-${u.tipo_usuario === 'RECLUTADOR' ? 'entrevista' : 'recibido'}`}>{u.tipo_usuario}</span></td>
                  <td>{new Date(u.created_at).toLocaleDateString()}</td>
                  <td><button className="btn btn-danger btn-sm" onClick={() => handleDelete(u.id)}>🗑️ Eliminar</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Agregar Usuario</span>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group"><label>Nombre</label><input className="form-control" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} required /></div>
              <div className="form-group"><label>Correo</label><input className="form-control" type="email" value={form.correo} onChange={e => setForm({ ...form, correo: e.target.value })} required /></div>
              <div className="form-group"><label>Contraseña</label><input className="form-control" type="password" value={form.clave} onChange={e => setForm({ ...form, clave: e.target.value })} required /></div>
              <div className="form-group"><label>Tipo</label>
                <select className="form-control" value={form.tipo_usuario} onChange={e => setForm({ ...form, tipo_usuario: e.target.value })}>
                  <option value="CANDIDATO">Candidato</option>
                  <option value="RECLUTADOR">Reclutador</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Crear Usuario</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export function MisPostulaciones() {
  const [postulaciones, setPostulaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try { const res = await (await import('../services/api')).getPostulacionesApi(); setPostulaciones(res.data); } catch { }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div className="loading">Cargando...</div>;

  return (
    <div>
      <div className="page-header"><h1 className="page-title">📄 Mis Postulaciones</h1></div>
      {postulaciones.length === 0 ? (
        <div className="empty-state"><div className="icon">📄</div><p>No tienes postulaciones aún. <a href="/vacantes">Ver vacantes</a></p></div>
      ) : (
        <div className="card">
          <div className="table-wrapper">
            <table>
              <thead><tr><th>Vacante</th><th>Estado</th><th>Fecha</th></tr></thead>
              <tbody>
                {postulaciones.map(p => (
                  <tr key={p.id}>
                    <td><strong>{p.vacante_titulo}</strong></td>
                    <td><span className={`badge badge-${p.estado_proceso.toLowerCase()}`}>{p.estado_proceso}</span></td>
                    <td>{new Date(p.fecha).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
