import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import styles from '../css/MenuPerfil';

const PerfilDropdown = ({ visible, usuario, onLogout, onMisCompras, onMisDatos }) => {
  if (!visible) return null;
  return (
    <View style={{
      position: 'absolute',
  top: 100, // MAS ABAJO DEL HEADER PARA MEJOR SEPARACIoN VISUAL
      right: 16, //  ALINEADO A LA DERECHA CON EL ICONO DE USUARIO
      zIndex: 100,
      backgroundColor: '#fff',
      borderRadius: 18,
      padding: 18,
      elevation: 8,
      minWidth: 240,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.18,
      shadowRadius: 8,
    }}>
      <View style={styles.userRow}>
        <FontAwesome name="user" size={22} color="#1976d2" style={{ marginRight: 8 }} />
        <Text style={styles.userName}>{usuario?.nombre || usuario?.nombre_usuario || ''}</Text>
      </View>
      <Text style={styles.userEmail}>{usuario?.correo_electronico || ''}</Text>
      <View style={styles.divider} />
      <TouchableOpacity onPress={onMisCompras} style={styles.menuBtn}>
        <MaterialIcons name="list" size={20} color="#222" style={{ marginRight: 8 }} />
        <Text style={styles.menuBtnText}>Mis compras</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onMisDatos} style={styles.menuBtn}>
        <FontAwesome name="user" size={18} color="#222" style={{ marginRight: 8 }} />
        <Text style={styles.menuBtnText}>Mis datos</Text>
      </TouchableOpacity>
      <View style={styles.divider} />
      <TouchableOpacity onPress={onLogout} style={styles.logoutBtn}>
        <MaterialIcons name="logout" size={20} color="#d32f2f" style={{ marginRight: 8 }} />
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PerfilDropdown;
