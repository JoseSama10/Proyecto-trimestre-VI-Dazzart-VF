import React from 'react';
import { Modal, View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import styles from '../css/DetalleProducto';
import API from '../config/api';

const ModalDetalleProducto = ({ visible, producto, onClose, onAgregarCarrito }) => {
  if (!visible || !producto) return null;
  const maxCantidad = producto.stock || 10;
  const [cantidad, setCantidad] = React.useState(1);

  // CONTRUIR URL DE LA IMAGEN IGUAL QUE EN ProductosList
  let imgUrl = producto?.urlImagen || producto?.imagen;
  if (imgUrl && (imgUrl.startsWith('/img/') || imgUrl.startsWith('img/'))) {
    imgUrl = imgUrl.replace(/^\/?img\//, '');
    imgUrl = `${API.defaults.baseURL.replace(/\/api$/, '')}/productos/img/${imgUrl}`;
  }

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <TouchableOpacity
        activeOpacity={1}
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.18)', justifyContent: 'center', alignItems: 'center' }}
        onPress={onClose}
      >
        <View style={{ width: 340, borderRadius: 18, backgroundColor: '#fff', padding: 18, alignItems: 'center', elevation: 8 }}>
          {/* CERRAR */}
          <TouchableOpacity onPress={onClose} style={{ position: 'absolute', top: 12, right: 12, zIndex: 2 }}>
            <FontAwesome name="close" size={28} color="#444" />
          </TouchableOpacity>
          {/* IMAGEN DENTRO DE LA CARD */}
          <View style={{ alignItems: 'center', marginBottom: 12, width: '100%' }}>
            <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 8, alignItems: 'center', width: '100%' }}>
              {imgUrl ? (
                <Image
                  source={{ uri: imgUrl }}
                  style={{ width: 180, height: 180, resizeMode: 'contain', borderRadius: 12 }}
                />
              ) : (
                <FontAwesome name="image" size={60} color="#aaa" />
              )}
            </View>
          </View>
          {/* INFO */}
          <ScrollView style={{ width: '100%' }}>
            <Text style={{ color: '#1976d2', fontWeight: 'bold', marginBottom: 4 }}>Inicio</Text>
            <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 6 }}>{producto.nombre}</Text>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 2 }}>${producto.precio}</Text>
            <Text style={{ color: '#888', marginBottom: 8 }}>{producto.stock} disponibles</Text>
            <View style={{ borderBottomWidth: 1, borderColor: '#eee', marginVertical: 8 }} />
            <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>Cantidad</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12, justifyContent: 'center' }}>
              <TouchableOpacity onPress={() => setCantidad(Math.max(1, cantidad - 1))} style={{ padding: 8 }}>
                <Text style={{ fontSize: 22, fontWeight: 'bold' }}>-</Text>
              </TouchableOpacity>
              <Text style={{ fontSize: 18, marginHorizontal: 12 }}>{cantidad}</Text>
              <TouchableOpacity onPress={() => setCantidad(Math.min(maxCantidad, cantidad + 1))} style={{ padding: 8 }}>
                <Text style={{ fontSize: 22, fontWeight: 'bold' }}>+</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={{ backgroundColor: '#111', borderRadius: 8, padding: 12, alignItems: 'center', marginBottom: 8 }} onPress={() => onAgregarCarrito(producto, cantidad)}>
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>+ Añadir al Carrito</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default ModalDetalleProducto;
