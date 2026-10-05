import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, SectionList, TouchableOpacity, Modal, Button, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TareasContext } from '../Context/TareasContext';

export default function TareasHabitosScreen() {
  const [busqueda, setBusqueda] = useState('');
  const { datos, setDatos } = useContext(TareasContext);

  const [modalVisible, setModalVisible] = useState(false);
  const [nuevoTitulo, setNuevoTitulo] = useState('');
  const [esImportante, setEsImportante] = useState(false);
  const [esHabito, setEsHabito] = useState(false);

  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
  const [horaSeleccionada, setHoraSeleccionada] = useState(new Date());
  const [mostrarCalendario, setMostrarCalendario] = useState(false);
  const [mostrarReloj, setMostrarReloj] = useState(false);
  const [textoFecha, setTextoFecha] = useState('');
  const [textoHora, setTextoHora] = useState('');

  const onValueChangeFecha = (event, selectedDate) => {
    setMostrarCalendario(false);
    if (selectedDate) {
      setFechaSeleccionada(selectedDate);
      setTextoFecha(selectedDate.toLocaleDateString()); 
    }
  };

  const onValueChangeHora = (event, selectedTime) => {
    setMostrarReloj(false);
    if (selectedTime) {
      setHoraSeleccionada(selectedTime);
      setTextoHora(selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }
  };

  const guardarElemento = () => {
    if (nuevoTitulo.trim() === '') return;

    // Calcular la fecha y hora de la alarma
    const fechaAlarma = new Date(fechaSeleccionada);
    fechaAlarma.setHours(horaSeleccionada.getHours());
    fechaAlarma.setMinutes(horaSeleccionada.getMinutes());
    fechaAlarma.setSeconds(0);

    const tiempoFaltante = fechaAlarma.getTime() - new Date().getTime();

    // Programar la alerta interna si la fecha es en el futuro
    if (tiempoFaltante > 0) {
      setTimeout(() => {
        Alert.alert(
          esHabito ? "¡Hora de tu hábito! 🔁" : "¡Tarea pendiente! 📝",
          nuevoTitulo
        );
      }, tiempoFaltante);
      Alert.alert("Guardado", "Se mostrará una alerta cuando llegue la hora (mantén la app abierta).");
    } else {
      Alert.alert("Aviso", "La hora elegida ya pasó, la tarea se guardará pero no sonará la alerta.");
    }

    const nuevoItem = {
      id: Math.random().toString(),
      nombre: nuevoTitulo,
      importante: esImportante,
      fecha: textoFecha,
      hora: textoHora,
    };

    setDatos(datosActuales => {
      const nuevosDatos = [...datosActuales];
      if (esHabito) {
        nuevosDatos[1].data.push(nuevoItem);
      } else {
        nuevosDatos[0].data.push(nuevoItem);
      }
      return nuevosDatos;
    });

    setNuevoTitulo('');
    setTextoFecha('');
    setTextoHora('');
    setEsImportante(false);
    setModalVisible(false);
  };

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

  const datosFiltrados = datos.map(seccion => ({
    ...seccion,
    data: seccion.data.filter(item => item.nombre.toLowerCase().includes(busqueda.toLowerCase()))
  })).filter(seccion => seccion.data.length > 0);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.itemText}>{item.nombre}</Text>
        <Text style={styles.subText}>
          {item.fecha ? `📅 ${item.fecha}` : ''} {item.hora ? `⏰ ${item.hora}` : ''}
        </Text>
      </View>
      <TouchableOpacity activeOpacity={0.7} onPress={() => toggleImportante(item.id)}>
        <Text style={styles.star}>{item.importante ? '⭐' : '☆'}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.inputBusqueda}
        placeholder="Buscar tarea o hábito..."
        value={busqueda}
        onChangeText={setBusqueda}
      />

      <SectionList
        sections={datosFiltrados}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.header}>{title}</Text>
        )}
      />

      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Nueva Actividad</Text>
            
            <TextInput style={styles.input} placeholder="¿Qué quieres hacer?" value={nuevoTitulo} onChangeText={setNuevoTitulo} />
            
            <TouchableOpacity style={styles.inputSelector} onPress={() => setMostrarCalendario(true)}>
              <Text style={{ color: textoFecha ? '#000' : '#888' }}>{textoFecha ? `📅 ${textoFecha}` : 'Toca para elegir Fecha'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.inputSelector} onPress={() => setMostrarReloj(true)}>
              <Text style={{ color: textoHora ? '#000' : '#888' }}>{textoHora ? `⏰ ${textoHora}` : 'Toca para elegir Hora'}</Text>
            </TouchableOpacity>

            {mostrarCalendario && (
              <DateTimePicker value={fechaSeleccionada} mode="date" display="default" onValueChange={onValueChangeFecha} onDismiss={() => setMostrarCalendario(false)} />
            )}

            {mostrarReloj && (
              <DateTimePicker value={horaSeleccionada} mode="time" display="default" onValueChange={onValueChangeHora} onDismiss={() => setMostrarReloj(false)} />
            )}

            <View style={styles.opcionesContainer}>
              <TouchableOpacity style={styles.opcionBtn} onPress={() => setEsHabito(!esHabito)}>
                <Text>{esHabito ? '🔁 Es Hábito' : '📝 Es Tarea'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.opcionBtn} onPress={() => setEsImportante(!esImportante)}>
                <Text>{esImportante ? '⭐ Importante' : '☆ Normal'}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.botonesModal}>
              <Button title="Cancelar" color="red" onPress={() => { setModalVisible(false); setTextoFecha(''); setTextoHora(''); }} />
              <Button title="Guardar" onPress={guardarElemento} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  inputBusqueda: { backgroundColor: '#fff', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#ccc', marginBottom: 15 },
  header: { fontSize: 22, fontWeight: 'bold', marginVertical: 10, color: '#333' },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 3 },
  itemText: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  subText: { fontSize: 14, color: 'gray', marginTop: 4 },
  star: { fontSize: 26 },
  fab: { position: 'absolute', bottom: 20, right: 20, backgroundColor: '#0446ed', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 5 },
  fabText: { color: '#fff', fontSize: 30, fontWeight: 'bold' },
  centeredView: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modalView: { width: '90%', backgroundColor: 'white', borderRadius: 15, padding: 25, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 5 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  input: { width: '100%', borderWidth: 1, borderColor: '#999', borderRadius: 5, padding: 10, marginBottom: 10 },
  inputSelector: { width: '100%', borderWidth: 1, borderColor: '#999', borderRadius: 5, padding: 15, marginBottom: 10, backgroundColor: '#f9f9f9' },
  opcionesContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  opcionBtn: { padding: 10, backgroundColor: '#eee', borderRadius: 5 },
  botonesModal: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }
});