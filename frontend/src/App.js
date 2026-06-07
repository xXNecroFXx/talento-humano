import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Vacantes from './pages/Vacantes';
import Candidatos from './pages/Candidatos';
import Kanban from './pages/Kanban';
import Perfil from './pages/Perfil';
import { Usuarios, MisPostulaciones } from './pages/Usuarios';

function PrivateLayout({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">{children}</main>
    </div>
  );
}

function ReclutadorRoute({ children }) {
  const { user, isReclutador } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (!isReclutador) return <Navigate to="/dashboard" />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<PrivateLayout><Dashboard /></PrivateLayout>} />
          <Route path="/vacantes" element={<PrivateLayout><Vacantes /></PrivateLayout>} />
          <Route path="/perfil" element={<PrivateLayout><Perfil /></PrivateLayout>} />
          <Route path="/mis-postulaciones" element={<PrivateLayout><MisPostulaciones /></PrivateLayout>} />
          <Route path="/candidatos" element={<ReclutadorRoute><PrivateLayout><Candidatos /></PrivateLayout></ReclutadorRoute>} />
          <Route path="/kanban" element={<ReclutadorRoute><PrivateLayout><Kanban /></PrivateLayout></ReclutadorRoute>} />
          <Route path="/usuarios" element={<ReclutadorRoute><PrivateLayout><Usuarios /></PrivateLayout></ReclutadorRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
