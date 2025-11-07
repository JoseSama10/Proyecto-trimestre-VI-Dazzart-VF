import React from 'react';
import { Modal, View, Text, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import styles from '../css/ModalFeedback';

// ESTILOS PARA EL MODAL DE FEEDBACK REUTILIZABLE (COMO PRODUCTO AGREGADO, ERROR, ETC.)
const ModalFeedback = ({
  visible,
  onClose,
  titulo = '',
  mensaje = '',
  icono = 'check',
  colorFondo = '#fff',
  colorTitulo = '#222',
  colorMensaje = '#444',
  textoBoton = 'Cerrar',
  onBoton = null,
  textoBotonSecundario = null,
  onBotonSecundario = null,
  colorBoton = '#2196f3',
  colorBotonSecundario = '#111',
  outlineBoton = false,
  outlineBotonSecundario = false,
  showClose = true,
}) => {
  if (!visible) return null;
  return (
    <Modal visible={visible} animationType="fade" transparent>
      <TouchableOpacity
        activeOpacity={1}
        style={styles.overlay}
        onPress={onClose}
      >
        <TouchableWithoutFeedback>
          <View style={[styles.modalContainer, { backgroundColor: colorFondo }]}>  
            {showClose && (
              <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                <Text style={{ fontSize: 22, color: '#888' }}>✖</Text>
              </TouchableOpacity>
            )}
            {/*ICONO DE CHECK AZUL */}
            <MaterialIcons name="check" size={48} color="#0084ff" style={styles.iconCheck} />
            <Text style={[styles.title, { color: colorTitulo }]}>{titulo}</Text>
            <Text style={[styles.subtitle, { color: colorMensaje }]}>{mensaje}</Text>
            <View style={styles.buttonRowVite}>
              <TouchableOpacity
                style={[styles.btnVite, styles.btnViteOutline]}
                onPress={onBoton || onClose}
              >
                <Text style={styles.btnViteOutlineText}>{textoBoton || 'Cerrar'}</Text>
              </TouchableOpacity>
              {textoBotonSecundario && (
                <TouchableOpacity
                  style={[styles.btnVite, styles.btnViteSolid]}
                  onPress={onBotonSecundario}
                >
                  <Text style={styles.btnViteSolidText}>{textoBotonSecundario}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
};

export default ModalFeedback;