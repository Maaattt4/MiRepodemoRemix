import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../../supabase';

export default function ConsultarScreen() {
  const [productos, setProductos] = useState([]);

  // Se ejecuta cada vez que el usuario entra a esta pestaña
  useFocusEffect(
    useCallback(() => {
      const cargarDatos = async () => {
        const { data, error } = await supabase.from('Productos').select('*').order('id', { ascending: false });
        if (!error) setProductos(data);
      };
      cargarDatos();
    }, [])
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={productos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.titulo}>{item.producto}</Text>
            <Text style={styles.desc}>{item.descripcion}</Text>
            <Text style={styles.precio}>${item.precio}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  card: { padding: 15, backgroundColor: '#fff', marginBottom: 10, borderRadius: 8, elevation: 3 },
  titulo: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  desc: { color: 'gray', marginTop: 4 },
  precio: { color: '#0446ed', fontWeight: 'bold', marginTop: 8, fontSize: 16 }
});