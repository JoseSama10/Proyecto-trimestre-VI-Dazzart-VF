import React from 'react';
import { View, TextInput, TouchableOpacity, Image, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import styles from '../css/Header';
import logo from '../assets/dazzartnombre.png';
import { useNavigation } from '@react-navigation/native';

const Header = ({ onMenuPress, onLoginPress, onCartPress, onSearch, usuario }) => {
  const [search, setSearch] = React.useState('');
  const [showInput, setShowInput] = React.useState(false);
  const navigation = useNavigation();

  const handleSubmit = () => {
    if (typeof search === 'string' && search.trim().length > 0 && onSearch) {
      onSearch(search);
    }
    setShowInput(false);
  };

  const handleLogoPress = () => {
    navigation.navigate('Index');
  };

  return (
    <View style={[styles.header, {marginTop: 25}]}> 
      {/* MENU LATERAL*/}
      <TouchableOpacity onPress={onMenuPress} style={styles.menuIcon}>
        <Ionicons name="menu" size={29} color="#111" />
      </TouchableOpacity>

      {/* LOGO DAZZART */}
      <View style={{ flex: 1, alignItems: 'center' }}>
        <TouchableOpacity
          onPress={handleLogoPress}
          style={{ justifyContent: 'center', alignItems: 'center' }}
        >
          <Image source={logo} style={styles.logo} />
        </TouchableOpacity>
      </View>

      {/* BARRA DE BUSQUEDA */}
      <View style={styles.iconGroup}>
        <TouchableOpacity style={styles.iconButton} onPress={() => setShowInput(true)}>
          <MaterialIcons name="search" size={28} color="#111" />
        </TouchableOpacity>
      </View>

      {/* BARRA DE BUSQUEDA SUPERPUESTA */}
      {showInput && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 100, justifyContent: 'flex-start', alignItems: 'center' }}>
          <TouchableWithoutFeedback onPress={() => { setShowInput(false); Keyboard.dismiss(); }}>
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' }} />
          </TouchableWithoutFeedback>
          <View style={{ marginTop: 30, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#bbb', paddingHorizontal: 12, width: '75%', maxWidth: 400, elevation: 8, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 8 }}>
            <TouchableOpacity onPress={handleSubmit} style={{ padding: 4, marginRight: 6 }}>
              <MaterialIcons name="search" size={28} color="#888" />
            </TouchableOpacity>
            <TextInput
              style={{ flex: 1, fontSize: 18, color: '#222', paddingVertical: 8, backgroundColor: 'transparent' }}
              placeholder="Buscar..."
              value={search}
              onChangeText={setSearch}
              autoFocus
              onSubmitEditing={handleSubmit}
              returnKeyType="search"
            />
            <TouchableOpacity style={styles.iconButton} onPress={() => { setShowInput(false); setSearch(''); }}>
              <MaterialIcons name="close" size={28} color="#888" />
            </TouchableOpacity>
          </View>
        </View>
      )}

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
