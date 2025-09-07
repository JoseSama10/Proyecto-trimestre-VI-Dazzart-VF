
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Modal, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import styles from '../css/MenuLateral';
import API from '../config/api';

const MenuLateral = ({ visible, onClose, onSelectSubcategoria }) => {
  const navigation = useNavigation();
  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [categoriaActiva, setCategoriaActiva] = useState(null);

  useEffect(() => {
    if (visible) {
      API.get('/categorias/listar')
        .then(res => setCategorias(res.data))
        .catch(() => setCategorias([]));
      setCategoriaActiva(null);
      setSubcategorias([]);
    }
  }, [visible]);

  useEffect(() => {
    if (categoriaActiva) {
      API.get('/subcategorias/listar')
        .then(res => {
          const filtradas = res.data.filter(sub => sub.id_categoria === categoriaActiva);
          setSubcategorias(filtradas);
        })
        .catch(() => setSubcategorias([]));
    } else {
      setSubcategorias([]);
    }
  }, [categoriaActiva]);

  const handleCategoriaClick = (id) => {
    setCategoriaActiva(id);
  };

  const handleSubcategoriaClick = (id_subcategoria) => {
    if (onSelectSubcategoria) onSelectSubcategoria(categoriaActiva, id_subcategoria);
    navigation.navigate('VistaProductos', { id_categoria: categoriaActiva, id_subcategoria });
    onClose();
  };

  if (!visible) return null;
  return (
    <View style={styles.drawerOverlay}>
      <View style={styles.drawerContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Menú</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={{ fontSize: 28, color: '#888' }}>✖</Text>
          </TouchableOpacity>
        </View>
        <ScrollView>
          {!categoriaActiva ? (
            <>
              <Text style={styles.subtitle}>Categorías</Text>
              {categorias.map(cat => (
                <TouchableOpacity
                  key={cat.id_categoria}
                  style={styles.categoriaBtn}
                  onPress={() => handleCategoriaClick(cat.id_categoria)}
                >
                  <Text style={styles.categoriaText}>{cat.nombre_categoria}</Text>
                </TouchableOpacity>
              ))}
            </>
          ) : (
            <>
              <TouchableOpacity onPress={() => setCategoriaActiva(null)} style={{ marginBottom: 10 }}>
                <Text style={{ color: '#1976d2', fontWeight: 'bold', fontSize: 16 }}>{'< Volver a categorías'}</Text>
              </TouchableOpacity>
              <Text style={styles.subtitle}>Subcategorías</Text>
              {subcategorias.length > 0 ? (
                subcategorias.map(sub => (
                  <TouchableOpacity
                    key={sub.id_subcategoria}
                    style={styles.subcategoriaBtn}
                    onPress={() => handleSubcategoriaClick(sub.id_subcategoria)}
                  >
                    <Text style={styles.subcategoriaText}>{sub.nombre_subcategoria}</Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.sinSubcategorias}>No hay subcategorías para esta categoría.</Text>
              )}
            </>
          )}
        </ScrollView>
      </View>
    </View>
  );

};

export default MenuLateral;