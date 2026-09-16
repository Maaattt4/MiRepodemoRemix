import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function AppCronometro() {
  const [tiempo, setTiempo] = useState(0);
  const [corriendo, setCorriendo] = useState(false);

  useEffect(() => {
    let intervalo;
    if (corriendo) {
      intervalo = setInterval(() => setTiempo((t) => t + 10), 10);
    } else {
      clearInterval(intervalo);
    }
    return () => clearInterval(intervalo);
  }, [corriendo]);

  const formatoTiempo = () => {
    const minutos = Math.floor((tiempo / 60000) % 60).toString().padStart(2, '0');
    const segundos = Math.floor((tiempo / 1000) % 60).toString().padStart(2, '0');
    const milisegundos = Math.floor((tiempo / 10) % 100).toString().padStart(2, '0');
    return `${minutos}:${segundos}:${milisegundos}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.pantalla}>
        <Text style={styles.textoTiempo}>{formatoTiempo()}</Text>
      </View>
      <View style={styles.controles}>
        <TouchableOpacity style={[styles.boton, styles.botonAccion]} onPress={() => setCorriendo(!corriendo)}>
          <Text style={styles.textoBoton}>{corriendo ? 'PAUSAR' : 'INICIAR'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.boton, styles.botonReset]} onPress={() => { setCorriendo(false); setTiempo(0); }}>
          <Text style={styles.textoBoton}>RESETEAR</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', alignItems: 'center', justifyContent: 'center' },
  pantalla: { width: 280, height: 280, borderRadius: 140, borderWidth: 4, borderColor: '#00E5FF', justifyContent: 'center', alignItems: 'center', backgroundColor: '#1A1A1A', marginBottom: 50, shadowColor: '#00E5FF', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 20, elevation: 10 },
  textoTiempo: { fontSize: 48, fontWeight: 'bold', color: '#FFF', letterSpacing: 2 },
  controles: { flexDirection: 'row', width: '80%', justifyContent: 'space-around' },
  boton: { paddingVertical: 15, paddingHorizontal: 30, borderRadius: 30, borderWidth: 2 },
  botonAccion: { borderColor: '#00E5FF', backgroundColor: 'rgba(0, 229, 255, 0.1)' },
  botonReset: { borderColor: '#FF007F', backgroundColor: 'rgba(255, 0, 127, 0.1)' },
  textoBoton: { color: '#FFF', fontWeight: 'bold', letterSpacing: 1 }
});