import React from 'react';
import { View, TextInput, TouchableOpacity, Image } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import styles from '../css/Header';
import logo from '../assets/dazzartnombre.png';

const Header = ({ onMenuPress, onLoginPress, onCartPress, onSearch, usuario }) => {
  const [search, setSearch] = React.useState('');

  return (
    <View style={[styles.header, {marginTop: 25}]}> 
      {/* MENU LATERAL*/}
      <TouchableOpacity onPress={onMenuPress} style={styles.menuIcon}>
        <Ionicons name="menu" size={29} color="#111" />
      </TouchableOpacity>

      {/* LOGO DAZZART */}
      <TouchableOpacity onPress={onSearch} style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Image source={logo} style={styles.logo} />
      </TouchableOpacity>

      {/* BARRA DE BUSQUEDA */}
      <View style={styles.iconGroup}>
        <TouchableOpacity style={styles.iconButton}>
          <MaterialIcons name="search" size={22} color="#111" />
        </TouchableOpacity>
      </View>

      {/* ICONOS USUARIO Y CARRITO */}
      <View style={styles.iconGroup}>
        <TouchableOpacity onPress={onLoginPress} style={styles.iconButton}>
          <MaterialIcons
            name="person"
            size={30}
            color={usuario ? '#444' : '#111'}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={onCartPress} style={styles.iconButton}>
          <MaterialIcons name="shopping-cart" size={28} color="#111" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;
