import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // Iconos opcionales

import AgregarScreen from './src/screens/AgregarScreen';
import ConsultarScreen from './src/screens/ConsultarScreen';
import ActualizarScreen from './src/screens/ActualizarScreen';
import EliminarScreen from './src/screens/EliminarScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ tabBarActiveTintColor: '#0446ed' }}>
        <Tab.Screen 
          name="Agregar" 
          component={AgregarScreen} 
          options={{ tabBarIcon: ({color}) => <Ionicons name="add-circle-outline" size={24} color={color}/> }}
        />
        <Tab.Screen 
          name="Consultar" 
          component={ConsultarScreen} 
          options={{ tabBarIcon: ({color}) => <Ionicons name="list-outline" size={24} color={color}/> }}
        />
        <Tab.Screen 
          name="Actualizar" 
          component={ActualizarScreen} 
          options={{ tabBarIcon: ({color}) => <Ionicons name="create-outline" size={24} color={color}/> }}
        />
        <Tab.Screen 
          name="Eliminar" 
          component={EliminarScreen} 
          options={{ tabBarIcon: ({color}) => <Ionicons name="trash-outline" size={24} color={color}/> }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}