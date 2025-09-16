const express = require('express');
const router = express.Router();

const {
  obtenerPedidos,
  obtenerPedidoPorId,
  crearPedido,
  obtenerPedidosPorUsuario,
  cancelarPedido,
  actualizarEstadoPedido,
  vaciarPapelera,
  restaurarPedido
} = require('../controllers/pedidosController');

router.get('/', obtenerPedidos);
router.get('/usuario/:id_usuario', obtenerPedidosPorUsuario);
router.put('/actualizar-estado/:id_factura', actualizarEstadoPedido);
router.put('/cancelar/:id_factura', cancelarPedido);
router.get('/:id', obtenerPedidoPorId);
router.post('/', crearPedido);
router.delete('/vaciar-papelera', vaciarPapelera);
router.put('/restaurar/:id_factura', restaurarPedido);

module.exports = router;