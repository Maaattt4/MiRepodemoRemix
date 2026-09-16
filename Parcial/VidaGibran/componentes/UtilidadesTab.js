import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import IMC from './IMC';
import Propinas from './Propinas';

const Tab = createBottomTabNavigator();

export default function UtilidadesTab() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#e74c3c',
        tabBarInactiveTintColor: '#95a5a6',
        tabBarStyle: { paddingBottom: 5, paddingTop: 5, height: 60 },
      }}
    >
      <Tab.Screen name="Calculadora IMC" component={IMC} />
      <Tab.Screen name="Propinas" component={Propinas} />
    </Tab.Navigator>
  );
}