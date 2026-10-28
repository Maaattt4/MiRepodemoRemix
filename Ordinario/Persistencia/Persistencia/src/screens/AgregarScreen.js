import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { supabase } from '../../supabase';

export default function AgregarScreen() {
  const [producto, setProducto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');

  const guardarRegistro = async () => {
    if (!producto || !precio) {
      Alert.alert('Error', 'El nombre y el precio son obligatorios');
      return;
    }

    // Insertar en Supabase
    const { error } = await supabase
      .from('Productos')
      .insert([{ producto, descripcion, precio: parseFloat(precio) }]);
    
    if (error) {
      Alert.alert('Error al guardar', error.message);
    } else {
      Alert.alert('Éxito', 'Producto registrado correctamente 🚀');
      setProducto('');
      setDescripcion('');
      setPrecio('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nuevo Producto</Text>
      <TextInput style={styles.input} placeholder="Nombre del producto" value={producto} onChangeText={setProducto} />
      <TextInput style={styles.input} placeholder="Descripción" value={descripcion} onChangeText={setDescripcion} />
      <TextInput style={styles.input} placeholder="Precio" value={precio} onChangeText={setPrecio} keyboardType="numeric" />
      <Button title="Guardar en Supabase" onPress={guardarRegistro} color="#0446ed" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ccc', padding: 12, marginBottom: 15, borderRadius: 8 }
});