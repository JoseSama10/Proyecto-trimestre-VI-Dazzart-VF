const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

const express = require('express');
const cors = require('cors');
const path = require('path');

// Routers
const productosRouter = require('./routes/productosrouter');
const categoriasRouter = require('./routes/categoriasrouter');
const subcategoriasRouter = require('./routes/subcategoriasrouter');
const pedidosRouter = require('./routes/pedidosRouter');
const carritoRouter = require('./routes/carritoRouter');
const userRoutes = require('./routes/userRouter');
const descuentoRoutes = require('./routes/descuentoRouter');
const authRouter = require('./routes/authRouter');

const createApp = () => {
  const app = express();

  // CORS
  app.use(cors({
    origin: (origin, callback) => {
      console.log('\nORIGEN Request:', origin);
      callback(null, true);
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
  }));

  // Middleware
  app.use(express.json());

  // Logging
  app.use((req, res, next) => {
    console.log(`PETICIÓN recibida: ${req.method} ${req.originalUrl}`);
    next();
  });

  // Ruta raíz
  app.get('/', (req, res) => {
    res.send('Bienvenido a la API de DAZZART ');
  });

  // API Routes (todas bajo /api)
  app.use('/api/login', authRouter);
  app.use('/api/productos', productosRouter);
  app.use('/api/categorias', categoriasRouter);
  app.use('/api/subcategorias', subcategoriasRouter);
  app.use('/api/pedidos', pedidosRouter);
  app.use('/api/carrito', carritoRouter);
  app.use('/api/usuarios', userRoutes);
  app.use('/api/descuentos', descuentoRoutes);

  // Imágenes estáticas
  app.use('/productos/img', express.static(path.join(__dirname, '../public/img')));

   app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  return app;
};

module.exports = createApp;
