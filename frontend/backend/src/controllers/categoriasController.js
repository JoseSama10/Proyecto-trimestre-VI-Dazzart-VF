const db = require('../config/db');

// Listar categorías
exports.listarCategorias = async (req, res) => {
  console.log("Petición GET /categorias/listar recibida");

  try {
    const [results] = await db.query('SELECT * FROM categoria');
    console.log("Categorías obtenidas:", results);
    res.json(results);
  } catch (err) {
    console.error("Error en consulta categorías:", err);
    res.status(500).json({ error: err.message || err });
  }
};

// Agregar nueva categoría
exports.agregarCategoria = async (req, res) => {
  const { nombre, descripcion } = req.body;

  try {
    await db.query(
      `INSERT INTO categoria (nombre_categoria, descripcion_categoria) VALUES (?, ?)`,
      [nombre, descripcion]
    );
    res.json({ message: 'Categoría agregada correctamente' });
  } catch (err) {
    console.error('Error al agregar categoría:', err);
    res.status(500).json({ error: 'No se pudo agregar la categoría' });
  }
};

// Editar categoría
exports.editarCategoria = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion } = req.body;

  try {
    await db.query(
      `UPDATE categoria SET nombre_categoria = ?, descripcion_categoria = ? WHERE id_categoria = ?`,
      [nombre, descripcion, id]
    );
    res.json({ message: 'Categoría actualizada correctamente' });
  } catch (err) {
    console.error('Error al editar categoría:', err);
    res.status(500).json({ error: 'No se pudo editar la categoría' });
  }
};

// Eliminar categoría
exports.eliminarCategoria = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query(`DELETE FROM categoria WHERE id_categoria = ?`, [id]);
    res.json({ message: 'Categoría eliminada correctamente' });
  } catch (err) {
    console.error('Error al eliminar categoría:', err);
    res.status(500).json({ error: 'No se pudo eliminar la categoría' });
  }
};
