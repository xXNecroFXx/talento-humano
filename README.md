# 🏢 TalentoHR - Plataforma de Gestión de Talento Humano

[![CI/CD Pipeline](https://github.com/tu-usuario/talento-humano/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/tu-usuario/talento-humano/actions)

> Plataforma web para automatizar la gestión de procesos de reclutamiento y selección de personal.
> Proyecto de Software - Universidad Iberoamericana 2026

---

## 📋 Descripción del Proyecto

TalentoHR es una plataforma web que centraliza el flujo de reclutamiento en una organización. Permite a los reclutadores gestionar vacantes, recibir postulaciones con CV en PDF y hacer seguimiento visual del estado de cada candidato mediante un tablero Kanban. Los candidatos pueden ver las vacantes activas y postularse directamente desde la plataforma.

### Problema que resuelve
Elimina el uso de hojas de cálculo, correos dispersos y carpetas físicas para gestionar procesos de contratación, reemplazándolos con un sistema centralizado, trazable y fácil de usar.

---

## 🏗️ Arquitectura General

```
┌──────────────────┐        ┌──────────────────┐        ┌──────────────────┐
│   FRONTEND       │◄──────►│   BACKEND API    │◄──────►│   BASE DE DATOS  │
│   React.js       │  JSON  │ Node.js + Express│  SQL   │   SQLite         │
│   Puerto 3000    │        │   Puerto 3001    │        │  database.sqlite │
└──────────────────┘        └──────────────────┘        └──────────────────┘
```

**Patrón:** Cliente-Servidor (REST API)
**Autenticación:** JWT (JSON Web Tokens)
**Despliegue:** Frontend en Vercel, Backend en Render

---

## 🛠️ Tecnologías Utilizadas

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Frontend | React.js | 18 |
| Routing | React Router DOM | 6 |
| HTTP Client | Axios | 1.6 |
| Backend | Node.js + Express | 20 / 4.18 |
| Base de Datos | SQLite (better-sqlite3) | 9.4 |
| Autenticación | JWT + Bcrypt | - |
| Documentación API | Swagger (swagger-jsdoc) | 6.2 |
| Testing Backend | Jest + Supertest | 29 |
| Testing Frontend | React Testing Library | 14 |
| CI/CD | GitHub Actions | - |
| Contenedores | Docker + Docker Compose | - |

---

## 🚀 Instalación y Ejecución Local

### Prerequisitos
- Node.js 18+ y npm
- Git

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/talento-humano.git
cd talento-humano
```

### 2. Configurar y ejecutar el Backend
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```
El servidor estará en: **http://localhost:3001**
Swagger docs en: **http://localhost:3001/api-docs**

### 3. Configurar y ejecutar el Frontend
```bash
cd frontend
npm install
npm start
```
La aplicación estará en: **http://localhost:3000**

### 4. Credenciales por defecto
| Campo | Valor |
|-------|-------|
| Correo | admin@talento.com |
| Contraseña | Admin123! |
| Rol | RECLUTADOR |

---

## 🐳 Ejecución con Docker (opcional)

```bash
# Desde la raíz del proyecto
docker-compose up --build
```
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

---

## 🧪 Ejecutar Pruebas

### Backend
```bash
cd backend
npm test               # todas las pruebas con coverage
npm run test:unit      # solo pruebas unitarias
npm run test:integration  # solo pruebas de integración
```

### Frontend
```bash
cd frontend
npm test
```

---

## 📚 Documentación de API

La documentación completa de los endpoints está disponible en Swagger:

**Local:** http://localhost:3001/api-docs

### Endpoints principales

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | /api/auth/register | Registrar usuario | No |
| POST | /api/auth/login | Iniciar sesión | No |
| GET | /api/auth/profile | Ver perfil | Sí |
| GET | /api/vacantes | Listar vacantes | No |
| POST | /api/vacantes | Crear vacante | RECLUTADOR |
| PUT | /api/vacantes/:id | Actualizar vacante | RECLUTADOR |
| DELETE | /api/vacantes/:id | Eliminar vacante | RECLUTADOR |
| GET | /api/postulaciones | Listar postulaciones | Sí |
| POST | /api/postulaciones | Crear postulación + CV | CANDIDATO |
| PATCH | /api/postulaciones/:id/estado | Cambiar estado | RECLUTADOR |
| GET | /api/usuarios | Listar usuarios | RECLUTADOR |
| POST | /api/usuarios | Crear usuario | RECLUTADOR |
| DELETE | /api/usuarios/:id | Eliminar usuario | RECLUTADOR |

---

## 👥 Equipo de Desarrollo

| Nombre | Rol | ID |
|--------|-----|----|
| Sebastian | Product Owner | - |
| Catherine | Scrum Master | - |
| Alejandro | Developer | - |
| Johan Álvarez | Developer | 100181617 |

---

## 🔗 Enlaces

- **Aplicación en producción:** https://talento-hr.vercel.app
- **API en producción:** https://talento-hr-api.onrender.com
- **Documentación Swagger:** https://talento-hr-api.onrender.com/api-docs
- **Wiki del proyecto:** [GitHub Wiki](../../wiki)

---

*Universidad Iberoamericana - Ingeniería de Software - Proyecto de Software 2026*
