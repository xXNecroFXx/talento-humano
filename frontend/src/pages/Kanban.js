import React, { useEffect, useState } from 'react';
import { getPostulacionesApi, updateEstadoApi } from '../services/api';

const COLUMNAS = [
  { key: 'RECIBIDO', label: '📥 Recibido', color: '#2563eb' },
  { key: 'ENTREVISTA', label: '🗣️ Entrevista', color: '#d97706' },
  { key: 'PRUEBA', label: '🧪 Prueba Técnica', color: '#7c3aed' },
  { key: 'RECHAZADO', label: '❌ Rechazado', color: '#dc2626' },
  { key: 'EMPLEADO', label: '✅ Empleado', color: '#16a34a' },
];

export default function Kanban() {
  const [postulaciones, setPostulaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await getPostulacionesApi();
      setPostulaciones(res.data);
    } catch { }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleMover = async (id, nuevoEstado) => {
    try {
      await updateEstadoApi(id, nuevoEstado);
      load();
    } catch { }
  };

  if (loading) return <div className="loading">Cargando tablero...</div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">📋 Tablero Kanban</h1>
        <span style={{ color: '#64748b', fontSize: '0.9rem' }}>{postulaciones.length} postulaciones</span>
      </div>

      <div className="kanban-board">
        {COLUMNAS.map(col => {
          const items = postulaciones.filter(p => p.estado_proceso === col.key);
          return (
            <div className="kanban-col" key={col.key}>
              <div className="kanban-col-title" style={{ color: col.color, borderBottomColor: col.color }}>
                {col.label}
                <span style={{ marginLeft: 8, background: col.color, color: '#fff', borderRadius: 12, padding: '2px 8px', fontSize: '0.75rem' }}>
                  {items.length}
                </span>
              </div>
              {items.length === 0 && (
                <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.8rem', padding: 16 }}>Sin candidatos</div>
              )}
              {items.map(p => (
                <div className="kanban-card" key={p.id}>
                  <div className="candidato-name">👤 {p.candidato_nombre}</div>
                  <div className="vacante-name">💼 {p.vacante_titulo}</div>
                  <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {COLUMNAS.filter(c => c.key !== col.key).map(c => (
                      <button
                        key={c.key}
                        onClick={() => handleMover(p.id, c.key)}
                        style={{
                          fontSize: '0.7rem', padding: '3px 6px', border: `1px solid ${c.color}`,
                          borderRadius: 4, background: 'none', color: c.color, cursor: 'pointer'
                        }}
                      >
                        → {c.key}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
