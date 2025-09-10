import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../../config/api';
import styles from '../../css/MisCompras';
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
        <View style={styles.table}>
          {/* ENCABEZADO */}
          <View style={styles.row}>
            <Text style={[styles.cell, styles.cellHeader]}>ID Pedido</Text>
            <Text style={[styles.cell, styles.cellHeader]}>Dirección</Text>
            <Text style={[styles.cell, styles.cellHeader]}>Productos</Text>
            <Text style={[styles.cell, styles.cellHeader]}>Total</Text>
            <Text style={[styles.cell, styles.cellHeader]}>Estado</Text>
            <Text style={[styles.cell, styles.cellHeader]}>Acción</Text>
          </View>
          {/* FILAS DE COMPRA*/}
          {compras.map((compra) => (
            <View style={styles.row} key={compra.id_pedido}>
              <Text style={styles.cell}>{compra.id_pedido}</Text>
              <Text style={styles.cell}>{compra.direccion}</Text>
              <View style={[styles.cell, { flex: 2 }]}> {/* Productos en columna */}
                {Array.isArray(compra.productos) && compra.productos.length > 0 ? (
                  compra.productos.map((prod, idx) => (
                    <Text key={idx} style={styles.productosList}>{prod.nombre} (x{prod.cantidad})</Text>
                  ))
                ) : (
                  <Text style={styles.productosList}>Sin productos</Text>
                )}
              </View>
              <Text style={styles.cell}>{compra.total ? `$${compra.total.toLocaleString('es-CO')}` : ''}</Text>
              <Text style={styles.cellEstado}>{compra.estado}</Text>
              <TouchableOpacity
                style={styles.cellAccion}
                onPress={() => handleCancelar(compra.id_pedido)}
                disabled={compra.estado !== 'pendiente'}
              >
                <Text style={styles.cellAccionText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
