import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import IMCScreen from './src/screens/ImcScreen';
import CurrencyScreen from './src/screens/CurrencyScreen';
import TipScreen from './src/screens/TipScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options ={{ title: 'Menu principal'}} />
        <Stack.Screen name="IMC" component={IMCScreen} options ={{ title: 'Calculadora IMC'}} />
        <Stack.Screen name="Currency" component={CurrencyScreen} options ={{ title: 'Calculadora Divisas'}} />
        <Stack.Screen name="Tip" component={TipScreen} options ={{ title: 'Calculo de Propinas'}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
} 
