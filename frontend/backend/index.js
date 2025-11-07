const createApp = require('../backend/src/app');

const app = createApp();

const PORT = process.env.PORT || 3001;

// Escuchar en todas las interfaces
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor backend corriendo en http://0.0.0.0:${PORT}`);
});
