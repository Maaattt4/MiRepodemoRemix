import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const EMOJIS = ['👽', '👾', '🚀', '🛸', '🤖', '👻'];

export default function AppMemorama() {
  const [cartas, setCartas] = useState([]);
  const [volteadas, setVolteadas] = useState([]);
  const [encontradas, setEncontradas] = useState([]);

  useEffect(() => {
    iniciarJuego();
  }, []);

  const iniciarJuego = () => {
    const baraja = [...EMOJIS, ...EMOJIS].sort(() => Math.random() - 0.5);
    setCartas(baraja);
    setVolteadas([]);
    setEncontradas([]);
  };

  const manejarGiro = (index) => {
    if (volteadas.length === 2 || volteadas.includes(index) || encontradas.includes(index)) return;
    const nuevasVolteadas = [...volteadas, index];
    setVolteadas(nuevasVolteadas);
    if (nuevasVolteadas.length === 2) {
      if (cartas[nuevasVolteadas[0]] === cartas[nuevasVolteadas[1]]) {
        setEncontradas([...encontradas, ...nuevasVolteadas]);
      }
      setTimeout(() => setVolteadas([]), 1000);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MEMORAMA</Text>
      <View style={styles.grid}>
        {cartas.map((carta, index) => {
          const esVisible = volteadas.includes(index) || encontradas.includes(index);
          return (
            <TouchableOpacity key={index} style={[styles.card, esVisible && styles.cardVisible]} onPress={() => manejarGiro(index)}>
              <Text style={styles.cardText}>{esVisible ? carta : '?'}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <TouchableOpacity style={styles.boton} onPress={iniciarJuego}>
        <Text style={styles.textoBoton}>RESETEAR SISTEMA</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 26, fontWeight: 'bold', color: '#00E5FF', marginBottom: 30, letterSpacing: 3 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', width: 320, justifyContent: 'center' },
  card: { width: 70, height: 90, backgroundColor: '#1A1A1A', margin: 5, borderRadius: 10, borderWidth: 1, borderColor: '#333', justifyContent: 'center', alignItems: 'center' },
  cardVisible: { backgroundColor: '#2A2A2A', borderColor: '#FF007F' },
  cardText: { fontSize: 32, color: '#333' },
  boton: { marginTop: 40, backgroundColor: 'transparent', borderWidth: 2, borderColor: '#00E5FF', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 5 },
  textoBoton: { color: '#00E5FF', fontWeight: 'bold', letterSpacing: 1 }
});