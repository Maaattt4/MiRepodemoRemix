import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import TicTacToe from './TicTacToe';
import AppCronometro from './AppCronometro';

const Tab = createBottomTabNavigator();

export default function TabGroup() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#00E5FF',
        tabBarInactiveTintColor: '#555',
        tabBarStyle: { backgroundColor: '#0A0A0A', borderTopWidth: 1, borderTopColor: '#333', height: 60, paddingBottom: 5 },
      }}
    >
      <Tab.Screen 
        name="Gato Neon" 
        component={TicTacToe} 
        options={{ tabBarIcon: ({ color }) => <Ionicons name="close-circle-outline" size={26} color={color} /> }} 
      />
      <Tab.Screen 
        name="Cronómetro" 
        component={AppCronometro} 
        options={{ tabBarIcon: ({ color }) => <Ionicons name="timer-outline" size={26} color={color} /> }} 
      />
    </Tab.Navigator>
  );
}