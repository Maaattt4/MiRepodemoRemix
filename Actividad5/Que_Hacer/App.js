import 'react-native-gesture-handler';
import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';

import { TareasProvider, TareasContext } from './src/Context/TareasContext';
import CustomDrawer from './src/Componentes/CustomDrawer';
import LoginScreen from './src/Screens/LoginScreen';
import PerfilScreen from './src/Screens/PerfilScreen';
import ImportantesScreen from './src/Screens/ImportantesScreen';
import ListaGenericaScreen from './src/Screens/ListaGenericaScreen';

const Drawer = createDrawerNavigator();

function AppNavigator() {
  const { isLoggedIn } = useContext(TareasContext);

  if (!isLoggedIn) {
    return <LoginScreen />;
  }

  return (
    <NavigationContainer>
      <Drawer.Navigator 
        drawerContent={(props) => <CustomDrawer {...props} />}
        screenOptions={{
          drawerStyle: { backgroundColor: '#222831' },
          drawerLabelStyle: { color: '#DFD0B8', fontSize: 16, marginLeft: -15 }, 
          drawerInactiveTintColor: '#DFD0B8', 
          drawerActiveTintColor: '#ffffff', 
          drawerActiveBackgroundColor: '#393E46', 
          headerStyle: { backgroundColor: '#222831', shadowColor: 'transparent', elevation: 0 }, 
          headerTintColor: '#DFD0B8',
        }}
      >
        <Drawer.Screen 
          name="Perfil" 
          component={PerfilScreen} 
          options={{ drawerIcon: ({color}) => <Ionicons name="person-outline" size={22} color={color} /> }} 
        />
        <Drawer.Screen 
          name="Importantes" 
          component={ImportantesScreen} 
          options={{ drawerIcon: ({color}) => <Ionicons name="star-outline" size={22} color={color} /> }} 
        />
        <Drawer.Screen 
          name="Tareas" 
          component={ListaGenericaScreen} 
          initialParams={{ nombreLista: 'Tareas' }} 
          options={{ drawerIcon: ({color}) => <Ionicons name="list-outline" size={22} color={color} /> }} 
        />
        <Drawer.Screen 
          name="Hábitos" 
          component={ListaGenericaScreen} 
          initialParams={{ nombreLista: 'Hábitos' }} 
          options={{ drawerIcon: ({color}) => <Ionicons name="sync-outline" size={22} color={color} /> }} 
        />
        <Drawer.Screen name="ListaGenerica" component={ListaGenericaScreen} options={{ drawerItemStyle: { display: 'none' } }} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <TareasProvider>
      <AppNavigator />
    </TareasProvider>
  );
}