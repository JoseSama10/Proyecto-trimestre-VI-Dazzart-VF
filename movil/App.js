import { LogBox } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './src/navigation/StackNavigator';
import * as SplashScreen from 'expo-splash-screen'; // Importa el módulo de splash screen
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins'; // Asegúrate de importar useFonts

// Ignorar warnings específicos
LogBox.ignoreLogs([
  'VirtualizedLists should never be nested inside plain ScrollViews',
]);

// Mantener la pantalla de splash visible mientras se cargan los recursos
SplashScreen.preventAutoHideAsync();

export default function App() {
  // Carga de fuentes
  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });

  // Función para ocultar la pantalla de splash
  const onLayoutRootView = async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync(); // Oculta la pantalla de splash
    }
  };

  if (!fontsLoaded) {
    return null; // Retorna null mientras se cargan las fuentes
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <NavigationContainer>
        <StackNavigator />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
