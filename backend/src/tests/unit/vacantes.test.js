process.env.NODE_ENV = 'test';
const { closeDb } = require('../../config/database');
afterAll(() => { closeDb(); });

const vacantesController = require('../../controllers/vacantesController');

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('VacantesController', () => {
  let vacanteId;

  test('createVacante - retorna 400 si faltan campos', async () => {
    const req = { body: {} };
    const res = mockRes();
    await vacantesController.createVacante(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('createVacante - crea vacante correctamente', async () => {
    const req = { body: { titulo: 'Dev Senior', descripcion: 'Rol senior', requisitos: 'React, Node' } };
    const res = mockRes();
    await vacantesController.createVacante(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    vacanteId = res.json.mock.calls[0][0].id;
  });

  test('getVacantes - retorna lista', async () => {
    const req = {};
    const res = mockRes();
    await vacantesController.getVacantes(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.any(Array));
  });

  test('getVacanteById - retorna vacante existente', async () => {
    const req = { params: { id: vacanteId } };
    const res = mockRes();
    await vacantesController.getVacanteById(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: vacanteId }));
  });

  test('getVacanteById - retorna 404 si no existe', async () => {
    const req = { params: { id: 99999 } };
    const res = mockRes();
    await vacantesController.getVacanteById(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('updateVacante - actualiza correctamente', async () => {
    const req = { params: { id: vacanteId }, body: { titulo: 'Dev Actualizado' } };
    const res = mockRes();
    await vacantesController.updateVacante(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.any(String) }));
  });

  test('deleteVacante - elimina correctamente', async () => {
    const req = { params: { id: vacanteId } };
    const res = mockRes();
    await vacantesController.deleteVacante(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.any(String) }));
  });

  test('deleteVacante - retorna 404 si no existe', async () => {
    const req = { params: { id: 99999 } };
    const res = mockRes();
    await vacantesController.deleteVacante(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });
});
