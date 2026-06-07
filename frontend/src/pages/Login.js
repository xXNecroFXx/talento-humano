import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(correo, clave);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al iniciar sesión');
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
        <h2 className="auth-title">Iniciar Sesión</h2>
        <p className="auth-subtitle">Ingresa tus credenciales para continuar</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Correo electrónico</label>
            <input
              className="form-control"
              type="email"
              value={correo}
              onChange={e => setCorreo(e.target.value)}
              placeholder="admin@talento.com"
              required
            />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input
              className="form-control"
              type="password"
              value={clave}
              onChange={e => setClave(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <button className="btn btn-primary" style={{ width: '100%', marginTop: 8 }} disabled={loading}>
            {loading ? 'Ingresando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.85rem', color: '#64748b' }}>
          ¿No tienes cuenta?{' '}
          <a href="/register" style={{ color: '#2563eb' }}>Regístrate aquí</a>
        </p>
        <div style={{ marginTop: 16, padding: 12, background: '#f1f5f9', borderRadius: 8, fontSize: '0.8rem', color: '#64748b' }}>
          <strong>Demo:</strong> admin@talento.com / Admin123!
        </div>
      </div>
    </div>
  );
}
