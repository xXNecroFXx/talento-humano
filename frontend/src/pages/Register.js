import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerApi } from '../services/api';

export default function Register() {
  const [form, setForm] = useState({ nombre: '', correo: '', clave: '', tipo_usuario: 'CANDIDATO' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await registerApi(form);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <h1>🏢 TalentoHR</h1>
          <p>Plataforma de Gestión de Talento Humano</p>
        </div>
        <h2 className="auth-title">Crear Cuenta</h2>
        <p className="auth-subtitle">Completa el formulario para registrarte</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre completo</label>
            <input className="form-control" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} placeholder="Tu nombre" required />
          </div>
          <div className="form-group">
            <label>Correo electrónico</label>
            <input className="form-control" type="email" value={form.correo} onChange={e => setForm({ ...form, correo: e.target.value })} placeholder="tu@correo.com" required />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input className="form-control" type="password" value={form.clave} onChange={e => setForm({ ...form, clave: e.target.value })} placeholder="••••••••" required />
          </div>
          <div className="form-group">
            <label>Tipo de usuario</label>
            <select className="form-control" value={form.tipo_usuario} onChange={e => setForm({ ...form, tipo_usuario: e.target.value })}>
              <option value="CANDIDATO">Candidato</option>
              <option value="RECLUTADOR">Reclutador</option>
            </select>
          </div>
          <button className="btn btn-primary" style={{ width: '100%', marginTop: 8 }} disabled={loading}>
            {loading ? 'Registrando...' : 'Crear Cuenta'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.85rem', color: '#64748b' }}>
          ¿Ya tienes cuenta? <a href="/login" style={{ color: '#2563eb' }}>Inicia sesión</a>
        </p>
      </div>
    </div>
  );
}
