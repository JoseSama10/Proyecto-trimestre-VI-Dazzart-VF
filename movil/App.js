import { LogBox } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import { useEffect } from 'react';
const linking = {
  prefixes: ['dazzart://'],
  config: {
    screens: {
      RestablecerContra: {
        path: 'reset-password/:token',
        parse: { token: (token) => `${token}` },
      },
      // MAS PANTALLAS SI SE QUIERE 
    },
  },
};
import StackNavigator from './src/navigation/StackNavigator';
import * as SplashScreen from 'expo-splash-screen'; 
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins'; 

// IGNORAR ADVERTENCIAS ESPECÍFICAS
LogBox.ignoreLogs([
  'VirtualizedLists should never be nested inside plain ScrollViews',
]);

SplashScreen.preventAutoHideAsync();

export default function App() {
  // CARGAR FUENTES
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });

  const onLayoutRootView = async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  };

  useEffect(() => {
    const getUrlAsync = async () => {
      const initialUrl = await Linking.getInitialURL();
      console.log('URL inicial recibida:', initialUrl);
    };
    getUrlAsync();
  }, []);

  if (!fontsLoaded) {
    return null; 
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <NavigationContainer linking={linking}>
        <StackNavigator />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
