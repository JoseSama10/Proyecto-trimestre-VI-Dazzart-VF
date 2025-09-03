import React, { useState } from 'react';
import API from './config/api';
import { Text, View, StyleSheet, SafeAreaView, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from './components/Header';
import ModalLogin from './components/ModalLogin';
import ModalFeedback from './components/ModalFeedback';
import Footer from './components/Footer';
import Marcas from './components/Marcas';
import BannerCarrusel from './components/BannerCarrusel';
import ProductosList from './components/ProductosList';
import MenuLateral from './components/MenuLateral';
import PerfilDropdown from './components/PerfilDropdown';

const Index = () => {
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);
  const [loginVisible, setLoginVisible] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [modalNoAuthVisible, setModalNoAuthVisible] = useState(false);
  const [carrito, setCarrito] = useState([]);
  const [modalAgregadoVisible, setModalAgregadoVisible] = useState(false);
  const [perfilDropdownVisible, setPerfilDropdownVisible] = useState(false);

  // HANDLER PARA AGREGAR PRODUCTO AL CARRITO
  const handleAgregarCarrito = async (producto, cantidad = 1) => {
    if (!usuario) {
      setLoginVisible(true);
      return;
    }
    try {
      await API.post('/carrito', {
        id_usuario: usuario.id_usuario,
        id_producto: producto._id || producto.id || producto.id_producto,
        cantidad: cantidad,
      });
      // RECARGAR CARRITO ACTUALIZADO
      const res = await API.get(`/carrito/${usuario.id_usuario}`);
      setCarrito(res.data || []);
    } catch (e) {}
    setModalAgregadoVisible(true);
  };

  // SE CARGAN PRODUCTOS EN EL CARRITO AL INICIAR SESION
  const handleLogin = async (user) => {
    setUsuario(user);
    if (user && user.id_usuario) {
      try {
        const res = await API.get(`/carrito/${user.id_usuario}`);
        setCarrito(res.data || []);
      } catch (err) {
        setCarrito([]);
      }
    } else {
      setCarrito([]);
    }
  };


  // HANDLER PARA ELIMINAR PRODUCTO DEL CARRITO
  const handleRemoveCarrito = async (producto) => {
    const getId = (p) => p._id || p.id || p.id_producto;
    const idProd = getId(producto);
    const prod = carrito.find((p) => getId(p) === idProd);
    if (prod && prod.id_carrito) {
      try {
        await API.delete(`/carrito/${prod.id_carrito}`);
        // RECARGAR CARRITO ACTUALIZADO
        const res = await API.get(`/carrito/${usuario.id_usuario}`);
        setCarrito(res.data || []);
      } catch (e) {}
    } else {
      setCarrito((prev) => prev.filter((p) => getId(p) !== idProd));
    }
  };

 
  const handleCheckout = () => {
    // FALTA LA LOGICA PARA LA COMPRA DESDE EL CARRITO DE COMPRAS
    setCarrito([]);
    
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableWithoutFeedback onPress={() => perfilDropdownVisible && setPerfilDropdownVisible(false)}>
        <View style={styles.container}>
        <Header
          onMenuPress={() => setMenuVisible(true)}
          onLoginPress={(e) => {
            e && e.stopPropagation && e.stopPropagation();
            if (usuario) {
              setPerfilDropdownVisible((v) => !v);
            } else {
              setLoginVisible(true);
            }
          }}
          onCartPress={() => {
            if (!usuario) {
              setLoginVisible(true);
              return;
            }
            navigation.navigate('Carrito', {
              productos: carrito,
              onRemove: handleRemoveCarrito,
              onCheckout: handleCheckout,
            });
          }}
          usuario={usuario}
        />
        <ModalLogin
          visible={loginVisible}
          onClose={() => setLoginVisible(false)}
          onLogin={handleLogin}
        />
  {/* MODAL DE AUTENTICADO */}
        {/* MODAL DE PRODUCTO AGREGADO */}
        <ModalFeedback
          visible={modalAgregadoVisible}
          icono="check"
          titulo="Producto agregado"
          mensaje="Producto agregado al carrito"
          colorFondo="#fff"
          colorTitulo="#222"
          colorMensaje="#444"
          textoBoton="Cerrar"
          outlineBoton={true}
          onBoton={() => setModalAgregadoVisible(false)}
          textoBotonSecundario="Ir al carrito"
          onBotonSecundario={() => {
            setModalAgregadoVisible(false);
            navigation.navigate('Carrito', {
              productos: carrito,
              onRemove: handleRemoveCarrito,
              onCheckout: handleCheckout,
            });
          }}
          showClose={true}
          onClose={() => setModalAgregadoVisible(false)}
        />
        <BannerCarrusel />
        <View style={styles.content}>
          <ProductosList onAgregarCarrito={handleAgregarCarrito} usuario={usuario} />
        </View>
        <Marcas />
        <SafeAreaView style={styles.safeFooter}>
          <Footer />
        </SafeAreaView>
        <MenuLateral visible={menuVisible} onClose={() => setMenuVisible(false)} />
        <PerfilDropdown
          visible={perfilDropdownVisible}
          usuario={usuario}
          onLogout={() => {
            setUsuario(null);
            setPerfilDropdownVisible(false);
            // SE LIMPIAN LOS CAMOPOS AL CERRAR SESION
            if (typeof global !== 'undefined' && global.clearLoginFields) global.clearLoginFields();
          }}
          onMisCompras={() => {
            setPerfilDropdownVisible(false);
            navigation.navigate('MisCompras');
          }}
          onMisDatos={() => {
            setPerfilDropdownVisible(false);
            navigation.navigate('MisDatos');
          }}
        />
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  safeFooter: {
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
});

export default Index;
