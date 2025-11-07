const bcrypt = require('bcrypt');
const db = require('../config/db');

//  Registrar usuario como cliente desde frontend público
exports.registerUser = async (req, res) => {
  const {
    nombre,
    nombre_usuario,
    correo_electronico,
    telefono,
    contrasena,
    cedula,
    direccion
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(contrasena, 10);
    const id_rol = 2; // 2 = cliente

    const sql = `
      INSERT INTO usuario 
      (nombre, nombre_usuario, correo_electronico, telefono, contrasena, cedula, direccion, id_rol)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    await db.query(sql, [
      nombre,
      nombre_usuario,
      correo_electronico,
      telefono,
      hashedPassword,
      cedula,
      direccion,
      id_rol
    ]);

    res.status(201).json({ message: 'Usuario registrado con éxito' });
  } catch (error) {
    console.error('Error en el registro:', error);
    res.status(500).json({ error: 'Error al registrar el usuario' });
  }
};

// Lista usuarios en el crud usuarios //
exports.listarUsuarios = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT u.*, r.nombre_rol AS rol
      FROM usuario u
      JOIN roles r ON u.id_rol = r.id_rol
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error en listarUsuarios:', error); //  muestra el error en consola
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
};

//Agregar el usuario desde el crud usuarios //
exports.agregarUsuario = async (req, res) => {
  const {
    cedula,
    nombre,
    nombre_usuario,
    correo,
    telefono,
    direccion,
    contrasena,
    id_rol
  } = req.body;

  try {
    // Validar si ya existe el correo o nombre de usuario
    const [usuariosExistentes] = await db.query(
      `SELECT * FROM usuario WHERE correo_electronico = ? OR nombre_usuario = ?`,
      [correo, nombre_usuario]
    );

    if (usuariosExistentes.length > 0) {
      return res.status(400).json({
        error: 'Ya existe un usuario con ese correo electrónico o nombre de usuario'
      });
    }

    const hashedPassword = await bcrypt.hash(contrasena, 10);

    await db.query(`
      INSERT INTO usuario 
      (cedula, nombre, nombre_usuario, correo_electronico, telefono, direccion, contrasena, id_rol) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [cedula, nombre, nombre_usuario, correo, telefono, direccion, hashedPassword, id_rol]
    );

    res.status(201).json({ message: 'Usuario creado' });
  } catch (error) {
    console.error('Error al agregar usuario:', error);
    res.status(500).json({ error: error.message });
  }
};

// Actualiza el usuario que trajo obtener usuario y los actualiza con update se omite el campo id_rol por que en el componente se aplico readonly//
exports.actualizarUsuario = async (req, res) => {
  const {
    nombre,
    nombre_usuario,
    correo,
    telefono,
    direccion,
    contrasena
  } = req.body;
  const { id } = req.params;

  try {
    
    await db.query(`
      UPDATE usuario SET 
        nombre = ?, 
        nombre_usuario = ?, 
        correo_electronico = ?, 
        telefono = ?, 
        direccion = ?
      WHERE id_usuario = ?`,
      [nombre, nombre_usuario, correo, telefono, direccion, id]
    );

    if (contrasena && contrasena.trim() !== '') {
      const hashedPassword = await bcrypt.hash(contrasena, 10);
      await db.query(
        'UPDATE usuario SET contrasena = ? WHERE id_usuario = ?',
        [hashedPassword, id]
      );
    }

    res.json({ message: 'Usuario actualizado' });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.cambiarEstadoUsuario = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  try {
    //  Verificar que el usuario exista
    const [rows] = await db.query(
      "SELECT id_usuario, correo_electronico FROM usuario WHERE id_usuario = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const usuario = rows[0];

    //  Bloquear si es el admin principal e intentan inactivarlo
    if (
      (usuario.id_usuario === 1 ||
        usuario.correo_electronico === "josecrack13113@gmail.com") &&
      estado.toLowerCase() === "inactivo"
    ) {
      return res.status(403).json({
        error: "No se puede desactivar al administrador principal",
      });
    }

    //  Si pasa las validaciones  actualizar
    await db.query(
      "UPDATE usuario SET estado = ? WHERE id_usuario = ?",
      [estado, id]
    );

    res.json({ message: `Usuario ${estado}` });
  } catch (error) {
    console.error("Error al cambiar estado:", error);
    res
      .status(500)
      .json({ error: "Error al cambiar el estado del usuario" });
  }
};


// obtiene los datos de un usuario en especifico para posteriormente actualizar los datos con el update de actualizar usuario //

exports.obtenerUsuarioPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(`
      SELECT u.*, r.nombre_rol AS rol
      FROM usuario u
      JOIN roles r ON u.id_rol = r.id_rol
      WHERE u.id_usuario = ?
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(rows[0]); // Contiene: id_rol, rol (nombre), y demás campos
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ error: 'Error al obtener el usuario' });
  }
};