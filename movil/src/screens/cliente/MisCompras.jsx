import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../../config/api';
import styles from '../../css/MisCompras';
import cardStyles from '../../css/MisComprasCard';
import Header from '../../Components/Header';
import PerfilDropdown from '../../Components/PerfilDropdown';
import { TouchableWithoutFeedback } from 'react-native';

export default function MisCompras({ navigation }) {
  const [compras, setCompras] = useState([]);
  const [usuario, setUsuario] = useState(null);
  // Handlers para header y menú usuario
  const [menuPerfilVisible, setMenuPerfilVisible] = useState(false);
  const handleCartPress = () => navigation && navigation.navigate('Carrito');
  const handleSearch = (searchText) => navigation && navigation.navigate('VistaProductos', { search: searchText });
  const handleLoginPress = () => setMenuPerfilVisible(true);
  const handleMisCompras = () => { setMenuPerfilVisible(false); };
  const handleMisDatos = () => { setMenuPerfilVisible(false); navigation && navigation.navigate('MisDatos'); };
  const handleLogout = async () => { setMenuPerfilVisible(false); await AsyncStorage.removeItem('usuario'); navigation && navigation.navigate('Index'); };

  useEffect(() => {
    (async () => {
      const userStr = await AsyncStorage.getItem('usuario');
      if (!userStr) return;
      const user = JSON.parse(userStr);
      setUsuario(user);
      // OBTENER COMPRAS DEL USUARIO
      const res = await API.get(`/pedidos/usuario/${user.id_usuario}`);
      setCompras(res.data || []);
    })();
  }, []);

  const [modalVisible, setModalVisible] = useState(false);
  const [compraSeleccionada, setCompraSeleccionada] = useState(null);

  const handleCancelar = async (id_pedido) => {
    // Falta poner la logica para cancelar el pedido
  };


  return (
    <View style={styles.container}>
      <Header
        onCartPress={handleCartPress}
        onSearch={handleSearch}
        onLoginPress={handleLoginPress}
        usuario={usuario}
      />
      {menuPerfilVisible && (
        <TouchableWithoutFeedback onPress={() => setMenuPerfilVisible(false)}>
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 200 }}>
            <PerfilDropdown
              visible={true}
              usuario={usuario}
              onLogout={handleLogout}
              onMisCompras={handleMisCompras}
              onMisDatos={handleMisDatos}
            />
          </View>
        </TouchableWithoutFeedback>
      )}
      <Text style={styles.title}>Mis compras</Text>
      {compras.length === 0 ? (
        <Text style={{ color: '#888', marginTop: 30, textAlign: 'center' }}>No tienes compras registradas.</Text>
      ) : (
        <ScrollView style={{ marginBottom: 10 }}>
          {compras.map((compra) => (
            <TouchableOpacity
              key={compra.id_pedido}
              style={cardStyles.card}
              onPress={() => { setCompraSeleccionada(compra); setModalVisible(true); }}
              activeOpacity={0.85}
            >
              <View style={cardStyles.cardHeader}>
                <Text style={cardStyles.cardTitle}>IDPedido: {compra.id_pedido}</Text>
                <Text style={cardStyles.cardEstado}>{compra.estado}</Text>
              </View>
              <Text style={{ color: '#444', marginBottom: 4 }}>Total: <Text style={{ fontWeight: 'bold' }}>{compra.total ? `$${compra.total.toLocaleString('es-CO')}` : ''}</Text></Text>
              <Text style={{ color: '#888', fontSize: 13 }}>Dirección: {compra.direccion}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Modal con la tabla de detalle */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.18)', justifyContent: 'center', alignItems: 'center' }}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={{ backgroundColor: '#f5f6fa', borderRadius: 14, padding: 18, minWidth: 320, maxWidth: 380, width: '90%' }}>
                <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10, color: '#23272f', textAlign: 'center' }}>Detalle de pedido</Text>
                {compraSeleccionada && (
                  <View>
                    <View style={styles.table}>
                      <View style={styles.row}>
                        <Text style={[styles.cell, styles.cellHeader, {color: '#23272f'}]}>Producto</Text>
                        <Text style={[styles.cell, styles.cellHeader, {color: '#23272f'}]}>Cantidad</Text>
                      </View>
                      {Array.isArray(compraSeleccionada.productos) && compraSeleccionada.productos.length > 0 ? (
                        compraSeleccionada.productos.map((prod) => (
                          <View style={styles.row} key={prod.nombre + '-' + prod.cantidad}>
                            <Text style={[styles.cell, {color: '#23272f'}]}>{prod.nombre}</Text>
                            <Text style={[styles.cell, {color: '#23272f'}]}>{prod.cantidad}</Text>
                          </View>
                        ))
                      ) : (
                        <View style={styles.row}>
                          <Text style={[styles.cell, {color: '#23272f'}]}>Sin productos</Text>
                          <Text style={[styles.cell, {color: '#23272f'}]}></Text>
                        </View>
                      )}
                    </View>
                    <Text style={{ color: '#23272f', marginTop: 8 }}>Dirección: <Text style={{ fontWeight: 'bold', color: '#23272f' }}>{compraSeleccionada.direccion}</Text></Text>
                    <Text style={{ color: '#23272f' }}>Total: <Text style={{ fontWeight: 'bold', color: '#23272f' }}>{compraSeleccionada.total ? `$${compraSeleccionada.total.toLocaleString('es-CO')}` : ''}</Text></Text>
                    <Text style={{ color: '#23272f', marginBottom: 8 }}>Estado: <Text style={{ color: '#23272f', fontWeight: 'bold' }}>{compraSeleccionada.estado}</Text></Text>
                    <TouchableOpacity
                      style={[styles.cellAccion, { alignSelf: 'center', marginTop: 10, backgroundColor: '#e1e1e1' }]}
                      onPress={() => handleCancelar(compraSeleccionada.id_pedido)}
                      disabled={compraSeleccionada.estado !== 'pendiente'}
                    >
                      <Text style={{ color: '#23272f', fontWeight: 'bold' }}>Cancelar compra</Text>
                    </TouchableOpacity>
                  </View>
                )}
                <TouchableOpacity onPress={() => setModalVisible(false)} style={{ marginTop: 18, alignSelf: 'center' }}>
                  <Text style={{ color: '#23272f', fontWeight: 'bold', fontSize: 16 }}>Cerrar</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}
