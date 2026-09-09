import 'react-native-gesture-handler';
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from './componentes/HomeScreen';
import Dados from './componentes/Dados';
import Gato from './componentes/Gato';
import UtilidadesTab from './componentes/UtilidadesTab';

const Drawer = createDrawerNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      })
    ]).start(() => {
      setTimeout(() => setIsLoading(false), 1500);
    });
  }, []);

  if (isLoading) {
    return (
      <View style={styles.splashContainer}>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}>
          <Image source={require('./assets/icon.png')} style={styles.logo} />
          <Text style={styles.splashText}>VidaGibran11</Text>
        </Animated.View>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Drawer.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: '#2c3e50' },
          headerTintColor: '#fff',
          drawerActiveTintColor: '#3498db',
        }}
      >
        <Drawer.Screen name="Home" component={HomeScreen} options={{ title: 'Inicio' }} />
        <Drawer.Screen name="Dados" component={Dados} options={{ title: 'Lanzar Dados' }} />
        <Drawer.Screen name="Gato" component={Gato} options={{ title: 'Tic Tac Toe' }} />
        <Drawer.Screen name="Utilidades" component={UtilidadesTab} options={{ title: 'IMC' }} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2c3e50',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  splashText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ecf0f1',
    textAlign: 'center',
  },
});