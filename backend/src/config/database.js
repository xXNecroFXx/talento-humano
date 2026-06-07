const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_PATH = process.env.NODE_ENV === 'test'
  ? ':memory:'
  : path.join(__dirname, '../../database.sqlite');

let db;

/**
 * Obtiene la instancia de la base de datos
 * @returns {sqlite3.Database}
 */
function getDb() {
  if (!db) {
    db = new sqlite3.Database(DB_PATH);
    db.serialize(() => {
      db.run('PRAGMA journal_mode = WAL');
      db.run('PRAGMA foreign_keys = ON');
      db.run(`CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        correo TEXT UNIQUE NOT NULL,
        clave TEXT NOT NULL,
        tipo_usuario TEXT NOT NULL DEFAULT 'CANDIDATO' CHECK(tipo_usuario IN ('RECLUTADOR','CANDIDATO')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);
      db.run(`CREATE TABLE IF NOT EXISTS vacantes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        descripcion TEXT NOT NULL,
        requisitos TEXT NOT NULL,
        estado TEXT NOT NULL DEFAULT 'ABIERTA' CHECK(estado IN ('ABIERTA','CERRADA')),
        fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);
      db.run(`CREATE TABLE IF NOT EXISTS postulaciones (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        id_usuario INTEGER NOT NULL,
        id_vacante INTEGER NOT NULL,
        ruta_archivo_pdf TEXT,
        estado_proceso TEXT NOT NULL DEFAULT 'RECIBIDO' CHECK(estado_proceso IN ('RECIBIDO','ENTREVISTA','PRUEBA','RECHAZADO','EMPLEADO')),
        fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
        FOREIGN KEY (id_vacante) REFERENCES vacantes(id),
        UNIQUE(id_usuario, id_vacante)
      )`);
      // Seed admin
      const hash = bcrypt.hashSync('Admin123!', 10);
      db.run(
        `INSERT OR IGNORE INTO usuarios (nombre, correo, clave, tipo_usuario) VALUES (?, ?, ?, ?)`,
        ['Administrador', 'admin@talento.com', hash, 'RECLUTADOR']
      );
    });
  }
  return db;
}

/**
 * Ejecuta una query y retorna todos los resultados
 */
function dbAll(query, params = []) {
  return new Promise((resolve, reject) => {
    getDb().all(query, params, (err, rows) => err ? reject(err) : resolve(rows));
  });
}

/**
 * Ejecuta una query y retorna el primer resultado
 */
function dbGet(query, params = []) {
  return new Promise((resolve, reject) => {
    getDb().get(query, params, (err, row) => err ? reject(err) : resolve(row));
  });
}

/**
 * Ejecuta una query de escritura (INSERT, UPDATE, DELETE)
 */
function dbRun(query, params = []) {
  return new Promise((resolve, reject) => {
    getDb().run(query, params, function(err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

/**
 * Cierra la conexión (usado en tests)
 */
function closeDb() {
  if (db) {
    db.close();
    db = null;
  }
}

module.exports = { getDb, dbAll, dbGet, dbRun, closeDb };
