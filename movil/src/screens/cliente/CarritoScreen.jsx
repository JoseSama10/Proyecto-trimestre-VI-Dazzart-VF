import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import ModalFeedback from '../../components/ModalFeedback';
import API from '../../config/api';
import { FontAwesome } from '@expo/vector-icons';

const CarritoScreen = ({ navigation, route }) => {
  const { productos = [], onRemove, onCheckout } = route.params || {};
  const [modalEliminarVisible, setModalEliminarVisible] = useState(false);
  const [productoAEliminar, setProductoAEliminar] = useState(null);
  const [productosState, setProductosState] = useState(productos);

  // SINCRONIZAR LOGICA DE PRODUCTOS
  useEffect(() => {
    setProductosState(productos);
  }, [productos]);
  const subtotal = productosState.reduce((sum, p) => sum + (p.precio_final || p.precio || 0) * (p.cantidad || 1), 0);
  const envio = subtotal > 0 ? 0 : 0; 
  const pago = 'Pago ContraEntrega';
  const total = subtotal + envio;


  // HANDLER PARA MOSTRAR MODAL DE CONFIRMACION DE ELIMINACION
  function handleRemovePress(producto) {
    setProductoAEliminar(producto);
    setModalEliminarVisible(true);
  }

  // CONFIRMAR ELIMINACION
  function confirmarEliminarProducto() {
    if (productoAEliminar) {
      const getId = (p) => p._id || p.id || p.id_producto;
      const idProd = getId(productoAEliminar);
      setProductosState((prev) => prev.filter((p) => getId(p) !== idProd));
      if (onRemove) onRemove(productoAEliminar);
    }
    setModalEliminarVisible(false);
    setProductoAEliminar(null);
  }

  // CANCELAR ELIMINACION
  function onCancelarEliminarProducto() {
    setModalEliminarVisible(false);
    setProductoAEliminar(null);
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={{ flexGrow: 1 }}>
      <Text style={styles.title}>Tu Carrito de Compras</Text>
      {productos.length === 0 ? (
        <View style={{ alignItems: 'center', marginVertical: 30 }}>
          <FontAwesome name="shopping-cart" size={60} color="#aaa" />
          <Text style={{ color: '#888', marginTop: 10 }}>Tu carrito está vacío</Text>
        </View>
      ) : (
        <View style={styles.cartContent}>
          <FlatList
            data={productosState}
            keyExtractor={item => item._id?.toString() || item.id?.toString() || Math.random().toString()}
            renderItem={({ item }) => (
              <View style={styles.itemRow}>
                {(() => {
                  let imgUrl = item?.imagen;
                  if (imgUrl && (imgUrl.startsWith('/img/') || imgUrl.startsWith('img/'))) {
                    imgUrl = imgUrl.replace(/^\/?.*img\//, '');
                  }
                  if (imgUrl && !imgUrl.startsWith('http')) {
                    imgUrl = `${API.defaults.baseURL.replace(/\/api$/, '')}/productos/img/${imgUrl}`;
                  }
                  return imgUrl ? (
                    <Image source={{ uri: imgUrl }} style={styles.itemImage} />
                  ) : (
                    <View style={styles.noImage}><FontAwesome name="image" size={48} color="#aaa" /></View>
                  );
                })()}
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.nombre}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                    {item.descuento_aplicado ? (
                      <Text style={styles.precioTachado}>${item.precio}</Text>
                    ) : null}
                    <Text style={styles.precioDescuento}>{` $${item.precio_final || item.precio}`}</Text>
                  </View>
                  <Text style={styles.cantidad}>Cantidad: {item.cantidad || 1}</Text>
                </View>
                <TouchableOpacity onPress={() => handleRemovePress(item)} style={styles.trashBtn}>
                  <FontAwesome name="trash" size={32} color="#d32f2f" />
                </TouchableOpacity>
              </View>
            )}
            style={{ marginBottom: 10 }}
          />
          <ModalFeedback
            visible={modalEliminarVisible}
            icono="check"
            titulo="¿Eliminar producto?"
            mensaje={productoAEliminar ? `¿Seguro que deseas eliminar "${productoAEliminar.nombre}" del carrito?` : ''}
            colorFondo="#fff"
            colorTitulo="#222"
            colorMensaje="#444"
            textoBoton="Cancelar"
            outlineBoton={true}
            onBoton={onCancelarEliminarProducto}
            textoBotonSecundario="Eliminar"
            onBotonSecundario={confirmarEliminarProducto}
            showClose={true}
            onClose={onCancelarEliminarProducto}
          />
          <View style={styles.resumenPago}>
            <Text style={styles.resumenTitle}>Información de Pago</Text>
            <View style={styles.resumenRow}>
              <Text style={styles.resumenLabel}>SubTotal:</Text>
              <Text style={styles.resumenValor}>${subtotal.toLocaleString('es-CO')}</Text>
            </View>
            <View style={styles.resumenRow}>
              <Text style={styles.resumenLabel}>Envío:</Text>
              <Text style={styles.resumenValor}>Envío Gratuito a Distrito Capital</Text>
            </View>
            <View style={styles.resumenRow}>
              <Text style={styles.resumenLabel}>Pago:</Text>
              <Text style={styles.resumenValor}>{pago}</Text>
            </View>
            <View style={styles.resumenRowTotal}>
              <Text style={styles.resumenLabelTotal}>Total:</Text>
              <Text style={styles.resumenValorTotal}>${total.toLocaleString('es-CO')}</Text>
            </View>
            <TouchableOpacity style={styles.btnPedido} onPress={onCheckout} disabled={productos.length === 0}>
              <Text style={styles.btnPedidoText}>Realizar Un Pedido</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnVolver} onPress={() => navigation.goBack()}>
              <Text style={styles.btnVolverText}>Volver</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 18,
    color: '#222',
    textAlign: 'center',
    marginTop: 18,
  },
  cartContent: {
    flex: 1,
    paddingHorizontal: 8,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#eee',
  },
  noImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 2,
  },
  precioTachado: {
    fontSize: 16,
    color: '#888',
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  precioDescuento: {
    fontSize: 18,
    color: '#228B22',
    fontWeight: 'bold',
  },
  cantidad: {
    fontSize: 16,
    color: '#333',
    marginTop: 2,
  },
  trashBtn: {
    marginLeft: 12,
    padding: 6,
  },
  resumenPago: {
    backgroundColor: '#f5f7fa',
    borderRadius: 14,
    padding: 18,
    marginTop: 18,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  resumenTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#222',
    textAlign: 'left',
  },
  resumenRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  resumenLabel: {
    fontSize: 16,
    color: '#444',
  },
  resumenValor: {
    fontSize: 16,
    color: '#1976d2',
    fontWeight: 'bold',
    textAlign: 'right',
    flexShrink: 1,
  },
  resumenRowTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 12,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 8,
  },
  resumenLabelTotal: {
    fontSize: 18,
    color: '#222',
    fontWeight: 'bold',
  },
  resumenValorTotal: {
    fontSize: 18,
    color: '#0084ff',
    fontWeight: 'bold',
    textAlign: 'right',
  },
  btnPedido: {
    backgroundColor: '#218838',
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 10,
    marginBottom: 6,
  },
  btnPedidoText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
    textAlign: 'center',
  },
  btnVolver: {
    backgroundColor: '#757575',
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 0,
  },
  btnVolverText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
    textAlign: 'center',
  },
});

export default CarritoScreen;
