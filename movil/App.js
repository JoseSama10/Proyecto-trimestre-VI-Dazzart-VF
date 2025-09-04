import { LogBox } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './src/navigation/StackNavigator';
import * as SplashScreen from 'expo-splash-screen'; 
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins'; 


LogBox.ignoreLogs([
  'VirtualizedLists should never be nested inside plain ScrollViews',
]);


SplashScreen.preventAutoHideAsync();


export default function App() {

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });

 
  const onLayoutRootView = async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync(); 
    }
  };

  if (!fontsLoaded) {
    return null; 
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <NavigationContainer>
  <StackNavigator />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
