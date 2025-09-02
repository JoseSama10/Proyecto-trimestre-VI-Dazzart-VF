const express = require('express');
const router = express.Router();
const carritoController = require('../controllers/carritoController');

router.get('/:id_usuario', carritoController.obtenerCarrito);
router.post('/', carritoController.agregarProducto);
router.delete('/:id_carrito', carritoController.eliminarProducto);
router.delete('/vaciar/:id_usuario', carritoController.vaciarCarrito);

module.exports = router;