import React, { useEffect, useState } from 'react';
import { getPostulacionesApi, updateEstadoApi } from '../services/api';

const ESTADOS = ['RECIBIDO', 'ENTREVISTA', 'PRUEBA', 'RECHAZADO', 'EMPLEADO'];

export default function Candidatos() {
  const [postulaciones, setPostulaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');

  const load = async () => {
    try {
      const res = await getPostulacionesApi();
      setPostulaciones(res.data);
    } catch { }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleEstado = async (id, estado_proceso) => {
    try {
      await updateEstadoApi(id, estado_proceso);
      load();
    } catch { }
  };

  const filtered = postulaciones.filter(p => {
    const matchSearch = !search || p.candidato_nombre?.toLowerCase().includes(search.toLowerCase()) || p.candidato_correo?.toLowerCase().includes(search.toLowerCase());
    const matchEstado = !filtroEstado || p.estado_proceso === filtroEstado;
    return matchSearch && matchEstado;
  });

  if (loading) return <div className="loading">Cargando candidatos...</div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">👥 Candidatos</h1>
        <span style={{ color: '#64748b', fontSize: '0.9rem' }}>{filtered.length} resultado(s)</span>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 12 }}>
          <input
            className="form-control"
            placeholder="🔍 Buscar por nombre o correo..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: 1 }}
          />
          <select className="form-control" value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)} style={{ width: 180 }}>
            <option value="">Todos los estados</option>
            {ESTADOS.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state"><div className="icon">👥</div><p>No hay candidatos que coincidan</p></div>
      ) : (
        <div className="card">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Candidato</th>
                  <th>Correo</th>
                  <th>Vacante</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                  <th>CV</th>
                  <th>Cambiar Estado</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id}>
                    <td><strong>{p.candidato_nombre}</strong></td>
                    <td>{p.candidato_correo}</td>
                    <td>{p.vacante_titulo}</td>
                    <td><span className={`badge badge-${p.estado_proceso.toLowerCase()}`}>{p.estado_proceso}</span></td>
                    <td>{new Date(p.fecha).toLocaleDateString()}</td>
                    <td>
                      {p.ruta_archivo_pdf
                        ? <a href={`/${p.ruta_archivo_pdf}`} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">📄 Ver CV</a>
                        : <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Sin CV</span>}
                    </td>
                    <td>
                      <select
                        className="form-control"
                        style={{ padding: '6px', fontSize: '0.8rem' }}
                        value={p.estado_proceso}
                        onChange={e => handleEstado(p.id, e.target.value)}
                      >
                        {ESTADOS.map(e => <option key={e} value={e}>{e}</option>)}
                      </select>
                    </td>
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
