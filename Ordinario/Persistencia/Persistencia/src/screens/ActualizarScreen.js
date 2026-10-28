import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../../supabase';

export default function ActualizarScreen() {
  const [productos, setProductos] = useState([]);
  const [idSeleccionado, setIdSeleccionado] = useState(null);
  
  const [producto, setProducto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');

  const cargarDatos = async () => {
    const { data } = await supabase.from('Productos').select('*').order('id', { ascending: false });
    setProductos(data || []);
  };

  useFocusEffect(useCallback(() => { cargarDatos(); setIdSeleccionado(null); }, []));

  const seleccionar = (item) => {
    setIdSeleccionado(item.id);
    setProducto(item.producto);
    setDescripcion(item.descripcion || '');
    setPrecio(item.precio.toString());
  };

  const modificarRegistro = async () => {
    const { error } = await supabase
      .from('Productos')
      .update({ producto, descripcion, precio: parseFloat(precio) })
      .eq('id', idSeleccionado);
    
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Éxito', 'Registro actualizado');
      setIdSeleccionado(null);
      cargarDatos();
    }
  };

  return (
    <View style={styles.container}>
      {idSeleccionado ? (
        <View style={styles.form}>
          <Text style={styles.title}>Modificando producto</Text>
          <TextInput style={styles.input} value={producto} onChangeText={setProducto} />
          <TextInput style={styles.input} value={descripcion} onChangeText={setDescripcion} />
          <TextInput style={styles.input} value={precio} onChangeText={setPrecio} keyboardType="numeric" />
          <View style={styles.botones}>
            <Button title="Cancelar" color="gray" onPress={() => setIdSeleccionado(null)} />
            <Button title="Actualizar" onPress={modificarRegistro} color="#0446ed" />
          </View>
        </View>
      ) : (
        <FlatList
          data={productos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => seleccionar(item)}>
              <Text style={styles.titulo}>{item.producto}</Text>
              <Text style={{ color: 'orange', marginTop: 5 }}>✏️ Toca para editar</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  form: { backgroundColor: '#fff', padding: 20, borderRadius: 10, elevation: 3 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 5 },
  card: { padding: 15, backgroundColor: '#fff', marginBottom: 10, borderRadius: 8, elevation: 2 },
  titulo: { fontSize: 18, fontWeight: 'bold' },
  botones: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }
});