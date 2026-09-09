import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function Propinas() {
  const [total, setTotal] = useState('');
  const [porcentaje, setPorcentaje] = useState(10);

  const montoPropina = (parseFloat(total || 0) * (porcentaje / 100)).toFixed(2);
  const totalPagar = (parseFloat(total || 0) + parseFloat(montoPropina)).toFixed(2);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Calculadora de Propinas</Text>
        <TextInput style={styles.input} placeholder="Monto Total ($)" keyboardType="numeric" value={total} onChangeText={setTotal} />
        <View style={styles.btnRow}>
          {[10, 15, 20].map((p) => (
            <TouchableOpacity key={p} style={[styles.pctBtn, porcentaje === p && styles.pctBtnActive]} onPress={() => setPorcentaje(p)}>
              <Text style={[styles.pctText, porcentaje === p && styles.pctTextActive]}>{p}%</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.resultBox}>
          <Text style={styles.resultText}>Propina: ${montoPropina}</Text>
          <Text style={styles.resultTotal}>Total: ${totalPagar}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f1f2f6' },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 15, elevation: 4 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 20, fontSize: 16 },
  btnRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  pctBtn: { flex: 1, padding: 10, borderWidth: 1, borderColor: '#3498db', borderRadius: 8, marginHorizontal: 5, alignItems: 'center' },
  pctBtnActive: { backgroundColor: '#3498db' },
  pctText: { color: '#3498db', fontWeight: 'bold' },
  pctTextActive: { color: '#fff' },
  resultBox: { marginTop: 10, padding: 15, backgroundColor: '#f8f9fa', borderRadius: 8, alignItems: 'center' },
  resultText: { fontSize: 18, color: '#7f8c8d', marginBottom: 5 },
  resultTotal: { fontSize: 24, fontWeight: 'bold', color: '#2c3e50' }
});