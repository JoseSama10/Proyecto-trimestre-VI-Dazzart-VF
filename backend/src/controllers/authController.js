const bcrypt = require('bcrypt');
const db = require('../config/db');

const jwt = require('jsonwebtoken');
const SECRET = 'jose';

exports.login = async (req, res) => {
  const { correo_electronico, contrasena } = req.body;
  if (!correo_electronico || !contrasena) {
    return res.status(400).json({ message: 'Correo y contraseña requeridos' });
  }
  try {
    const [results] = await db.query(
      'SELECT * FROM usuario WHERE correo_electronico = ?',
      [correo_electronico]
    );
    if (results.length === 0) return res.status(401).json({ message: 'Usuario no encontrado' });
    const user = results[0];
    const match = await bcrypt.compare(contrasena, user.contrasena);
    if (!match) return res.status(401).json({ message: 'Contraseña incorrecta' });
    const token = jwt.sign({ id_usuario: user.id_usuario, id_rol: user.id_rol }, SECRET);
    res.json({
      message: 'Login exitoso',
      user: {
        id_usuario: user.id_usuario,
        nombre: user.nombre,
        id_rol: user.id_rol,
        correo_electronico: user.correo_electronico,
        direccion: user.direccion // Agregado para que el frontend tenga la dirección
      },
      token // Enviando el token al frontend
    });
  } catch (err) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
};
