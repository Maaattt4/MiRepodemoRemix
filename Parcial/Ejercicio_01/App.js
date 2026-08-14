import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Micomponente from './componentes/MiComponente';
import Mensaje from './componentes/Mensaje';

export default function App() {
  return (
    <View style={styles.container}>
      
      <Mensaje titulo = "hola desde una propiedad" numero="25" />
      <Mensaje titulo = "bienvenido al curso react native" numero="30" />
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
