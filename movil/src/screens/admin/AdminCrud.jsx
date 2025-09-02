// ESTO ES SIMPLEMENTE UN EJEMPLO
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function AdminCrud() {
  const navigation = useNavigation();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Panel de Administración</Text>
      <Text style={{ marginTop: 12 }}>Aquí va el CRUD de productos, usuarios, etc.</Text>
      <TouchableOpacity
        style={{ marginTop: 30, backgroundColor: '#1976d2', paddingVertical: 12, paddingHorizontal: 28, borderRadius: 8 }}
        onPress={() => navigation.replace('Index')}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 17 }}>Volver al inicio</Text>
      </TouchableOpacity>
    </View>
  );
}
