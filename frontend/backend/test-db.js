const pool = require('./src/db'); // importa el archivo de conexión que crees que usa

(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Conectado correctamente como dazzart');
    connection.release();
  } catch (error) {
    console.error('Error al conectar:', error);
  }
})();
