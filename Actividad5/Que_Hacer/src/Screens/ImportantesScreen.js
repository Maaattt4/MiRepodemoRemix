import React, { useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

// Importamos el mismo contexto global
import { TareasContext } from '../Context/TareasContext';

export default function ImportantesScreen() {
  // Extraemos la base de datos global
  const { datos, setDatos } = useContext(TareasContext);

  // Filtramos todas las tareas y hábitos que tengan "importante: true"
  const tareasImportantes = datos
    .flatMap(seccion => seccion.data) // Une tareas y hábitos en una sola lista
    .filter(item => item.importante); // Solo se queda con las que tienen estrella

  // Permite quitar la estrella desde esta pantalla también
  const toggleImportante = (id) => {
    setDatos(datosActuales => {
      const nuevosDatos = [...datosActuales];
      nuevosDatos.forEach(seccion => {
        seccion.data.forEach(item => {
          if (item.id === id) item.importante = !item.importante;
        });
      });
      return nuevosDatos;
    });
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.itemText}>{item.nombre}</Text>
        <Text style={styles.subText}>
          {item.fecha ? `📅 ${item.fecha}` : ''} {item.hora ? `⏰ ${item.hora}` : ''}
        </Text>
      </View>
      <TouchableOpacity activeOpacity={0.7} onPress={() => toggleImportante(item.id)}>
        <Text style={styles.star}>⭐</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Actividades Destacadas</Text>
      
      {tareasImportantes.length === 0 ? (
        <Text style={styles.emptyText}>No tienes actividades importantes marcadas aún. ¡Toca la estrella en tus tareas!</Text>
      ) : (
        <FlatList
          data={tareasImportantes}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1,padding: 20,backgroundColor: '#222831'},
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#948979' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#ffaa00' },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 3, borderWidth: 1, borderColor: '#ffaa00' },
  itemText: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  subText: { fontSize: 14, color: 'gray', marginTop: 4 },
  star: { fontSize: 26 },
});