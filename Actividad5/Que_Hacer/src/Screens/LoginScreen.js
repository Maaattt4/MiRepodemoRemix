import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { TareasContext } from '../Context/TareasContext';

export default function LoginScreen() {
  const { setIsLoggedIn } = useContext(TareasContext);
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [verPassword, setVerPassword] = useState(false);

  const handleLogin = () => {
    if (correo.toLowerCase().trim() === 'ejemplo@gmail.com' && password === 'contrasena1') {
      setError('');
      setIsLoggedIn(true);
    } else {
      setError('Correo o contraseña incorrectos');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Ionicons name="layers" size={60} color="#DFD0B8" style={{ marginBottom: 15 }} />
        <Text style={styles.title}>¿Qué hacer?</Text>
        
        <View style={styles.inputContainer}>
          <Feather name="mail" size={20} color="#948979" style={styles.icon} />
          <TextInput style={styles.input} placeholder="ejemplo@gmail.com" placeholderTextColor="#948979" value={correo} onChangeText={setCorreo} autoCapitalize="none" keyboardType="email-address" />
        </View>
        
        <View style={styles.inputContainer}>
          <Feather name="lock" size={20} color="#948979" style={styles.icon} />
          <TextInput style={styles.input} placeholder="Contraseña" placeholderTextColor="#948979" value={password} onChangeText={setPassword} secureTextEntry={!verPassword} />
          <TouchableOpacity onPress={() => setVerPassword(!verPassword)}>
            <Feather name={verPassword ? "eye" : "eye-off"} size={20} color="#948979" />
          </TouchableOpacity>
        </View>
        
        {error ? <Text style={styles.errorText}><Feather name="alert-circle" size={14} /> {error}</Text> : null}
        
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
          <Feather name="arrow-right" size={20} color="#222831" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#222831', justifyContent: 'center', alignItems: 'center' },
  card: { width: '85%', backgroundColor: '#393E46', borderRadius: 25, padding: 35, alignItems: 'center', elevation: 8, borderWidth: 1, borderColor: '#948979' },
  title: { fontSize: 32, fontWeight: 'bold', color: '#DFD0B8', marginBottom: 35, letterSpacing: 1 },
  inputContainer: { width: '100%', flexDirection: 'row', alignItems: 'center', backgroundColor: '#222831', borderRadius: 12, paddingHorizontal: 15, marginBottom: 20, borderWidth: 1, borderColor: '#948979' },
  icon: { marginRight: 10 },
  input: { flex: 1, height: 55, color: '#DFD0B8', fontSize: 16 },
  errorText: { color: '#DFD0B8', backgroundColor: 'rgba(165, 70, 70, 0.8)', padding: 10, borderRadius: 8, marginBottom: 15, width: '100%', textAlign: 'center', overflow: 'hidden' },
  button: { width: '100%', backgroundColor: '#DFD0B8', paddingVertical: 16, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, marginTop: 10 },
  buttonText: { color: '#222831', fontSize: 18, fontWeight: 'bold' },
});