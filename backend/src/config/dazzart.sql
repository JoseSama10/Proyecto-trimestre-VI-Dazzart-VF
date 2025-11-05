DROP DATABASE IF EXISTS DAZZART;
CREATE DATABASE DAZZART;
USE DAZZART;

-- 2. Eliminar tablas existentes (en orden correcto)
DROP TABLE IF EXISTS descuento_producto;
DROP TABLE IF EXISTS descuento_categoria;
DROP TABLE IF EXISTS detalles_factura;
DROP TABLE IF EXISTS carrito;
DROP TABLE IF EXISTS pedidos;
DROP TABLE IF EXISTS factura;
DROP TABLE IF EXISTS producto;
DROP TABLE IF EXISTS subcategoria;
DROP TABLE IF EXISTS categoria;
DROP TABLE IF EXISTS descuento;
DROP TABLE IF EXISTS usuario;
DROP TABLE IF EXISTS roles;


-- Tabla de roles
CREATE TABLE roles (
  id_rol INT AUTO_INCREMENT PRIMARY KEY,
  nombre_rol VARCHAR(50) NOT NULL
);

-- Tabla de usuarios (con campo estado)
CREATE TABLE usuario (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  nombre_usuario VARCHAR(255) NOT NULL,
  correo_electronico VARCHAR(255) NOT NULL,
  telefono VARCHAR(255) NOT NULL,
  contrasena VARCHAR(255) NOT NULL,
  cedula VARCHAR(255) NOT NULL,
  direccion VARCHAR(255) NOT NULL,
  estado ENUM('Activo','Inactivo') NOT NULL DEFAULT 'Activo', 
  id_rol INT NOT NULL,
  FOREIGN KEY (id_rol) REFERENCES roles(id_rol)
);

-- Tabla de categorías
CREATE TABLE categoria (
  id_categoria INT AUTO_INCREMENT PRIMARY KEY,
  nombre_categoria VARCHAR(255) NOT NULL,
  descripcion_categoria VARCHAR(255) NOT NULL
);

-- Tabla de subcategorías
CREATE TABLE subcategoria (
  id_subcategoria INT AUTO_INCREMENT PRIMARY KEY,
  nombre_subcategoria VARCHAR(255),
  descripcion_subcategoria VARCHAR(255) NOT NULL,
  id_categoria INT NOT NULL,
  FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria)
);

-- Tabla de productos
CREATE TABLE producto (
  id_producto INT AUTO_INCREMENT PRIMARY KEY,
  numero_serial VARCHAR(30),
  imagen VARCHAR(255),
  nombre VARCHAR(100) NOT NULL,
  descripcion VARCHAR(250) NOT NULL,
  precio DECIMAL(10,2) NOT NULL,
  stock INT NOT NULL,
  id_categoria INT NOT NULL,
  id_subcategoria INT,
  fecha_creacion DATE NOT NULL,
  FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria),
  FOREIGN KEY (id_subcategoria) REFERENCES subcategoria(id_subcategoria)
);

-- Tabla de carrito
CREATE TABLE carrito (
  id_carrito INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT NOT NULL,
  id_producto INT NOT NULL,
  cantidad INT NOT NULL,
  fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
  FOREIGN KEY (id_producto) REFERENCES producto(id_producto)
);

-- Tabla de pedidos 
CREATE TABLE pedidos (
  id_factura INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT NOT NULL,
  direccion VARCHAR(255) NOT NULL,
  productos TEXT NOT NULL,
  total_productos INT NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  estado VARCHAR(50) NOT NULL,
  fecha_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  en_papelera TINYINT(1) DEFAULT 0,
  fecha_eliminado DATETIME DEFAULT NULL,
  FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);

-- Tabla de facturas (pagadas)
CREATE TABLE factura (
  id_factura INT AUTO_INCREMENT PRIMARY KEY,
  metodo_pago VARCHAR(255) NOT NULL,
  fecha_factura DATE NOT NULL,
  estado ENUM('pagada', 'pendiente', 'cancelada') NOT NULL,
  id_usuario INT,
  FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);

-- Detalles de factura
CREATE TABLE detalles_factura (
  id_detalle_factura INT AUTO_INCREMENT PRIMARY KEY,
  cantidad INT NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  id_factura INT NOT NULL,
  id_producto INT NOT NULL,
  FOREIGN KEY (id_factura) REFERENCES factura(id_factura) ON DELETE CASCADE,
  FOREIGN KEY (id_producto) REFERENCES producto(id_producto) ON DELETE CASCADE
);

-- Tabla de descuentos
CREATE TABLE descuento (
  id_descuento INT AUTO_INCREMENT PRIMARY KEY,
  tipo_descuento ENUM('Porcentaje', 'Fijo') NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE NOT NULL,
  estado_descuento ENUM('Activo', 'Inactivo') NOT NULL,
  aplicacion ENUM('producto', 'categoria') NOT NULL
);

-- Relación descuento-producto
CREATE TABLE descuento_producto (
  id_descuento INT NOT NULL,
  id_producto INT NOT NULL,
  PRIMARY KEY (id_descuento, id_producto),
  FOREIGN KEY (id_descuento) REFERENCES descuento(id_descuento) ON DELETE CASCADE,
  FOREIGN KEY (id_producto) REFERENCES producto(id_producto) ON DELETE CASCADE
);

-- Relación descuento-categoría
CREATE TABLE descuento_categoria (
  id_descuento INT NOT NULL,
  id_categoria INT NOT NULL,
  PRIMARY KEY (id_descuento, id_categoria),
  FOREIGN KEY (id_descuento) REFERENCES descuento(id_descuento) ON DELETE CASCADE,
  FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria) ON DELETE CASCADE
);