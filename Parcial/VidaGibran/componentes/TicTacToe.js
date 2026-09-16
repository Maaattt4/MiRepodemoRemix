import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function TicTacToe() {
  const [tablero, setTablero] = useState(Array(9).fill(null));
  const [xEsSiguiente, setXEsSiguiente] = useState(true);

  const calcularGanador = (cuadros) => {
    const lineas = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    for (let i = 0; i < lineas.length; i++) {
      const [a, b, c] = lineas[i];
      if (cuadros[a] && cuadros[a] === cuadros[b] && cuadros[a] === cuadros[c]) return cuadros[a];
    }
    return null;
  };

  const manejarToque = (index) => {
    const nuevoTablero = [...tablero];
    if (calcularGanador(nuevoTablero) || nuevoTablero[index]) return;
    nuevoTablero[index] = xEsSiguiente ? 'X' : 'O';
    setTablero(nuevoTablero);
    setXEsSiguiente(!xEsSiguiente);
  };

  const ganador = calcularGanador(tablero);
  const estado = ganador ? `GANADOR: ${ganador}` : `TURNO: ${xEsSiguiente ? 'X' : 'O'}`;

  return (
    <View style={styles.container}>
      <Text style={[styles.estado, ganador && styles.estadoGanador]}>{estado}</Text>
      <View style={styles.tablero}>
        {tablero.map((celda, i) => (
          <TouchableOpacity key={i} style={styles.celda} onPress={() => manejarToque(i)}>
            <Text style={[styles.textoCelda, { color: celda === 'X' ? '#FF007F' : '#00E5FF' }]}>{celda}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.botonReinicio} onPress={() => setTablero(Array(9).fill(null))}>
        <Text style={styles.textoBoton}>FORMATAR TABLERO</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#121212' },
  estado: { fontSize: 20, fontWeight: 'bold', marginBottom: 40, color: '#FFF', letterSpacing: 2 },
  estadoGanador: { color: '#00E5FF' },
  tablero: { width: 300, height: 300, flexDirection: 'row', flexWrap: 'wrap', backgroundColor: '#333', gap: 2 },
  celda: { width: 98, height: 98, backgroundColor: '#121212', alignItems: 'center', justifyContent: 'center' },
  textoCelda: { fontSize: 50, fontWeight: '900' },
  botonReinicio: { marginTop: 50, paddingVertical: 12, paddingHorizontal: 25, borderRadius: 5, borderWidth: 1, borderColor: '#FF007F' },
  textoBoton: { color: '#FF007F', fontSize: 14, fontWeight: 'bold', letterSpacing: 1 }
});