const db = require('../config/db');
const path = require('path');
const fs = require('fs');

exports.listarSubcategorias = async (req, res) => {
  const sql = `
    SELECT s.*, c.nombre_categoria
    FROM subcategoria s
    JOIN categoria c ON s.id_categoria = c.id_categoria
    ORDER BY s.id_subcategoria DESC
  `;
  try {
    const [results] = await db.query(sql);
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener subcategorías' });
  }
};

exports.listarSubcategoriasPorCategoria = async (req, res) => {
  const id_categoria = req.params.id_categoria;
  try {
    const [results] = await db.query(
      'SELECT * FROM subcategoria WHERE id_categoria = ?',
      [id_categoria]
    );
    res.json(results);
  } catch (err) {
    console.error('Error al listar subcategorias por categoria:', err);
    res.status(500).json({ error: 'Error al obtener subcategorías' });
  }
};

exports.agregarSubcategoria = async (req, res) => {
  const { nombre_subcategoria, descripcion_subcategoria, id_categoria } = req.body;
  if (!id_categoria || !descripcion_subcategoria) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
  }
  try {
    const [result] = await db.query(
      'INSERT INTO subcategoria (nombre_subcategoria, descripcion_subcategoria, id_categoria) VALUES (?, ?, ?)',
      [nombre_subcategoria, descripcion_subcategoria, id_categoria]
    );
    res.status(201).json({ message: 'Subcategoría agregada', id: result.insertId });
  } catch (err) {
    console.error('Error al agregar subcategoria:', err);
    res.status(500).json({ error: 'Error al agregar subcategoría' });
  }
};

exports.editarSubcategoria = async (req, res) => {
  const id_subcategoria = req.params.id_subcategoria;
  const { nombre_subcategoria, descripcion_subcategoria, id_categoria } = req.body;

  if (!id_categoria || !descripcion_subcategoria) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
  }

  try {
    await db.query(
      'UPDATE subcategoria SET nombre_subcategoria = ?, descripcion_subcategoria = ?, id_categoria = ? WHERE id_subcategoria = ?',
      [nombre_subcategoria, descripcion_subcategoria, id_categoria, id_subcategoria]
    );
    res.json({ message: 'Subcategoría actualizada' });
  } catch (err) {
    console.error('Error al actualizar subcategoria:', err);
    res.status(500).json({ error: 'Error al actualizar subcategoría' });
  }
};

exports.eliminarSubcategoria = async (req, res) => {
  const id_subcategoria = req.params.id_subcategoria;
  try {
    await db.query('DELETE FROM subcategoria WHERE id_subcategoria = ?', [id_subcategoria]);
    res.json({ message: 'Subcategoría eliminada' });
  } catch (err) {
    console.error('Error al eliminar subcategoria:', err);
    res.status(500).json({ error: 'Error al eliminar subcategoría' });
  }
};
