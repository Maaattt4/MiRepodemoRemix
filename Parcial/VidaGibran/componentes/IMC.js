import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function IMC() {
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [resultado, setResultado] = useState(null);

  const calcularIMC = () => {
    const p = parseFloat(peso);
    const a = parseFloat(altura);
    if (p > 0 && a > 0) {
      const imc = (p / (a * a)).toFixed(2);
      setResultado(imc);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Calculadora IMC</Text>
        <TextInput style={styles.input} placeholder="Peso (kg)" keyboardType="numeric" value={peso} onChangeText={setPeso} />
        <TextInput style={styles.input} placeholder="Altura (m)" keyboardType="numeric" value={altura} onChangeText={setAltura} />
        <TouchableOpacity style={styles.button} onPress={calcularIMC}>
          <Text style={styles.buttonText}>Calcular</Text>
        </TouchableOpacity>
        {resultado && <Text style={styles.result}>Tu IMC es: {resultado}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f1f2f6' },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 15, elevation: 4 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 15, fontSize: 16 },
  button: { backgroundColor: '#2ecc71', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  result: { marginTop: 20, fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: '#2c3e50' }
});