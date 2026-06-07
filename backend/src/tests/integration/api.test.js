process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_secret';

const request = require('supertest');
const app = require('../../index');
const { closeDb } = require('../../config/database');

afterAll(() => { closeDb(); });

let tokenAdmin;
let vacanteId;
let postulacionId;

describe('Integración - Auth', () => {
  test('POST /api/auth/login - login exitoso con admin seed', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ correo: 'admin@talento.com', clave: 'Admin123!' });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    tokenAdmin = res.body.token;
  });

  test('POST /api/auth/login - credenciales incorrectas retorna 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ correo: 'noexiste@test.com', clave: 'wrong' });
    expect(res.status).toBe(401);
  });

  test('GET /api/auth/profile - retorna perfil con token válido', async () => {
    const res = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${tokenAdmin}`);
    expect(res.status).toBe(200);
    expect(res.body.correo).toBe('admin@talento.com');
  });
});

describe('Integración - Vacantes', () => {
  test('POST /api/vacantes - crea vacante como reclutador', async () => {
    const res = await request(app)
      .post('/api/vacantes')
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({ titulo: 'Desarrollador Full Stack', descripcion: 'Buscamos dev con experiencia', requisitos: 'React, Node.js, 3 años' });
    expect(res.status).toBe(201);
    vacanteId = res.body.id;
  });

  test('GET /api/vacantes - lista vacantes sin autenticación', async () => {
    const res = await request(app).get('/api/vacantes');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /api/vacantes/:id - retorna vacante creada', async () => {
    const res = await request(app).get(`/api/vacantes/${vacanteId}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(vacanteId);
  });
});

describe('Integración - Postulaciones', () => {
  let tokenCandidato;

  beforeAll(async () => {
    // Registrar candidato de prueba
    await request(app).post('/api/auth/register').send({
      nombre: 'Candidato Test',
      correo: `candidato_integ_${Date.now()}@test.com`,
      clave: 'Test123!',
      tipo_usuario: 'CANDIDATO'
    });
    // Hacer login como candidato
    const correo = `candidato_integ2_${Date.now()}@test.com`;
    await request(app).post('/api/auth/register').send({ nombre: 'Cand2', correo, clave: 'Test123!', tipo_usuario: 'CANDIDATO' });
    const login = await request(app).post('/api/auth/login').send({ correo, clave: 'Test123!' });
    tokenCandidato = login.body.token;
  });

  test('POST /api/postulaciones - candidato se postula a vacante', async () => {
    const res = await request(app)
      .post('/api/postulaciones')
      .set('Authorization', `Bearer ${tokenCandidato}`)
      .field('id_vacante', vacanteId);
    expect([201, 409]).toContain(res.status);
    if (res.status === 201) postulacionId = res.body.id;
  });

  test('GET /api/postulaciones - reclutador ve todas las postulaciones', async () => {
    const res = await request(app)
      .get('/api/postulaciones')
      .set('Authorization', `Bearer ${tokenAdmin}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('PATCH /api/postulaciones/:id/estado - reclutador actualiza estado', async () => {
    // Obtener una postulación real
    const posts = await request(app)
      .get('/api/postulaciones')
      .set('Authorization', `Bearer ${tokenAdmin}`);
    if (posts.body.length > 0) {
      const id = posts.body[0].id;
      const res = await request(app)
        .patch(`/api/postulaciones/${id}/estado`)
        .set('Authorization', `Bearer ${tokenAdmin}`)
        .send({ estado_proceso: 'ENTREVISTA' });
      expect(res.status).toBe(200);
    }
  });
});
