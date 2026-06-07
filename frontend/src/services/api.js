import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const loginApi = (data) => API.post('/auth/login', data);
export const registerApi = (data) => API.post('/auth/register', data);
export const getProfileApi = () => API.get('/auth/profile');
export const updateProfileApi = (data) => API.put('/auth/profile', data);

// Vacantes
export const getVacantesApi = () => API.get('/vacantes');
export const getVacanteApi = (id) => API.get(`/vacantes/${id}`);
export const createVacanteApi = (data) => API.post('/vacantes', data);
export const updateVacanteApi = (id, data) => API.put(`/vacantes/${id}`, data);
export const deleteVacanteApi = (id) => API.delete(`/vacantes/${id}`);

// Postulaciones
export const getPostulacionesApi = () => API.get('/postulaciones');
export const getPostulacionesByVacanteApi = (id) => API.get(`/postulaciones/vacante/${id}`);
export const createPostulacionApi = (formData) => API.post('/postulaciones', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateEstadoApi = (id, estado_proceso) => API.patch(`/postulaciones/${id}/estado`, { estado_proceso });

// Usuarios
export const getUsuariosApi = () => API.get('/usuarios');
export const createUsuarioApi = (data) => API.post('/usuarios', data);
export const deleteUsuarioApi = (id) => API.delete(`/usuarios/${id}`);
