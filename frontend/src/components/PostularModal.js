import React, { useState } from 'react';
import { createPostulacionApi } from '../services/api';

export default function PostularModal({ vacante, onClose, onSuccess }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('id_vacante', vacante.id);
      if (file) formData.append('cv', file);
      await createPostulacionApi(formData);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al postularse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">📤 Postularme a: {vacante.titulo}</span>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: 20 }}>{vacante.descripcion}</p>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Adjuntar Hoja de Vida (PDF) — opcional</label>
            <input
              className="form-control"
              type="file"
              accept=".pdf"
              onChange={e => setFile(e.target.files[0])}
            />
            <small style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Máximo 5MB</small>
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 16 }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Enviando...' : '✅ Enviar Postulación'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
