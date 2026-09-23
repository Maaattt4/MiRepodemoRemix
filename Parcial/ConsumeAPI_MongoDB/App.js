import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

export default function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para el Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    fetch('http://localhost:4000/movies')
      .then((res) => res.json())
      .then((data) => {
        setMovies(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0446ed" />
      </View>
    );
  }

  // Función para abrir el modal con la info de la película
  const openModal = (movie) => {
    setSelectedMovie(movie);
    setModalVisible(true);
  };

  const renderItem = ({ item }) => (
    // Cambiamos View por TouchableOpacity para que reaccione al toque
    <TouchableOpacity 
      style={styles.card} 
      activeOpacity={0.7} 
      onPress={() => openModal(item)}
    >
      {item.poster ? (
        <Image source={{ uri: item.poster }} style={styles.poster} />
      ) : (
        <View style={[styles.poster, styles.noposter]}>
          <Text>No Image</Text>
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.title}>{item.title || "Sin título"}</Text>
        <Text style={styles.plot} numberOfLines={3}>
          {item.fullplot || "Sin descripción"}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={movies}
        keyExtractor={(item, index) => String(item._id || item.id || index)}
        renderItem={renderItem}
      />

      {/* Modal para mostrar detalles */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedMovie && (
              <ScrollView showsVerticalScrollIndicator={false}>
                {selectedMovie.poster ? (
                  <Image source={{ uri: selectedMovie.poster }} style={styles.modalPoster} />
                ) : (
                  <View style={[styles.modalPoster, styles.noposter]}>
                    <Text>No Image</Text>
                  </View>
                )}
                <Text style={styles.modalTitle}>{selectedMovie.title || "Sin título"}</Text>
                <Text style={styles.modalPlot}>{selectedMovie.fullplot || "Sin descripción"}</Text>
                
                <TouchableOpacity 
                  style={styles.closeButton} 
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>Cerrar Detalles</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: '#f5f5f5',
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    flexDirection: "row",
    padding: 20,
    margin: 10,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  poster: {
    width: 100,
    height: 140,
    borderRadius: 10,
  },
  noposter: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ddd",
  },
  info: {
    flex: 1,
    marginLeft: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10, 
    color: '#333333',
  },
  plot: {
    fontSize: 12,
    color: "gray",
  },
  // Estilos del Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  modalPoster: {
    width: 200,
    height: 300,
    borderRadius: 15,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
    marginBottom: 15,
  },
  modalPlot: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
    textAlign: 'justify',
    marginBottom: 25,
  },
  closeButton: {
    backgroundColor: '#0446ed',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});