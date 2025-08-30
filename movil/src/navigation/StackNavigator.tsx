import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';



import Register from '../screens/cliente/Registro';
import Login from '../screens/cliente/Login';

// ADMIN
import Categorias from '../screens/admin/categorias';
import Subcategorias from '../screens/admin/subcategorias';

// Tipado de rutas
export type RootStackParamList = {
  Register: undefined;
  Login: undefined;
  Categorias: undefined;
  Subcategorias: { categoriaId: string }; 
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function StackNavigator() {
  return (

<Stack.Navigator id={undefined} initialRouteName="Categorias">
      <Stack.Screen
        name="Register"
        component={Register}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={Login}
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
    </Stack.Navigator>
  );
}
