import { LogBox } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './src/navigation/StackNavigator';
import * as SplashScreen from 'expo-splash-screen'; 
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins'; 

// Ignorar advertencias específicas
LogBox.ignoreLogs([
  'VirtualizedLists should never be nested inside plain ScrollViews',
]);

// Mantener splash screen hasta que las fuentes carguen
SplashScreen.preventAutoHideAsync();

export default function App() {
  // Cargar fuentes
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });

  // Ocultar splash cuando las fuentes estén listas
  const onLayoutRootView = async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  };

  if (!fontsLoaded) {
    return null; // Mostrar pantalla en blanco mientras cargan fuentes
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <NavigationContainer>
        <StackNavigator />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
