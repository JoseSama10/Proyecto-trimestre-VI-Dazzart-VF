
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

const olvidoPaswordController = require('../controllers/olvidoPaswordController');

router.post('/login', authController.login);
// Recuperación de contraseña
router.post('/forgot-password', olvidoPaswordController.solicitarReset);
router.post('/reset-password', olvidoPaswordController.resetPassword);

module.exports = router;
