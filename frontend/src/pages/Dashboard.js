import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getVacantesApi, getPostulacionesApi } from '../services/api';

export default function Dashboard() {
  const { user, isReclutador } = useAuth();
  const [stats, setStats] = useState({ vacantes: 0, postulaciones: 0, entrevistas: 0, empleados: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [vRes, pRes] = await Promise.all([getVacantesApi(), getPostulacionesApi()]);
        const vacantes = vRes.data;
        const posts = pRes.data;
        setStats({
          vacantes: vacantes.filter(v => v.estado === 'ABIERTA').length,
          postulaciones: posts.length,
          entrevistas: posts.filter(p => p.estado_proceso === 'ENTREVISTA').length,
          empleados: posts.filter(p => p.estado_proceso === 'EMPLEADO').length,
        });
      } catch { }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div className="loading">Cargando dashboard...</div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Bienvenido, {user?.nombre} 👋</h1>
          <p style={{ color: '#64748b', marginTop: 4 }}>
            {isReclutador ? 'Panel de administración de reclutamiento' : 'Panel de candidato'}
          </p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">💼</div>
          <div>
            <div className="stat-value">{stats.vacantes}</div>
            <div className="stat-label">Vacantes Abiertas</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon yellow">📄</div>
          <div>
            <div className="stat-value">{stats.postulaciones}</div>
            <div className="stat-label">{isReclutador ? 'Total Postulaciones' : 'Mis Postulaciones'}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">🎯</div>
          <div>
            <div className="stat-value">{stats.entrevistas}</div>
            <div className="stat-label">En Entrevista</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">✅</div>
          <div>
            <div className="stat-value">{stats.empleados}</div>
            <div className="stat-label">Empleados</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">🚀 Accesos Rápidos</div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <a href="/vacantes" className="btn btn-primary">💼 Ver Vacantes</a>
          {isReclutador && <a href="/candidatos" className="btn btn-secondary">👥 Ver Candidatos</a>}
          {isReclutador && <a href="/kanban" className="btn btn-secondary">📋 Tablero Kanban</a>}
          {!isReclutador && <a href="/mis-postulaciones" className="btn btn-secondary">📄 Mis Postulaciones</a>}
        </div>
      </div>
    </div>
  );
}
