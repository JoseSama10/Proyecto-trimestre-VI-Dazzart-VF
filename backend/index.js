const createApp = require('../backend/src/app');


const app = createApp();

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
