import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Register from '../screens/cliente/Registro';
import Login from '../screens/cliente/Login';


const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Register">
     
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
      
    </Stack.Navigator>
  );
}