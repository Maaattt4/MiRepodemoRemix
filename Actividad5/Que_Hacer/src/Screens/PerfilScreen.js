import React, { useContext } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { TareasContext } from '../Context/TareasContext';

const { width } = Dimensions.get('window');

export default function PerfilScreen() {
  const { datos, setIsLoggedIn } = useContext(TareasContext);

  const totalTareas = datos.find(s => s.title === 'Tareas')?.data?.length || 0;
  const totalHabitos = datos.find(s => s.title === 'Hábitos')?.data?.length || 0;

  return (
    <View style={styles.container}>
      <View style={styles.headerBackground}>
        <Image style={styles.profileFoto} source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }} />
        <Text style={styles.userName}>Gibran Razo</Text>
        <Text style={styles.userBio}>Productividad y Organización</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Feather name="check-square" size={24} color="#DFD0B8" marginBottom={8} />
          <Text style={styles.statNumber}>{totalTareas}</Text>
          <Text style={styles.statLabel}>Tareas</Text>
        </View>
        <View style={styles.statCard}>
          <Feather name="refresh-cw" size={24} color="#DFD0B8" marginBottom={8} />
          <Text style={styles.statNumber}>{totalHabitos}</Text>
          <Text style={styles.statLabel}>Hábitos</Text>
        </View>
        <View style={styles.statCard}>
          <Feather name="bar-chart-2" size={24} color="#DFD0B8" marginBottom={8} />
          <Text style={styles.statNumber}>{totalTareas + totalHabitos}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={() => setIsLoggedIn(false)}>
          <Ionicons name="log-out-outline" size={22} color="#DFD0B8" />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#222831' },
  headerBackground: { width: width, paddingVertical: 40, alignItems: 'center', backgroundColor: '#393E46', borderBottomLeftRadius: 30, borderBottomRightRadius: 30, marginBottom: 30, elevation: 5 },
  profileFoto: { width: 110, height: 110, borderRadius: 55, borderWidth: 3, borderColor: '#DFD0B8', backgroundColor: '#222831' },
  userName: { fontSize: 26, fontWeight: 'bold', marginTop: 15, color: '#DFD0B8' },
  userBio: { fontSize: 16, color: '#948979', marginTop: 5 },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-around', marginHorizontal: 15, marginBottom: 40 },
  statCard: { backgroundColor: '#393E46', padding: 20, borderRadius: 20, alignItems: 'center', width: '30%', elevation: 3 },
  statNumber: { fontSize: 24, fontWeight: 'bold', color: '#DFD0B8' },
  statLabel: { fontSize: 13, color: '#948979', marginTop: 5, textTransform: 'uppercase', fontWeight: '600' },
  actionsContainer: { paddingHorizontal: 20 },
  actionButton: { backgroundColor: '#393E46', padding: 18, borderRadius: 15, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, borderWidth: 1, borderColor: '#948979' },
  logoutText: { fontSize: 16, fontWeight: 'bold', color: '#DFD0B8' }
});