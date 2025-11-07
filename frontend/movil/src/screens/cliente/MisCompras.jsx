import React, { useEffect, useState, useCallback } from 'react';
import { RefreshControl, ScrollView } from 'react-native';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../../config/api';
import styles from '../../css/MisCompras';
import cardStyles from '../../css/MisComprasCard';
import Header from '../../Components/Header';
import PerfilDropdown from '../../Components/PerfilDropdown';
import { TouchableWithoutFeedback } from 'react-native';
import ModalFeedback from '../../Components/ModalFeedback';

export default function MisCompras({ navigation }) {
  const [compras, setCompras] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [menuPerfilVisible, setMenuPerfilVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [compraSeleccionada, setCompraSeleccionada] = useState(null);
  const [modalConfirmarCancelar, setModalConfirmarCancelar] = useState(false);
  const [idPedidoCancelar, setIdPedidoCancelar] = useState(null);
  const [pagina, setPagina] = useState(1);
  const [busqueda, setBusqueda] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const comprasPorPagina = 10;
  const totalPaginas = Math.ceil(compras.length / comprasPorPagina);

  const handleCartPress = () => navigation && navigation.navigate('Carrito');
  const handleSearch = (searchText) => navigation && navigation.navigate('VistaProductos', { search: searchText });
  const handleLoginPress = () => setMenuPerfilVisible(true);
  const handleMisCompras = () => { setMenuPerfilVisible(false); };
  const handleMisDatos = () => { setMenuPerfilVisible(false); navigation && navigation.navigate('MisDatos'); };
  const handleLogout = async () => { setMenuPerfilVisible(false); await AsyncStorage.removeItem('usuario'); navigation && navigation.navigate('Index'); };

  const cargarCompras = useCallback(async () => {
    setRefreshing(true);
    const userStr = await AsyncStorage.getItem('usuario');
    if (!userStr) {
      setRefreshing(false);
      return;
    }
    const user = JSON.parse(userStr);
    setUsuario(user);
    const res = await API.get(`/pedidos/usuario/${user.id_usuario}`);
    setCompras(res.data || []);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    cargarCompras();
  }, [cargarCompras]);

  const handleCancelar = (id_factura) => {
    setIdPedidoCancelar(id_factura);
    setModalConfirmarCancelar(true);
  };

  const confirmarCancelarPedido = async () => {
    if (!idPedidoCancelar) return;
    try {
      await API.put(`/pedidos/cancelar/${idPedidoCancelar}`);
      if (usuario) {
        const res = await API.get(`/pedidos/usuario/${usuario.id_usuario}`);
        setCompras(res.data || []);
      }
    } catch (error) {
      console.error('Error al cancelar pedido:', error);
    }
    setModalConfirmarCancelar(false);
    setIdPedidoCancelar(null);
    setModalVisible(false);
    setCompraSeleccionada(null);
  };

  const comprasOrdenadas = compras.slice().reverse();
  const comprasPaginadas = comprasOrdenadas.slice((pagina - 1) * comprasPorPagina, pagina * comprasPorPagina);

  const comprasFiltradas = compras.filter(compra => {
    const texto = busqueda.toLowerCase();
    return (
      compra.nombre_cliente?.toLowerCase().includes(texto) ||
      compra.direccion?.toLowerCase().includes(texto) ||
      compra.estado?.toLowerCase().includes(texto) ||
      compra.productos?.toLowerCase?.().includes(texto)
    );
  });

  return (
    <View style={styles.container}>
      <Header
        onCartPress={handleCartPress}
        onSearch={setBusqueda}
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
      {comprasFiltradas.length === 0 ? (
        <Text style={{ color: '#888', marginTop: 30, textAlign: 'center' }}>No tienes compras registradas.</Text>
      ) : (
        <>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 10, marginTop: 8 }}>
            <TouchableOpacity
              onPress={() => setPagina(p => Math.max(1, p - 1))}
              disabled={pagina === 1}
              style={{ marginHorizontal: 10, opacity: pagina === 1 ? 0.5 : 1 }}
            >
              <Text style={{ color: '#1976d2', fontWeight: 'bold', fontSize: 16 }}>Anterior</Text>
            </TouchableOpacity>
            <Text style={{ color: '#23272f', fontWeight: 'bold', fontSize: 16 }}>
              Página {pagina} de {totalPaginas}
            </Text>
            <TouchableOpacity
              onPress={() => setPagina(p => Math.min(totalPaginas, p + 1))}
              disabled={pagina === totalPaginas}
              style={{ marginHorizontal: 10, opacity: pagina === totalPaginas ? 0.5 : 1 }}
            >
              <Text style={{ color: '#1976d2', fontWeight: 'bold', fontSize: 16 }}>Siguiente</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            style={{ marginBottom: 10 }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={cargarCompras} />
            }
          >
            {comprasPaginadas.map((compra, idx, arr) => {
              let compraConProductos = { ...compra };
              if (typeof compraConProductos.productos === 'string') {
                try {
                  compraConProductos.productos = JSON.parse(compraConProductos.productos);
                } catch (e) {
                  compraConProductos.productos = [];
                }
              }
              return (
                <TouchableOpacity
                  key={compra.id_factura}
                  style={cardStyles.card}
                  onPress={() => {
                    setCompraSeleccionada(compraConProductos);
                    setModalVisible(true);
                  }}
                  activeOpacity={0.85}
                >
                  <View style={cardStyles.cardHeader}>
                    <Text style={cardStyles.cardTitle}>
                      Pedido # {compra.id_factura}
                    </Text>
                    <Text style={[cardStyles.cardEstado, compra.estado === 'pendiente' && { backgroundColor: '#FFD600', color: '#23272f', fontWeight: 'bold', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 2, overflow: 'hidden' }]}>
                      {compra.estado}
                    </Text>
                  </View>
                  {(() => {
                    let productos = compraConProductos.productos;
                    let totalOriginal = 0;
                    let totalDescuento = 0;
                    if (Array.isArray(productos)) {
                      productos.forEach(prod => {
                        const precioOriginal = Number(prod.precio_original ?? prod.precio) || 0;
                        const precioFinal = Number(prod.precio_final ?? prod.precio) || 0;
                        const cantidad = Number(prod.cantidad) || 0;
                        totalOriginal += precioOriginal * cantidad;
                        totalDescuento += precioFinal * cantidad;
                      });
                    }
                    if (totalDescuento < totalOriginal) {
                      return (
                        <Text style={{ color: '#444', marginBottom: 4 }}>
                          Total: <Text style={{ color: '#888', textDecorationLine: 'line-through', fontWeight: 'normal' }}>{`$${totalOriginal.toLocaleString('es-CO')}`}</Text> <Text style={{ color: '#d32f2f', fontWeight: 'bold' }}>{`$${totalDescuento.toLocaleString('es-CO')}`}</Text>
                        </Text>
                      );
                    } else {
                      return (
                        <Text style={{ color: '#444', marginBottom: 4 }}>
                          Total: <Text style={{ fontWeight: 'bold' }}>{`$${totalOriginal.toLocaleString('es-CO')}`}</Text>
                        </Text>
                      );
                    }
                  })()}
                  <Text style={{ color: '#888', fontSize: 13 }}>Dirección: {compra.direccion}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </>
      )}

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.18)', justifyContent: 'center', alignItems: 'center' }}>
            <TouchableWithoutFeedback onPress={() => { }}>
              <View style={{ backgroundColor: '#f5f6fa', borderRadius: 14, padding: 18, minWidth: 320, maxWidth: 470, width: '95%' }}>
                <Text style={{ fontWeight: 'bold', fontSize: 26, marginBottom: 18, color: '#23272f', textAlign: 'center' }}>Detalle Pedido</Text>
                {compraSeleccionada && (
                  <View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 12 }}>
                      <Text style={{ fontWeight: 'bold', color: '#23272f' }}>Estado:</Text>
                      <View style={{
                        backgroundColor: compraSeleccionada.estado === 'pendiente' ? '#FFD600' : '#e0e0e0',
                        borderRadius: 6,
                        paddingHorizontal: 12,
                        paddingVertical: 4,
                        alignSelf: 'flex-start',
                        minWidth: 80
                      }}>
                        <Text style={{
                          color: '#23272f',
                          fontWeight: 'bold',
                          textAlign: 'center',
                          textTransform: 'lowercase'
                        }}>
                          {compraSeleccionada.estado}
                        </Text>
                      </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 18 }}>
                      <View>
                        <Text style={{ color: '#888', fontWeight: 'bold', fontSize: 15 }}>CLIENTE</Text>
                        <Text style={{ color: '#23272f', fontSize: 16 }}>{compraSeleccionada.nombre_cliente || '---'}</Text>
                      </View>
                      <View>
                        <Text style={{ color: '#888', fontWeight: 'bold', fontSize: 15 }}>DIRECCIÓN</Text>
                        <Text style={{ color: '#23272f', fontSize: 16 }}>{compraSeleccionada.direccion || '---'}</Text>
                      </View>
                      <View>
                        <Text style={{ color: '#888', fontWeight: 'bold', fontSize: 15 }}>FECHA</Text>
                        <Text style={{ color: '#23272f', fontSize: 16 }}>
                          {compraSeleccionada.fecha_pedido
                            ? new Date(compraSeleccionada.fecha_pedido).toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' })
                            : '---'}
                        </Text>
                      </View>
                    </View>
                    <View style={{ backgroundColor: '#fff', borderRadius: 10, paddingVertical: 8, marginBottom: 18, borderWidth: 1, borderColor: '#e0e0e0' }}>
                      <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: '#e0e0e0', paddingVertical: 6, backgroundColor: '#f5f6fa' }}>
                        <Text style={{ flex: 2, fontWeight: 'bold', color: '#23272f', fontSize: 16, textAlign: 'left', paddingLeft: 10 }}>Producto</Text>
                        <Text style={{ flex: 1, fontWeight: 'bold', color: '#23272f', fontSize: 16, textAlign: 'center' }}>Cantidad</Text>
                        <Text style={{ flex: 1, fontWeight: 'bold', color: '#23272f', fontSize: 16, textAlign: 'center' }}>Precio</Text>
                        <Text style={{ flex: 1.2, fontWeight: 'bold', color: '#23272f', fontSize: 16, textAlign: 'center' }}>Subtotal</Text>
                      </View>
                      {Array.isArray(compraSeleccionada.productos) && compraSeleccionada.productos.length > 0 ? (
                        compraSeleccionada.productos.map((prod, idx) => {
                          const precioOriginal = Number(prod.precio_original ?? prod.precio) || 0;
                          const precioFinal = Number(prod.precio_final ?? prod.precio) || 0;
                          const cantidad = Number(prod.cantidad) || 0;
                          const subtotal = precioFinal * cantidad;
                          return (
                            <View key={(prod.id_producto || prod._id || prod.nombre || 'prod') + '-' + idx} style={{ flexDirection: 'row', paddingVertical: 7, borderBottomWidth: idx === compraSeleccionada.productos.length - 1 ? 0 : 1, borderColor: '#f0f0f0', backgroundColor: '#fff' }}>
                              <Text style={{ flex: 2, color: '#23272f', fontSize: 15, textAlign: 'left', paddingLeft: 10 }}>{prod.nombre}</Text>
                              <Text style={{ flex: 1, color: '#23272f', fontSize: 15, textAlign: 'center' }}>{cantidad.toLocaleString('es-CO')}</Text>
                              <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                {(precioFinal < precioOriginal) ? (
                                  <>
                                    <Text style={{ color: '#888', fontSize: 13, textDecorationLine: 'line-through', marginBottom: 2 }}>{`$${precioOriginal.toLocaleString('es-CO')}`}</Text>
                                    <Text style={{ color: '#d32f2f', fontWeight: 'bold', fontSize: 16 }}>{`$${precioFinal.toLocaleString('es-CO')}`}</Text>
                                  </>
                                ) : (
                                  <Text style={{ color: '#23272f', fontSize: 15 }}>{`$${precioOriginal.toLocaleString('es-CO')}`}</Text>
                                )}
                              </View>
                              <Text style={{ flex: 1.2, color: '#23272f', fontSize: 15, textAlign: 'center' }}>{`$${subtotal.toLocaleString('es-CO')}`}</Text>
                            </View>
                          );
                        })
                      ) : (
                        <View style={{ padding: 12 }}>
                          <Text style={{ color: '#23272f', textAlign: 'center' }}>Sin productos</Text>
                        </View>
                      )}
                    </View>
                    <View style={{ marginTop: 18 }}>
                      <Text style={{ color: '#000000FF', fontWeight: 'bold', fontSize: 20, marginBottom: 8, textAlign: 'left' }}>
                        Total: {compraSeleccionada.total ? `$${compraSeleccionada.total.toLocaleString('es-CO')}` : ''}
                      </Text>
                      {compraSeleccionada.estado === 'pendiente' && (
                        <TouchableOpacity
                          style={{
                            backgroundColor: '#A43838FF',
                            borderRadius: 6,
                            paddingHorizontal: 18,
                            paddingVertical: 8,
                            alignSelf: 'flex-start',
                            marginBottom: 12
                          }}
                          onPress={() => handleCancelar(compraSeleccionada.id_factura)}
                        >
                          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 20 }}>Cancelar</Text>
                        </TouchableOpacity>
                      )}

                    </View>
                  </View>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <ModalFeedback
        visible={modalConfirmarCancelar}
        onClose={() => setModalConfirmarCancelar(false)}
        titulo="¿Cancelar pedido?"
        mensaje="¿Estás seguro de que deseas cancelar este pedido? Esta acción no se puede deshacer."
        icono="error-outline"
        colorTitulo="#000000FF"
        textoBoton="No"
        onBoton={() => setModalConfirmarCancelar(false)}
        textoBotonSecundario="Sí, cancelar"
        onBotonSecundario={confirmarCancelarPedido}
      />

      {usuario?.id_rol === 1 && (
        <ModalFeedback
          visible={true}
          onClose={() => navigation && navigation.goBack()}
          titulo="Acceso restringido"
          mensaje="Solo los usuarios pueden hacer y ver pedidos. El administrador no puede realizar compras."
          icono="error-outline"
          colorTitulo="#000000FF"
          textoBoton="Volver"
          onBoton={() => navigation && navigation.goBack()}
        />
      )}
    </View>
  );
}