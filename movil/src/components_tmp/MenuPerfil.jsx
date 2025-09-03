import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import styles from '../css/MenuPerfil';

const MenuPerfil = ({ visible, onClose, usuario, onLogout, onMisCompras, onMisDatos }) => {
  if (!visible) return null;
  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.userRow}>
            <FontAwesome name="user" size={22} color="#444" style={{ marginRight: 8 }} />
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
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeText}>✖</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default MenuPerfil;
