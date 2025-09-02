const pool = require('../config/db');  

// Obtener todos los pedidos
exports.obtenerPedidos = async (req, res) => {
  try {
    let query = `
      SELECT 
        p.id_factura,
        p.direccion,
        u.nombre AS nombre_cliente,
        p.productos,
        p.total_productos,
        p.total,
        p.estado`;
    // Si se pide la papelera, incluir fecha_eliminado y filtrar
    if (req.query.papelera === '1') {
      query += ', p.fecha_eliminado FROM pedidos p INNER JOIN usuario u ON p.id_usuario = u.id_usuario WHERE u.id_rol = 2 AND p.en_papelera = 1';
    } else {
      query += ' FROM pedidos p INNER JOIN usuario u ON p.id_usuario = u.id_usuario WHERE u.id_rol = 2';
    }
    const [rows] = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

// Obtener un pedido por ID
exports.obtenerPedidoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(`
      SELECT 
        p.id_factura,
        p.direccion,
        u.nombre AS nombre_cliente,
        p.productos,
        p.total_productos,
        p.total,
        p.estado
      FROM pedidos p
      INNER JOIN usuario u ON p.id_usuario = u.id_usuario
      WHERE p.id_factura = ?
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener pedido:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

// Crear nuevo pedido
exports.crearPedido = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { id_usuario, direccion, productos, total_productos, total } = req.body;

    if (!productos || !Array.isArray(productos) || productos.length === 0) {
      return res.status(400).json({ error: 'No hay productos en el pedido' });
    }

    await connection.beginTransaction();

    // Verificar stock y descontar
    for (const item of productos) {
      const [rows] = await connection.query(
        'SELECT stock FROM producto WHERE id_producto = ?',
        [item.id_producto]
      );

      if (rows.length === 0) {
        throw new Error(`Producto ID ${item.id_producto} no encontrado`);
      }

      const stockActual = rows[0].stock;
      if (stockActual < item.cantidad) {
        throw new Error(`Stock insuficiente para el producto ID ${item.id_producto}`);
      }

      await connection.query(
        'UPDATE producto SET stock = stock - ? WHERE id_producto = ?',
        [item.cantidad, item.id_producto]
      );
    }

    // Obtener nombres y precios reales de los productos
    const productosConNombre = await Promise.all(
      productos.map(async (item) => {
        const [result] = await connection.query(
          'SELECT nombre, precio FROM producto WHERE id_producto = ?',
          [item.id_producto]
        );

        return {
          id_producto: item.id_producto,
          cantidad: item.cantidad,
          nombre: result[0]?.nombre || 'Desconocido',
          precio: result[0]?.precio || 0
        };
      })
    );

    const productosJSON = JSON.stringify(productosConNombre);

    // Insertar pedido con productos serializados como JSON
    const [result] = await connection.query(
      `INSERT INTO pedidos (id_usuario, direccion, productos, total_productos, total, estado)
       VALUES (?, ?, ?, ?, ?, 'pendiente')`,
      [id_usuario, direccion, productosJSON, total_productos, total]
    );

    await connection.commit();

    res.json({ message: 'Pedido creado exitosamente', id_factura: result.insertId });
  } catch (error) {
    await connection.rollback();
    console.error('Error al crear pedido:', error);
    res.status(500).json({ error: error.message || 'Error al crear el pedido' });
  } finally {
    connection.release();
  }
};

// Obtener pedidos por ID de usuario
exports.obtenerPedidosPorUsuario = async (req, res) => {
  try {
    const { id_usuario } = req.params;
    const [rows] = await pool.query(`
      SELECT 
        p.id_factura,
        p.direccion,
        u.nombre AS nombre_cliente,
        p.productos,
        p.total_productos,
        p.total,
        p.estado
      FROM pedidos p
      INNER JOIN usuario u ON p.id_usuario = u.id_usuario
      WHERE p.id_usuario = ?
    `, [id_usuario]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'No se encontraron pedidos para este usuario' });
    }

    res.json(rows);
  } catch (error) {
    console.error('Error al obtener pedidos por usuario:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

// Cancelar pedido y reintegrar stock
exports.cancelarPedido = async (req, res) => {
  const { id_factura } = req.params;

  try {
    // Obtener pedido y estado
    const [pedidoData] = await pool.query(
      'SELECT productos, estado FROM pedidos WHERE id_factura = ?',
      [id_factura]
    );

    if (pedidoData.length === 0) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    const pedido = pedidoData[0];

    if (pedido.estado === 'cancelado') {
      return res.status(400).json({ error: 'El pedido ya está cancelado' });
    }

    // Parsear productos JSON
    let productos = [];
    try {
      productos = JSON.parse(pedido.productos);
    } catch (error) {
      return res.status(400).json({ error: 'Error al procesar los productos del pedido' });
    }

    // Reintegrar stock
    for (const prod of productos) {
      const idProducto = prod.id_producto;
      const cantidad = prod.cantidad;

      if (!idProducto || typeof cantidad !== 'number') continue;

      await pool.query(
        'UPDATE producto SET stock = stock + ? WHERE id_producto = ?',
        [cantidad, idProducto]
      );
    }

    // Cambiar estado a cancelado y mover a papelera
    await pool.query(
      'UPDATE pedidos SET estado = ?, en_papelera = 1, fecha_eliminado = NOW() WHERE id_factura = ?',
      ['cancelado', id_factura]
    );

    res.json({ message: 'Pedido cancelado, productos reingresados al stock y movido a papelera' });

  } catch (error) {
    console.error('Error al cancelar pedido:', error);
    res.status(500).json({ error: 'Error al cancelar el pedido' });
  }
};

// Actualizar estado del pedido
exports.actualizarEstadoPedido = async (req, res) => {
  const { id_factura } = req.params;
  const { nuevo_estado } = req.body;

  const estadosPermitidos = ['en proceso', 'en camino', 'entregado'];

  if (!estadosPermitidos.includes(nuevo_estado)) {
    return res.status(400).json({ error: 'Estado no permitido' });
  }

  try {
    // Verificar existencia, estado actual y si está en papelera
    const [rows] = await pool.query(
      'SELECT estado, en_papelera FROM pedidos WHERE id_factura = ?',
      [id_factura]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    const pedido = rows[0];

    if (pedido.estado === 'cancelado' || pedido.en_papelera === 1) {
      return res.status(400).json({ error: 'No se puede cambiar el estado de un pedido cancelado, entregado o en papelera' });
    }

    // Si el nuevo estado es entregado, mover a papelera
    if (nuevo_estado === 'entregado') {
      await pool.query(
        'UPDATE pedidos SET estado = ?, en_papelera = 1, fecha_eliminado = NOW() WHERE id_factura = ?',
        [nuevo_estado, id_factura]
      );
    } else {
      // Solo actualizar estado
      await pool.query(
        'UPDATE pedidos SET estado = ? WHERE id_factura = ?',
        [nuevo_estado, id_factura]
      );
    }

    res.json({ message: 'Estado actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar estado del pedido:', error);
    res.status(500).json({ error: 'Error del servidor al actualizar el estado' });
  }
};

// Vaciar papelera: eliminar pedidos en papelera con más de 7 días
exports.vaciarPapelera = async (req, res) => {
  try {
    const [result] = await pool.query(
      "DELETE FROM pedidos WHERE en_papelera = 1 AND fecha_eliminado <= DATE_SUB(NOW(), INTERVAL 7 DAY)"
    );
    res.json({ message: "Pedidos en papelera eliminados definitivamente", deleted: result.affectedRows });
  } catch (error) {
    res.status(500).json({ error: "Error al vaciar la papelera" });
  }
};

// Restaurar pedido desde la papelera
exports.restaurarPedido = async (req, res) => {
  const { id_factura } = req.params;
  try {
    await pool.query(
      "UPDATE pedidos SET en_papelera = 0, fecha_eliminado = NULL, estado = 'pendiente' WHERE id_factura = ?",
      [id_factura]
    );
    res.json({ message: "Pedido restaurado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al restaurar el pedido" });
  }
};
