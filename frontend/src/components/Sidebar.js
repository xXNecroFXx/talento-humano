import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { user, logout, isReclutador } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span>🏢</span>
        <div>
          <div>TalentoHR</div>
          <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 400 }}>Gestión de Talento</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard">🏠 Dashboard</NavLink>
        <NavLink to="/vacantes">💼 Vacantes</NavLink>
        {isReclutador && <NavLink to="/candidatos">👥 Candidatos</NavLink>}
        {isReclutador && <NavLink to="/kanban">📋 Tablero Kanban</NavLink>}
        {!isReclutador && <NavLink to="/mis-postulaciones">📄 Mis Postulaciones</NavLink>}
        {isReclutador && <NavLink to="/usuarios">👤 Usuarios</NavLink>}
        <NavLink to="/perfil">⚙️ Perfil</NavLink>
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-user">
          <strong>{user?.nombre}</strong><br />
          <span style={{ fontSize: '0.75rem' }}>{user?.tipo_usuario}</span>
        </div>
        <button className="btn-logout" onClick={handleLogout}>🚪 Cerrar Sesión</button>
      </div>
    </aside>
  );
}
