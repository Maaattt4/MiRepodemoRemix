import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function AppPropinas() {
  const [cuenta, setCuenta] = useState('');
  const [porcentaje, setPorcentaje] = useState(15);

  const propina = (parseFloat(cuenta || 0) * (porcentaje / 100)).toFixed(2);
  const total = (parseFloat(cuenta || 0) + parseFloat(propina)).toFixed(2);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>CÁLCULO DE PROPINA</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.currency}>$</Text>
        <TextInput style={styles.input} placeholder="0.00" placeholderTextColor="#555" keyboardType="numeric" value={cuenta} onChangeText={setCuenta} />
      </View>
      <View style={styles.row}>
        {[10, 15, 20].map((p) => (
          <TouchableOpacity key={p} style={[styles.btn, porcentaje === p && styles.btnActivo]} onPress={() => setPorcentaje(p)}>
            <Text style={[styles.btnText, porcentaje === p && styles.btnTextActivo]}>{p}%</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.resultCard}>
        <View style={styles.resultRow}>
          <Text style={styles.resultLabel}>Propina</Text>
          <Text style={styles.resultValue}>${propina}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.resultRow}>
          <Text style={styles.resultLabelTotal}>TOTAL</Text>
          <Text style={styles.resultValueTotal}>${total}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 25, justifyContent: 'center' },
  header: { color: '#FF007F', fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', letterSpacing: 2 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1A1A1A', borderRadius: 10, paddingHorizontal: 20, marginBottom: 30, borderWidth: 1, borderColor: '#333' },
  currency: { color: '#00E5FF', fontSize: 28, fontWeight: 'bold', marginRight: 10 },
  input: { flex: 1, color: '#FFF', fontSize: 28, paddingVertical: 15 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40 },
  btn: { flex: 1, marginHorizontal: 5, paddingVertical: 15, backgroundColor: '#1A1A1A', borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: '#333' },
  btnActivo: { borderColor: '#00E5FF', backgroundColor: 'rgba(0, 229, 255, 0.1)' },
  btnText: { color: '#888', fontSize: 18, fontWeight: 'bold' },
  btnTextActivo: { color: '#00E5FF' },
  resultCard: { backgroundColor: '#1A1A1A', padding: 25, borderRadius: 15, borderWidth: 1, borderColor: '#333' },
  resultRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 10 },
  resultLabel: { color: '#888', fontSize: 18 },
  resultValue: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  divider: { height: 1, backgroundColor: '#333', marginVertical: 10 },
  resultLabelTotal: { color: '#FF007F', fontSize: 22, fontWeight: 'bold' },
  resultValueTotal: { color: '#00E5FF', fontSize: 28, fontWeight: 'bold' }
});