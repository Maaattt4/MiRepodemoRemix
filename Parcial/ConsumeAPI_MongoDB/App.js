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
  TextInput,
} from 'react-native';

export default function App() {
  // ----------------------------------------------------
  // ESTADOS DE LOGIN
  // ----------------------------------------------------
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // ----------------------------------------------------
  // ESTADOS DE PELÍCULAS
  // ----------------------------------------------------
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  // Función para manejar el inicio de sesión
  const handleLogin = () => {
    // Aquí validas tu usuario (puedes cambiar "admin" y "1234")
    if (username === 'admin' && password === '1234') {
      setLoginError('');
      setIsLoggedIn(true);
      fetchMovies(); // Cargamos las películas solo si inicia sesión
    } else {
      setLoginError('Usuario o contraseña incorrectos');
    }
  };

  // Función para obtener las películas
  const fetchMovies = () => {
    setLoading(true);
    fetch('http://localhost:4000/movies') // Recuerda usar tu IP si estás en celular físico
      .then((res) => res.json())
      .then((data) => {
        setMovies(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };

  // Función para abrir el modal
  const openModal = (movie) => {
    setSelectedMovie(movie);
    setModalVisible(true);
  };

  // ----------------------------------------------------
  // PANTALLA DE LOGIN
  // ----------------------------------------------------
  if (!isLoggedIn) {
    return (
      <View style={styles.loginContainer}>
        <View style={styles.loginCard}>
          <Text style={styles.loginTitle}>Bienvenido</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Usuario"
            placeholderTextColor="#888"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor="#888"
            value={password}
            onChangeText={setPassword}
            secureTextEntry // Oculta los caracteres
          />

          {loginError ? <Text style={styles.errorText}>{loginError}</Text> : null}

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Ingresar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ----------------------------------------------------
  // PANTALLA PRINCIPAL (PELÍCULAS)
  // ----------------------------------------------------
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0446ed" />
      </View>
    );
  }

  const renderItem = ({ item }) => (
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
        <Text style={styles.title}>{item.title || item.titulo || item.name || "Sin título"}</Text>
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
                <Text style={styles.modalTitle}>
                  {selectedMovie.title || selectedMovie.titulo || "Sin título"}
                </Text>
                <Text style={styles.modalPlot}>
                  {selectedMovie.fullplot || "Sin descripción"}
                </Text>
                
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
  // Estilos del Login
  loginContainer: {
    flex: 1,
    backgroundColor: '#0446ed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginCard: {
    width: '85%',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  loginTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  errorText: {
    color: 'red',
    marginBottom: 15,
    fontSize: 14,
  },
  loginButton: {
    width: '100%',
    backgroundColor: '#0446ed',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },

  // Estilos de la App (Películas)
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