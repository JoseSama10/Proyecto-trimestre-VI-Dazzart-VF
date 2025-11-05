const db = require('../config/db');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Configura tu transportador de correo aquí
const transporter = nodemailer.createTransport({
  service: 'gmail', // Cambia según tu proveedor
  auth: {
    user: 'jopsezabaleta5@gmail.com',
    pass: 'czvm nhop xzev uova',
  },
});

exports.solicitarReset = async (req, res) => {
  const { correo_electronico } = req.body;
  if (!correo_electronico) {
    return res.status(400).json({ message: 'Correo requerido' });
  }
  try {
    console.log('PETICIÓN de recuperación recibida para:', correo_electronico);
    const [results] = await db.query('SELECT * FROM usuario WHERE correo_electronico = ?', [correo_electronico]);
    console.log('Resultado de búsqueda en BD:', results);
    if (results.length === 0) {
      console.log('Usuario no encontrado:', correo_electronico);
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    const token = crypto.randomBytes(32).toString('hex');
    console.log('Token generado:', token);
    const expires = new Date(Date.now() + 1000 * 60 * 30); // 30 minutos
    await db.query('UPDATE usuario SET reset_token = ?, reset_token_expires = ? WHERE correo_electronico = ?', [token, expires, correo_electronico]);
    // Preferir una URL web para que los clientes (Gmail, navegadores) puedan abrirla.
    // Puedes configurar FRONTEND_URL en las variables de entorno (ej: https://tu-dominio.com).
    const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetUrl = `${FRONTEND_URL.replace(/\/$/, '')}/reset-password/${token}`;
    // Deep link opcional para intentar abrir la app móvil (si está instalada y registrada)
    const deepLink = `dazzart://reset-password/${token}`;
    console.log('Enviando correo a:', correo_electronico, 'con URL web:', resetUrl, 'y deepLink:', deepLink);
    await transporter.sendMail({
      from: 'TU_CORREO@gmail.com',
      to: correo_electronico,
      subject: 'Recupera tu contraseña',
      html: `
        <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <hr />
        <p>Si estás en un móvil y tienes la app instalada, puedes intentar abrir directamente la app con este enlace:</p>
        <p><a href="${deepLink}">${deepLink}</a></p>
        <p>Si el deep link no funciona al hacer clic, usa el enlace web anterior o copia/pega el deep link en el navegador del móvil.</p>
      `
    });
    console.log('Correo enviado correctamente a:', correo_electronico);
    res.json({ message: 'Correo de recuperación enviado' });
  } catch (err) {
    console.error('ERROR al enviar correo:', err);
    res.status(500).json({ message: 'Error en el servidor', error: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  const { token, nuevaContrasena } = req.body;
  if (!token || !nuevaContrasena) {
    return res.status(400).json({ message: 'Token y nueva contraseña requeridos' });
  }
  try {
    const [results] = await db.query('SELECT * FROM usuario WHERE reset_token = ? AND reset_token_expires > NOW()', [token]);
    if (results.length === 0) {
      return res.status(400).json({ message: 'Token inválido o expirado' });
    }
    const hash = await bcrypt.hash(nuevaContrasena, 10);
    await db.query('UPDATE usuario SET contrasena = ?, reset_token = NULL, reset_token_expires = NULL WHERE reset_token = ?', [hash, token]);
    res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (err) {
    res.status(500).json({ message: 'Error en el servidor', error: err.message });
  }
};
