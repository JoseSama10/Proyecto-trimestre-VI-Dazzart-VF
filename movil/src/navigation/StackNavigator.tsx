import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// CLIENTE
import Index from '../index';
import CarritoScreen from '../screens/cliente/CarritoScreen';
import Register from '../screens/cliente/Registro';


// ADMIN
import Categorias from '../screens/admin/categorias';
import Subcategorias from '../screens/admin/subcategorias';
import Estadisticas from '../screens/admin/estadisticas';

// Tipado de rutas
export type RootStackParamList = {
  Index: undefined;
  Carrito: undefined;
  Register: undefined;
  Login: undefined;
  AdminCrud: undefined;
  Categorias: undefined;
  Subcategorias: undefined; 
  Estadisticas: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function StackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Register">
      <Stack.Screen
        name="Index"
        component={Index}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Carrito"
        component={CarritoScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={Register}
        options={{ headerShown: false }}
      />
    
      <Stack.Screen
        name="Categorias"
        component={Categorias}
        options={{ title: 'Categorías' }}
      />
      <Stack.Screen
        name="Subcategorias"
        component={Subcategorias}
        options={{ title: 'Subcategorías' }}
      />
     <Stack.Screen
        name="Estadisticas"
        component={Estadisticas}
        options={{ title: 'Estadísticas' }}
      />
  
    </Stack.Navigator>
  );
}