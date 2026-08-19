import { View, Text, TextInput, Button, ScrollView, StyleSheet, Dimensions  } from 'react-native';
import { useState } from 'react';
import FlagComponent from './Componentes/FlagComponent';

export default function App() {
  
  const [texto, setText] = useState('');
  const [enviar, setEnviar] = useState('');
  
  return (
    <View style={styles.container}>
      <View style={styles.panel1}>
        
      </View>

      <View style={styles.panel2}>
          <ScrollView style={styles2.input}>
            <Text> Inicial{enviar}</Text>
            <Text> {enviar}</Text>
            <Text> {enviar}</Text>
            <Text> {enviar}</Text>
            <Text> {enviar}</Text>
            <Text> {enviar}</Text>
            <Text> {enviar}</Text>
            <Text> {enviar}</Text>
            <Text> {enviar}</Text>
            <Text> {enviar}</Text>
            <Text> {enviar}</Text>
            <Text> {enviar}</Text>
            <Text> {enviar}</Text>
            <Text> {enviar}</Text>
            <Text> {enviar}</Text>
            <Text> {enviar}</Text>
            <Text> {enviar}</Text>
            <Text> {enviar}</Text>
            <Text> {enviar}</Text>
            <Text> {enviar}</Text>
            <Text> {enviar}</Text>
            <Text> {enviar}</Text>
            <Text> {enviar}</Text>
            <Text> {enviar}</Text>
            <Text> {enviar}</Text>
            <Text> {enviar}</Text>
            <Text> {enviar}</Text>
            <Text> {enviar}</Text>
            <Text> {enviar}</Text>
            <Text> {enviar}</Text>
            <Text> {enviar}</Text>
            <Text> {enviar}</Text>
            <Text> {enviar}</Text>
            <Text> {enviar}</Text>
            <Text> {enviar}</Text>
            <Text> {enviar}</Text>
            <Text> Final{enviar}</Text>
          </ScrollView>
      </View>

      <View style={styles.panel3}>
        <TextInput
                        placeholder="Escribe aqui..."
                        onChangeText={t => setText(t)}
                    />
                    <Button
                        title="Enviar"
                        onPress={() => setEnviar(texto)}
                    />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#381919',

  },
  panel1: {
    flex: 1,
    backgroundColor: '#fff70a',

  },
  panel2: {
    flex: 1,
    backgroundColor: '#100ac2',
    minHeight: 0,
    
  },
  panel3: {
    flex: 1,
    backgroundColor: '#f12c2c',
  }

});

const styles2 = StyleSheet.create({
    input: {
      flex: 1,
      width: '100%',
    },
});
