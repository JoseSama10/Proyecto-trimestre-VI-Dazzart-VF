import React from 'react';
import { View, Text, Linking, TouchableOpacity } from 'react-native';
import styles from '../css/Footer';

const legalLinks = [
  { label: 'Términos de uso', url: '#' },
  { label: 'Política de privacidad', url: '#' },
  { label: 'Preferencias de privacidad', url: '#' },
  { label: 'Gestión de anuncios', url: '#' },
];

const Footer = () => (
  <View style={styles.footer}>
    <Text style={styles.text}> 2022-2025 Dazzart Components. Todos los derechos reservados.</Text>
    <View style={styles.legalLinks}>
      {legalLinks.map((link, idx) => (
        <TouchableOpacity key={idx} onPress={() => link.url !== '#' && Linking.openURL(link.url)}>
          <Text style={styles.legalLink}>{link.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

export default Footer;
