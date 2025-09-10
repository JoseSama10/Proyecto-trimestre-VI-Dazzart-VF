import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// CLIENTE
import Index from '../index';
import CarritoScreen from '../screens/cliente/CarritoScreen';
import Register from '../screens/cliente/Registro';
import DetalleProducto from '../screens/cliente/DetalleProducto';
import VistaProductos from '../screens/VistaProductos';

// ADMIN
import Categorias from '../screens/admin/categorias';
import Subcategorias from '../screens/admin/subcategorias';
import Estadisticas from '../screens/admin/estadisticas';
import Productos from '../screens/admin/productos';
import AgregarProductoScreen from '../screens/admin/AgregarProducto';
import EditarProductoScreen from '../screens/admin/EditarProducto.jsx';
import DescuentosAdmin from '../screens/admin/Descuento';
import FormularioDescuento from '../screens/admin/FormularioDescuento';
import EditarDescuento from '../screens/admin/EditarDescuento';
import UsuariosAdmin from '../screens/admin/GestionUsuarios'
import EditarUsuario from '../screens/admin/EditarUsuario'
import AgregarUsuario from '../screens/admin/AgregarUsuarios'
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
  DetalleProducto: { producto: any; usuario?: any };
  VistaProductos: { id_categoria: number; id_subcategoria: number };
  Descuentos: undefined;
  AgregarDescuento: undefined;
  EditarDescuento: undefined;
  Usuarios: undefined;
  EditarUsuario: undefined;
  AgregarUsuario: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function StackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Descuentos">
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
        name="DetalleProducto"
        component={DetalleProducto}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="VistaProductos"
        component={VistaProductos}
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
    
         <Stack.Screen
        name= "Descuentos"
        component={DescuentosAdmin}
        options={{ title: 'Descuentos'}}
      />

       <Stack.Screen
        name= "AgregarDescuento"
        component={FormularioDescuento}
        options={{ title: 'Formulario Descuento'}}
      />
      <Stack.Screen
        name= "EditarDescuento"
        component={EditarDescuento}
        options={{ title: 'Editar Descuento'}}
      />

       <Stack.Screen
        name="Usuarios"
        component={UsuariosAdmin}
        options={{ title: 'Usuarios Admin'}}
      />
       
       <Stack.Screen
        name="EditarUsuario"
        component={EditarUsuario}
        options={{ title: 'Editar Usuarios'}}
      />
       <Stack.Screen
        name="AgregarUsuario"
        component={AgregarUsuario}
        options={{ title: 'Agregar Usuarios'}}
      />



    </Stack.Navigator>
  );
}