import { createNativeStackNavigator } from '@react-navigation/native-stack';

// import Register from '../screens/cliente/Registro';
import AdminCrud from '../screens/admin/AdminCrud';
import Index from '../index';
import CarritoScreen from '../screens/cliente/CarritoScreen';


const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  return (
  <Stack.Navigator initialRouteName="Index">
      <Stack.Screen
        name="AdminCrud"
        component={AdminCrud}
        options={{ headerShown: false }}
      />

      {/* {/* <Stack.Screen
        name="Register"
        component={Register}
        options={{ headerShown: false }} 
      /> */}
      
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
    </Stack.Navigator>
  );
}