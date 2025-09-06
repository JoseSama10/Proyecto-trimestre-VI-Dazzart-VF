import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Image, Text } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import API from '../config/api';
import styles from '../css/ProductosList';

const ProductoCard = ({ producto, onVerDetalle, onAgregarCarrito, showIcons, onPress }) => {
  let imgUrl = producto?.urlImagen || producto?.imagen;
  if (imgUrl && (imgUrl.startsWith('/img/') || imgUrl.startsWith('img/'))) {
    imgUrl = imgUrl.replace(/^\/?img\//, '');
    imgUrl = `${API.defaults.baseURL.replace(/\/api$/, '')}/productos/img/${imgUrl}`;
  }

  return (
    <TouchableOpacity
      activeOpacity={0.95}
      style={styles.card}
      onPress={onPress}
    >
      <View style={styles.imageContainer}>
        {imgUrl ? (
          <Image source={{ uri: imgUrl }} style={styles.image} />
        ) : (
          <View style={styles.noImage}>
            <FontAwesome name="image" size={60} color="#aaa" />
          </View>
        )}
        {showIcons && (
          <View style={{ position: 'absolute', top: 10, right: 10, flexDirection: 'row', zIndex: 2 }}>
            <TouchableOpacity onPress={onVerDetalle} style={{ marginHorizontal: 4 }}>
              <FontAwesome name="search" size={26} color="#444" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onAgregarCarrito(producto)} style={{ marginHorizontal: 4 }}>
              <FontAwesome name="shopping-cart" size={26} color="#444" />
            </TouchableOpacity>
          </View>
        )}
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.nombre} numberOfLines={2}>{producto?.nombre || ''}</Text>
        <Text style={styles.descripcion} numberOfLines={2}>{producto?.descripcion || ''}</Text>
        {producto?.descuento_aplicado ? (
          <View style={styles.precioContainer}>
            <Text style={styles.precioTachado}>{`$${producto?.precio}`}</Text>
            <Text style={styles.precioDescuento}>{`$${producto?.precio_final}`}</Text>
          </View>
        ) : (
          <Text style={styles.precioNormal}>{`$${producto?.precio}`}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const ProductosList = ({ onAgregarCarrito, usuario }) => {
  const navigation = useNavigation();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showIcons, setShowIcons] = useState(false);
  const hideIconsTimeout = React.useRef(null);
  const flatListRef = React.useRef(null);
  // REPETIR EL ARRAY 7 VECES PARA MAYOR FLUIDEZ
  const repeatCount = 70;
  const loopedProductos = productos.length > 0 ? Array(repeatCount).fill(productos).flat() : [];
  const middleIndex = productos.length * Math.floor(repeatCount / 2);

  useEffect(() => {
    API.get('/productos/listar')
      .then(res => {
        // SE MUESTRAN SOLO MAS NUEVOS PRODUCTOS Y POR ID
        let arr = res.data;
        if (arr && arr.length > 0) {
          arr = arr.sort((a, b) => {
            if (a.fecha_creacion && b.fecha_creacion) {
              return new Date(b.fecha_creacion) - new Date(a.fecha_creacion);
            }
            return (b._id || b.id || 0) - (a._id || a.id || 0);
          });
          arr = arr.slice(0, 10);
        }
        setProductos(arr);
        setLoading(false);
        setTimeout(() => {
          if (flatListRef.current && arr.length > 0) {
            flatListRef.current.scrollToIndex({ index: middleIndex, animated: false });
          }
        }, 300);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#000" style={{ marginTop: 40 }} />;
  }

  // CARRUSEL HORIZONTAL DE LOS 10 PRODUCTOS MAS NUEVOS
  return (
    <View style={styles.listContainer}>
      <Text style={{ fontWeight: 'bold', fontSize: 22, marginBottom: 12, textAlign: 'center' }}>
        Nuevos Productos
      </Text>
      <FlatList
        ref={flatListRef}
        data={loopedProductos}
        keyExtractor={(_, idx) => idx.toString()}
        renderItem={({ item }) => (
          <ProductoCard
            producto={item}
            showIcons={showIcons}
            onVerDetalle={() => { }}
            onAgregarCarrito={onAgregarCarrito}
            onPress={() => navigation.navigate('DetalleProducto', { producto: item, usuario })}
          />
        )}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 24 }}
        style={{ minHeight: 360 }}
        initialScrollIndex={middleIndex}
        getItemLayout={(_, index) => ({ length: 160, offset: 160 * index, index })}
        onScrollBeginDrag={() => {
          if (hideIconsTimeout.current) {
            clearTimeout(hideIconsTimeout.current);
          }
          setShowIcons(true);
        }}
        onMomentumScrollEnd={event => {
          const offsetX = event.nativeEvent.contentOffset.x;
          const itemWidth = 160;
          const totalItems = loopedProductos.length;
          const visibleItems = productos.length;
          // Umbral más amplio para reposicionar (fluidez)
          const threshold = itemWidth * visibleItems * 2;
          if (flatListRef.current && productos.length > 0) {
            if (offsetX <= threshold) {
              flatListRef.current.scrollToIndex({ index: middleIndex, animated: false });
            } else if (offsetX >= itemWidth * (totalItems - visibleItems * 2)) {
              flatListRef.current.scrollToIndex({ index: middleIndex, animated: false });
            }
          }
          // Oculta los iconos después de un tiempo
          if (hideIconsTimeout.current) {
            clearTimeout(hideIconsTimeout.current);
          }
          hideIconsTimeout.current = setTimeout(() => {
            setShowIcons(false);
          }, 950);
        }}
      />
    </View>
  );
};

export default ProductosList;