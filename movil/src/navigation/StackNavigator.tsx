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
import Productos from '../screens/admin/productos';
import AgregarProductoScreen from '../screens/admin/AgregarProducto';
import EditarProductoScreen from '../screens/admin/EditarProducto.jsx';

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
  Productos: undefined;
  AgregarProducto: undefined;
  EditarProducto: { id: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function StackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Productos">
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


      {/* Pantallas de productos */}
      <Stack.Screen
        name="Productos"
        component={Productos}
        options={{ title: 'Productos' }}
      />
      <Stack.Screen name="AgregarProducto" component={AgregarProductoScreen} />
      <Stack.Screen name="EditarProducto" component={EditarProductoScreen} />
    
    </Stack.Navigator>
  );
}