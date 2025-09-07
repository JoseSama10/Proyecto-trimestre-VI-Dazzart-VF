import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, ScrollView, Dimensions } from 'react-native';

const banners = [
  require('../assets/BANNER1.jpg'),
  require('../assets/BANNER_MI_PC_4.jpg'),
  require('../assets/msi-banner.jpg'),
  require('../assets/logitech-banner.jpg'),
];

const { width } = Dimensions.get('window');

const BannerCarrusel = () => {
  const scrollRef = useRef(null);
  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % banners.length;
      scrollRef.current?.scrollTo({ x: currentIndex * width, animated: true });
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  return (
    <View style={styles.container}>
      {/* SCROLLVIEW PARA LAS IMAGENES YA QUE NO PUDE PONERLAS CON "REACT-NATIVE-SNAP-CAROUCEL"*/}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={{ width }}
      >
        {banners.map((img, idx) => (
          <View key={idx} style={[styles.slide, { width }]}> 
            <Image source={img} style={styles.image} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slide: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
    height: 180,
  },
  image: {
    width: '100%',
    height: 180, 
    resizeMode: 'cover', 
    borderRadius: 12,
  },
});

export default BannerCarrusel;
