import React from 'react';
import { View, Image, TouchableOpacity, Linking, ScrollView, StyleSheet } from 'react-native';

// IMPORTAR IMAGENES
import marca1 from '../assets/MSI.webp';
import marca2 from '../assets/FANTECH.webp';
import marca3 from '../assets/High_Resolution_PNG-LogitechG_horz_RGB_cyan_SM-1024x307.png';
import marca4 from '../assets/ASTRO-1.webp';
import marca5 from '../assets/LG-ULTRAGEAR-1.webp';


const marcas = [
  { id: 1, img: marca1, alt: 'MSI', url: 'https://latam.msi.com/' },
  { id: 2, img: marca2, alt: 'Fantech', url: 'https://fantechworld.com/' },
  { id: 3, img: marca3, alt: 'Logitech', url: 'https://www.logitechstore.com.co/' },
  { id: 4, img: marca4, alt: 'Astro', url: 'https://www.marca4.com' },
  { id: 5, img: marca5, alt: 'LG', url: 'https://www.marca5.com' },
];

const Marcas = () => (
  <View style={marcasStyles.section}>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={marcasStyles.scrollContent}>
      {marcas.map(({ id, img, alt, url }) => (
        <TouchableOpacity
          key={id}
          style={marcasStyles.item}
          onPress={() => url && Linking.openURL(url)}
        >
          <Image source={img} style={marcasStyles.img} accessibilityLabel={alt} />
        </TouchableOpacity>
      ))}
    </ScrollView>
  </View>
);

const marcasStyles = StyleSheet.create({
  section: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 8,
    width: '100%',
    height: 75, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  item: {
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  img: {
    height: 100,
    width: 200,
    resizeMode: 'contain',
    marginHorizontal: 12,
  },
});

export default Marcas;
