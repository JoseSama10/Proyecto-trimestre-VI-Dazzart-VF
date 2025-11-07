const express = require('express');
const router = express.Router();
const descuentoController = require('../controllers/descuentocontroller');

router.post('/', descuentoController.crearDescuento);
router.get('/', descuentoController.listarDescuentos);
router.get('/:id', descuentoController.obtenerDescuentoPorId);
router.put('/:id', descuentoController.actualizarDescuento);
router.delete('/:id', descuentoController.eliminarDescuento);

module.exports = router;