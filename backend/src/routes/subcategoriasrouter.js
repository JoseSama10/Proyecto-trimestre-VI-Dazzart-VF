const express = require('express');
const router = express.Router();
const subcategoriaController = require('../controllers/subcategoriasController');

// Listar todas las subcategorias
router.get('/listar', subcategoriaController.listarSubcategorias);

// Listar subcategorias por categoría
router.get('/listar/:id_categoria', subcategoriaController.listarSubcategoriasPorCategoria);

// Agregar subcategoria
router.post('/agregar', subcategoriaController.agregarSubcategoria);

// Editar subcategoria
router.put('/editar/:id_subcategoria', subcategoriaController.editarSubcategoria);

// Eliminar subcategoria
router.delete('/eliminar/:id_subcategoria', subcategoriaController.eliminarSubcategoria);

module.exports = router;
