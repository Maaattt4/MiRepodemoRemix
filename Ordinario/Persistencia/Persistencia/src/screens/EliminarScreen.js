import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../../supabase';

export default function EliminarScreen() {
  const [productos, setProductos] = useState([]);

  const cargarDatos = async () => {
    const { data } = await supabase.from('Productos').select('*').order('id', { ascending: false });
    setProductos(data || []);
  };

  useFocusEffect(useCallback(() => { cargarDatos(); }, []));

  const borrarRegistro = (id, nombre) => {
    Alert.alert("Confirmar Eliminación", `¿Estás seguro que deseas borrar "${nombre}"?`, [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", style: "destructive", onPress: async () => {
          const { error } = await supabase.from('Productos').delete().eq('id', id);
          if (error) Alert.alert("Error", error.message);
          else cargarDatos(); // Recargar tras borrar
        }
      }
    ]);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={productos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.titulo}>{item.producto}</Text>
              <Text style={styles.precio}>${item.precio}</Text>
            </View>
            <Button title="Eliminar" color="red" onPress={() => borrarRegistro(item.id, item.producto)} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  card: { flexDirection: 'row', padding: 15, backgroundColor: '#fff', marginBottom: 10, borderRadius: 8, elevation: 2, alignItems: 'center' },
  titulo: { fontSize: 18, fontWeight: 'bold' },
  precio: { color: 'gray', marginTop: 4 }
});