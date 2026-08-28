import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import CustomModal from './Componentes/CustomModal';
const cursos=[
  {id:"1", titulo: "Español", duracion: "45 horas", reating: "3.9"},
  {id:"2", titulo: "Base de datos", duracion: "40 horas", reating: "4.5"},
  {id:"3", titulo: "Matematicas", duracion: "35 horas", reating: "4.0"},
  {id:"4", titulo: "Programación", duracion: "50 horas", reating: "4.8"},
  {id:"5", titulo: "Inglés", duracion: "30 horas", reating: "4.2"}
];

export default function App() {
  const [modalVisible, setModalVisible]= useState(false);
  const [cursoSeleccionado, setcursoSeleccionado] =useState(null);

  const manejaPresionCurso =(tituloCurso) =>{
    setcursoSeleccionado({valor:tituloCurso});
    setModalVisible(true);
  }

  const renderCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => manejaPresionCurso(item.titulo)}
      activeOpacity={0.7}
    >
      <View>
        <Text style={styles.title}>{item.titulo}</Text>
        <Text style={styles.title}>{item.duracion} | {item.reating}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}> Mi lista de cursos </Text>
      <FlatList
        data={cursos}
        renderItem={renderCard}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
      <CustomModal
        visible={modalVisible}
        onClose={()=>setModalVisible(false)}
        contenido={cursoSeleccionado}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',    
  },
  listContainer: {
    paddingHorizontal:16,
    paddingBottom: 16
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    padding: 16,
    color: "black",
  },
  card:{
    backgroundColor: "white",
    padding: 16,
    marginVertical: 8,
    borderRadius: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
    marginBottom: 4,
  },
});
