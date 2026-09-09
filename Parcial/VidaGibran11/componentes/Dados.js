import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function Dados() {
  const [dado1, setDado1] = useState(1);
  const [dado2, setDado2] = useState(1);

  const lanzarDados = () => {
    setDado1(Math.floor(Math.random() * 6) + 1);
    setDado2(Math.floor(Math.random() * 6) + 1);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tira los dados</Text>
      <View style={styles.diceContainer}>
        <View style={styles.dice}><Text style={styles.diceText}>{dado1}</Text></View>
        <View style={styles.dice}><Text style={styles.diceText}>{dado2}</Text></View>
      </View>
      <TouchableOpacity style={styles.button} onPress={lanzarDados}>
        <Text style={styles.buttonText}>Lanzar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9f9f9' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 30, color: '#333' },
  diceContainer: { flexDirection: 'row', gap: 20, marginBottom: 40 },
  dice: { width: 100, height: 100, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', borderRadius: 15, elevation: 5 },
  diceText: { fontSize: 40, fontWeight: 'bold', color: '#e74c3c' },
  button: { backgroundColor: '#3498db', paddingHorizontal: 40, paddingVertical: 15, borderRadius: 25 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});