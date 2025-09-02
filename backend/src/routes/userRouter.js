const express = require('express');
const router = express.Router();
const userController = require('../controllers/usercontroller');

router.post('/register', userController.registerUser);
router.get('/', userController.listarUsuarios);
router.post('/', userController.agregarUsuario);
router.put('/:id', userController.actualizarUsuario);
router.delete('/:id', userController.eliminarUsuario);
router.get('/usuario/:id', userController.obtenerUsuarioPorId); 


module.exports = router;