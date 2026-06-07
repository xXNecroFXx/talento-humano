process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_secret';

const { closeDb } = require('../../config/database');
afterAll(() => { closeDb(); });

const authController = require('../../controllers/authController');

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('AuthController - register', () => {
  test('debe retornar 400 si faltan campos', async () => {
    const req = { body: { nombre: '', correo: '', clave: '' } };
    const res = mockRes();
    await authController.register(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('debe registrar usuario correctamente', async () => {
    const req = { body: { nombre: 'Test User', correo: `test${Date.now()}@test.com`, clave: 'Pass123!' } };
    const res = mockRes();
    await authController.register(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test('debe retornar 409 si el correo ya existe', async () => {
    const correo = `dup${Date.now()}@test.com`;
    const req = { body: { nombre: 'Dup', correo, clave: 'Pass123!' } };
    const res = mockRes();
    await authController.register(req, res);
    const res2 = mockRes();
    await authController.register(req, res2);
    expect(res2.status).toHaveBeenCalledWith(409);
  });

  test('debe retornar 400 con tipo_usuario inválido', async () => {
    const req = { body: { nombre: 'Bad', correo: 'bad@test.com', clave: 'pass', tipo_usuario: 'SUPERADMIN' } };
    const res = mockRes();
    await authController.register(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe('AuthController - login', () => {
  test('debe retornar 400 si faltan credenciales', async () => {
    const req = { body: {} };
    const res = mockRes();
    await authController.login(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('debe retornar 401 con credenciales incorrectas', async () => {
    const req = { body: { correo: 'noexiste@test.com', clave: 'wrong' } };
    const res = mockRes();
    await authController.login(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  test('debe hacer login correctamente y retornar token', async () => {
    const req = { body: { correo: 'admin@talento.com', clave: 'Admin123!' } };
    const res = mockRes();
    await authController.login(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ token: expect.any(String) }));
  });
});

describe('AuthController - getProfile', () => {
  test('debe retornar 404 si usuario no existe', async () => {
    const req = { user: { id: 99999 } };
    const res = mockRes();
    await authController.getProfile(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('debe retornar perfil del admin', async () => {
    const req = { user: { id: 1 } };
    const res = mockRes();
    await authController.getProfile(req, res);
    expect(res.json).toHaveBeenCalled();
  });
});

describe('AuthController - updateProfile', () => {
  test('debe retornar 400 si falta nombre', async () => {
    const req = { body: {}, user: { id: 1 } };
    const res = mockRes();
    await authController.updateProfile(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('debe actualizar nombre correctamente', async () => {
    const req = { body: { nombre: 'Nuevo Nombre' }, user: { id: 1 } };
    const res = mockRes();
    await authController.updateProfile(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.any(String) }));
  });
});
