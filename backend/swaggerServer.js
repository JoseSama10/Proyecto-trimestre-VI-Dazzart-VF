const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const app = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Documentación Swagger corriendo en http://localhost:${PORT}/api-docs`);
});
