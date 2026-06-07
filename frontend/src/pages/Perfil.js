import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfileApi } from '../services/api';

export default function Perfil() {
  const { user } = useAuth();
  const [nombre, setNombre] = useState(user?.nombre || '');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(''); setError('');
    setLoading(true);
    try {
      await updateProfileApi({ nombre });
      setSuccess('Perfil actualizado correctamente');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al actualizar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header"><h1 className="page-title">⚙️ Mi Perfil</h1></div>
      <div style={{ maxWidth: 480 }}>
        <div className="card" style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
            👤
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{user?.nombre}</div>
            <div style={{ color: '#64748b', fontSize: '0.9rem' }}>{user?.correo}</div>
            <span className={`badge badge-${user?.tipo_usuario === 'RECLUTADOR' ? 'entrevista' : 'recibido'}`} style={{ marginTop: 6 }}>
              {user?.tipo_usuario}
            </span>
          </div>
        </div>

        <div className="card">
          <div className="card-title">Editar Perfil</div>
          {success && <div className="alert alert-success">{success}</div>}
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nombre completo</label>
              <input className="form-control" value={nombre} onChange={e => setNombre(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Correo electrónico</label>
              <input className="form-control" value={user?.correo} disabled style={{ background: '#f8fafc' }} />
            </div>
            <button className="btn btn-primary" disabled={loading}>
              {loading ? 'Guardando...' : '💾 Guardar Cambios'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
