const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriasController');


// Middleware para debug
router.use((req, res, next) => {
  console.log(`[RUTA CATEGORÍA] ${req.method} ${req.originalUrl}`);
  next();
});

// Listar todas las categorías
router.get('/listar', categoriaController.listarCategorias);

// Agregar una nueva categoría
router.post('/agregar', categoriaController.agregarCategoria);

// Editar una categoría existente
router.put('/editar/:id', categoriaController.editarCategoria);

// Eliminar una categoría
router.delete('/eliminar/:id', categoriaController.eliminarCategoria);

module.exports = router;
