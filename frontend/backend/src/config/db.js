const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'dazzart',             // usuario creado para el backend
  password: 'D4zz@rt2025!',    // contraseña correcta del usuario
  database: 'dazzart_db',      // base de datos correcta
});

(async () => {
  try {
    // Prueba simple para ver si la conexión funciona:
    const connection = await pool.getConnection();
    console.log('Conectado a MySQL correctamente.');
    connection.release();
  } catch (error) {
    console.error('Error al conectar a MySQL:', error);
  }
})();

module.exports = pool;
