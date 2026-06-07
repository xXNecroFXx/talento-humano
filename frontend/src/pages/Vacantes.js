import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getVacantesApi, createVacanteApi, deleteVacanteApi, updateVacanteApi } from '../services/api';
import PostularModal from '../components/PostularModal';

export default function Vacantes() {
  const { isReclutador } = useAuth();
  const [vacantes, setVacantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [postularVacante, setPostularVacante] = useState(null);
  const [form, setForm] = useState({ titulo: '', descripcion: '', requisitos: '' });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const load = async () => {
    try {
      const res = await getVacantesApi();
      setVacantes(res.data);
    } catch { }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editId) {
        await updateVacanteApi(editId, form);
        setSuccess('Vacante actualizada');
      } else {
        await createVacanteApi(form);
        setSuccess('Vacante creada exitosamente');
      }
      setShowModal(false);
      setForm({ titulo: '', descripcion: '', requisitos: '' });
      setEditId(null);
      load();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta vacante?')) return;
    try {
      await deleteVacanteApi(id);
      load();
    } catch { }
  };

  const handleEdit = (v) => {
    setForm({ titulo: v.titulo, descripcion: v.descripcion, requisitos: v.requisitos });
    setEditId(v.id);
    setShowModal(true);
  };

  if (loading) return <div className="loading">Cargando vacantes...</div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">💼 Vacantes</h1>
        {isReclutador && (
          <button className="btn btn-primary" onClick={() => { setShowModal(true); setEditId(null); setForm({ titulo: '', descripcion: '', requisitos: '' }); }}>
            + Nueva Vacante
          </button>
        )}
      </div>

      {success && <div className="alert alert-success">{success}</div>}

      {vacantes.length === 0 ? (
        <div className="empty-state"><div className="icon">💼</div><p>No hay vacantes disponibles</p></div>
      ) : (
        <div style={{ display: 'grid', gap: 16 }}>
          {vacantes.map(v => (
            <div className="card" key={v.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>{v.titulo}</h3>
                  <span className={`badge badge-${v.estado.toLowerCase()}`}>{v.estado}</span>
                </div>
                <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: 8 }}>{v.descripcion}</p>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>📋 Requisitos: {v.requisitos}</p>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: 4 }}>
                  📅 {new Date(v.fecha_creacion).toLocaleDateString()}
                </p>
              </div>
              <div style={{ display: 'flex', gap: 8, marginLeft: 16 }}>
                {isReclutador ? (
                  <>
                    <button className="btn btn-secondary btn-sm" onClick={() => handleEdit(v)}>✏️ Editar</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(v.id)}>🗑️</button>
                  </>
                ) : (
                  v.estado === 'ABIERTA' && (
                    <button className="btn btn-primary btn-sm" onClick={() => setPostularVacante(v)}>
                      📤 Postularme
                    </button>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">{editId ? 'Editar Vacante' : 'Nueva Vacante'}</span>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Título del cargo</label>
                <input className="form-control" value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })} placeholder="Ej: Desarrollador Full Stack" required />
              </div>
              <div className="form-group">
                <label>Descripción</label>
                <textarea className="form-control" rows={3} value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} placeholder="Describe el cargo..." required />
              </div>
              <div className="form-group">
                <label>Requisitos</label>
                <textarea className="form-control" rows={2} value={form.requisitos} onChange={e => setForm({ ...form, requisitos: e.target.value })} placeholder="Ej: React, 2 años de experiencia..." required />
              </div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">{editId ? 'Actualizar' : 'Crear Vacante'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {postularVacante && (
        <PostularModal vacante={postularVacante} onClose={() => setPostularVacante(null)} onSuccess={() => { setPostularVacante(null); setSuccess('¡Postulación enviada exitosamente!'); }} />
      )}
    </div>
  );
}
