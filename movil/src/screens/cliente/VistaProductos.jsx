import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import MenuLateral from '../../Components/MenuLateral';
import { ProductoCard } from '../../Components/ProductosList';
import ModalDetalleProducto from '../../Components/ModalDetalleProducto';
import API from '../../config/api';
import styles from '../../css/VistaProductos';
import ModalFeedback from '../../Components/ModalFeedback';
import PerfilDropdown from '../../Components/PerfilDropdown';
import ModalLogin from '../../Components/ModalLogin';

export default function VistaProductos({ navigation, route }) {
  const [modalFeedbackOpen, setModalFeedbackOpen] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [productos, setProductos] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const searchParam = route?.params?.search || '';
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
      const userStr = await AsyncStorage.getItem('usuario');
      if (userStr) setUsuario(JSON.parse(userStr));
      else setUsuario(null);
    });
    return unsubscribe;
  }, [navigation]);
  const [showMenu, setShowMenu] = useState(false);
  const [soloOferta, setSoloOferta] = useState(false);
  const [orden, setOrden] = useState('popularidad');
  const [mostrarCantidad, setMostrarCantidad] = useState(24);
  const [nombreCategoria, setNombreCategoria] = useState('');
  const [modalDetalleOpen, setModalDetalleOpen] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [idCategoria, setIdCategoria] = useState(route?.params?.id_categoria || null);
  const [idSubcategoria, setIdSubcategoria] = useState(route?.params?.id_subcategoria || null);
  const [showFiltros, setShowFiltros] = useState(false);

  // FUNCION PARA AGREGAR PRODUCTOS AL CARRITO
  // MOSTAR MODAL DE DETALLE PARA AGREGAR AL CARRITO
  const [modalAgregarOpen, setModalAgregarOpen] = useState(false);
  const [productoAgregar, setProductoAgregar] = useState(null);

  const handleAgregarCarrito = producto => {
    if (!usuario) {
      setShowLogin(true);
      return;
    }
    // LOGICA AGREGAR CARRITO
    (async () => {
      try {
        await API.post('/carrito', {
          id_usuario: usuario.id_usuario,
          id_producto: producto._id || producto.id || producto.id_producto,
          cantidad: 1,
        });
        setFeedbackMsg(`Agregado al carrito: ${producto.nombre}`);
      } catch (e) {
        setFeedbackMsg('Error al agregar al carrito');
      }
      setModalFeedbackOpen(true);
    })();
  };

  const handleConfirmAgregar = (producto, cantidad) => {
    setModalAgregarOpen(false);
    setFeedbackMsg(`Agregado al carrito: ${producto.nombre} x${cantidad}`);
    setModalFeedbackOpen(true);
  };

  useEffect(() => {
    if (idCategoria) {
      API.get('/categorias/listar')
        .then(res => {
          const cat = res.data.find(c => c.id_categoria === idCategoria);
          setNombreCategoria(cat?.nombre_categoria || 'Categoría desconocida');
        })
        .catch(() => setNombreCategoria('Categoría desconocida'));
    }
  }, [idCategoria]);

  useEffect(() => {
    if (searchParam && searchParam.trim().length > 0) {
      API.get('/productos/listar')
        .then(res => {
          let filtrados = res.data.filter(
            p => p.nombre && p.nombre.toLowerCase().includes(searchParam.toLowerCase())
          );
          if (soloOferta) filtrados = filtrados.filter(p => p.oferta === true);
          if (orden === 'popularidad') {
            filtrados.sort((a, b) => (b.popularidad || 0) - (a.popularidad || 0));
          } else if (orden === 'precio_asc') {
            filtrados.sort((a, b) => a.precio - b.precio);
          } else if (orden === 'precio_desc') {
            filtrados.sort((a, b) => b.precio - a.precio);
          }
          filtrados = filtrados.slice(0, mostrarCantidad);
          setProductos(filtrados);
        })
        .catch(() => setProductos([]));
    } else if (idCategoria && idSubcategoria) {
      API.get('/productos/listar')
        .then(res => {
          let filtrados = res.data.filter(
            p => p.id_categoria === idCategoria && p.id_subcategoria === idSubcategoria
          );
          if (soloOferta) filtrados = filtrados.filter(p => p.oferta === true);
          if (orden === 'popularidad') {
            filtrados.sort((a, b) => (b.popularidad || 0) - (a.popularidad || 0));
          } else if (orden === 'precio_asc') {
            filtrados.sort((a, b) => a.precio - b.precio);
          } else if (orden === 'precio_desc') {
            filtrados.sort((a, b) => b.precio - a.precio);
          }
          filtrados = filtrados.slice(0, mostrarCantidad);
          setProductos(filtrados);
        })
        .catch(() => setProductos([]));
    }
  }, [idCategoria, idSubcategoria, soloOferta, orden, mostrarCantidad, searchParam]);

  const handleVerDetalle = producto => {
    setProductoSeleccionado(producto);
    setModalDetalleOpen(true);
  };

  const handleCerrarDetalle = () => {
    setModalDetalleOpen(false);
    setProductoSeleccionado(null);
  };

  const handleSelectSubcategoria = (catId, subId) => {
    setIdCategoria(catId);
    setIdSubcategoria(subId);
    setShowMenu(false);
  };

  const handleLogout = async () => {
    const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
    await AsyncStorage.removeItem('usuario');
    setShowPerfil(false);
    setUsuario(null);
    navigation.reset({
      index: 0,
      routes: [{ name: 'Index' }],
    });
  };

  const [showLogin, setShowLogin] = useState(false);
  const [showPerfil, setShowPerfil] = useState(false);

  return (
    <View style={styles.container}>
      <Header
        usuario={usuario}
        onMenuPress={() => setShowMenu(true)}
        onLoginPress={() => {
          if (usuario) {
            setShowPerfil((v) => !v);
          } else {
            setShowLogin(true);
          }
        }}
        onCartPress={() => {
          if (!usuario) {
            setShowLogin(true);
            return;
          }
          navigation.navigate('Carrito', { usuario });
        }}
        onSearch={(searchText) => {
          if (searchText && searchText.trim().length > 0) {
            navigation.navigate('VistaProductos', { search: searchText });
          }
        }}
      />
      <Modal visible={showMenu} animationType="slide" transparent>
        <MenuLateral
          visible={showMenu}
          onClose={() => setShowMenu(false)}
          onSelectSubcategoria={handleSelectSubcategoria}
        />
      </Modal>
      <Text style={styles.breadcrumb}>{nombreCategoria}</Text>
      <TouchableOpacity style={styles.filtrarBtn} onPress={() => setShowFiltros(true)}>
        <Text style={styles.filtrarBtnTxt}>Filtrar</Text>
      </TouchableOpacity>
      <Modal visible={showFiltros} animationType="slide" transparent>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.filtrosModalOverlay}
          onPress={() => setShowFiltros(false)}
        >
          <View style={styles.filtrosModalCard}>
            <Text style={styles.filtrosTitle}>Filtrar productos</Text>
            <TouchableOpacity style={styles.filtrosModalClose} onPress={() => setShowFiltros(false)}>
              <Text style={{ fontSize: 22, color: '#888' }}>✖</Text>
            </TouchableOpacity>
            <View style={styles.filtrosRow}>
              <View style={styles.filtroItem}>
                <TouchableOpacity
                  style={styles.ofertaCheck}
                  onPress={() => setSoloOferta(!soloOferta)}
                >
                  <Text style={{ fontWeight: '600', color: soloOferta ? '#1976d2' : '#444' }}>
                    {soloOferta ? '✔ ' : ''}Mostrar sólo productos en oferta
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.filtroItem}>
                <Text style={styles.selectLabel}>Ordenar por</Text>
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={orden}
                    style={styles.picker}
                    onValueChange={value => setOrden(value)}
                    mode="dropdown"
                  >
                    <Picker.Item label="Popularidad" value="popularidad" />
                    <Picker.Item label="Precio: Menor a Mayor" value="precio_asc" />
                    <Picker.Item label="Precio: Mayor a Menor" value="precio_desc" />
                  </Picker>
                </View>
              </View>
              <View style={styles.filtroItem}>
                <Text style={styles.selectLabel}>Mostrar</Text>
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={mostrarCantidad}
                    style={styles.picker}
                    onValueChange={value => setMostrarCantidad(value)}
                    mode="dropdown"
                  >
                    <Picker.Item label="12" value={12} />
                    <Picker.Item label="24" value={24} />
                    <Picker.Item label="48" value={48} />
                  </Picker>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
      <ScrollView style={{ flex: 1 }}>
        {productos.length === 0 ? (
          <Text style={styles.noProductos}>No hay productos disponibles en esta categoría y subcategoría.</Text>
        ) : (
          <View style={styles.productosGrid}>
            {productos.map(prod => (
              <View key={prod.id_producto} style={styles.productoCol}>
                <ProductoCard
                  producto={prod}
                  onVerDetalle={() => handleVerDetalle(prod)}
                  onAgregarCarrito={() => handleAgregarCarrito(prod)}
                  showIcons={true}
                  iconColor="#1976d2"
                />
              </View>
            ))}
          </View>
        )}
      </ScrollView>
      <Footer />
      <Modal visible={modalDetalleOpen} animationType="fade" transparent>
        <ModalDetalleProducto
          producto={productoSeleccionado}
          visible={modalDetalleOpen}
          onClose={handleCerrarDetalle}
          onAgregarCarrito={handleAgregarCarrito}
        />
      </Modal>
      <ModalFeedback
        visible={modalFeedbackOpen}
        onClose={() => setModalFeedbackOpen(false)}
        titulo="Producto agregado"
        mensaje="Producto agregado al carrito"
        icono="check"
        colorFondo="#fff"
        colorTitulo="#222"
        colorMensaje="#444"
        textoBoton="Cerrar"
        textoBotonSecundario="Ir al carrito"
        onBotonSecundario={() => {
          setModalFeedbackOpen(false);
          navigation.navigate('Carrito');
        }}
        colorBoton="#1976d2"
        colorBotonSecundario="#111"
        outlineBoton={true}
        outlineBotonSecundario={false}
        showClose={true}
      />
      {usuario && (
        <PerfilDropdown
          visible={showPerfil}
          usuario={usuario}
          onLogout={handleLogout}
          onMisCompras={() => {
            setShowPerfil(false);
            navigation.navigate('MisCompras', { usuario });
          }}
          onMisDatos={() => {
            setShowPerfil(false);
            navigation.navigate('MisDatos', { usuario });
          }}
        />
      )}
      <ModalLogin
        visible={showLogin}
        onClose={() => setShowLogin(false)}
        onLogin={user => {
          setUsuario(user);
          setShowLogin(false);
        }}
      />
    </View>
  );
}
