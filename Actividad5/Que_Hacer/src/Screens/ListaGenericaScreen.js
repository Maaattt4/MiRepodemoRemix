import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, SectionList } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons, Feather } from '@expo/vector-icons';
import { TareasContext } from '../Context/TareasContext';

export default function ListaGenericaScreen({ route }) {
  const { nombreLista } = route.params || { nombreLista: 'Tareas' };
  const { datos, setDatos } = useContext(TareasContext);

  const seccionActual = datos.find(s => s.title === nombreLista) || { data: [] };
  const tareasFiltradas = seccionActual.data;

  const porHacer = tareasFiltradas.filter(t => !t.hecha);
  const hechas = tareasFiltradas.filter(t => t.hecha);

  const secciones = [
    { title: 'Por hacer', data: porHacer },
    { title: 'Completadas', data: hechas }
  ].filter(s => s.data.length > 0);

  const [modalVisible, setModalVisible] = useState(false);
  const [itemEditando, setItemEditando] = useState(null);
  const [nuevoTitulo, setNuevoTitulo] = useState('');
  const [esImportante, setEsImportante] = useState(false);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
  const [horaSeleccionada, setHoraSeleccionada] = useState(new Date());
  const [mostrarCalendario, setMostrarCalendario] = useState(false);
  const [mostrarReloj, setMostrarReloj] = useState(false);
  const [textoFecha, setTextoFecha] = useState('');
  const [textoHora, setTextoHora] = useState('');

  const abrirEdicion = (item) => {
    setItemEditando(item);
    setNuevoTitulo(item.nombre);
    setEsImportante(item.importante);
    setTextoFecha(item.fecha || '');
    setTextoHora(item.hora || '');
    setModalVisible(true);
  };

  const abrirCreacion = () => {
    setItemEditando(null);
    setNuevoTitulo('');
    setEsImportante(false);
    setTextoFecha('');
    setTextoHora('');
    setModalVisible(true);
  };

  const guardarElemento = () => {
    if (nuevoTitulo.trim() === '') return;
    setDatos(datosActuales => {
      const nuevosDatos = [...datosActuales];
      const indice = nuevosDatos.findIndex(s => s.title === nombreLista);

      if (itemEditando) {
        if (indice >= 0) {
          const i = nuevosDatos[indice].data.findIndex(x => x.id === itemEditando.id);
          if (i >= 0) nuevosDatos[indice].data[i] = { ...itemEditando, nombre: nuevoTitulo, importante: esImportante, fecha: textoFecha, hora: textoHora };
        }
      } else {
        const nuevo = { id: Math.random().toString(), nombre: nuevoTitulo, importante: esImportante, fecha: textoFecha, hora: textoHora, hecha: false };
        if (indice >= 0) nuevosDatos[indice].data.push(nuevo);
        else nuevosDatos.push({ title: nombreLista, data: [nuevo] });
      }
      return nuevosDatos;
    });
    setModalVisible(false);
  };

  const toggleHecha = (id) => {
    setDatos(datosActuales => {
      const nuevosDatos = [...datosActuales];
      nuevosDatos.forEach(sec => sec.data.forEach(item => {
        if (item.id === id) {
          if (!item.hecha) {
            item.fueImportante = item.importante;
            item.importante = false;
          } else if (item.fueImportante) {
            item.importante = true;
          }
          item.hecha = !item.hecha;
        }
      }));
      return nuevosDatos;
    });
  };

  const toggleImportante = (id) => {
    setDatos(datosActuales => {
      const nuevosDatos = [...datosActuales];
      nuevosDatos.forEach(sec => sec.data.forEach(item => {
        if (item.id === id) item.importante = !item.importante;
      }));
      return nuevosDatos;
    });
  };

  const eliminarElemento = (id) => {
    setDatos(datosActuales => {
      const nuevosDatos = [...datosActuales];
      const i = nuevosDatos.findIndex(s => s.title === nombreLista);
      if (i >= 0) nuevosDatos[i].data = nuevosDatos[i].data.filter(item => item.id !== id);
      return nuevosDatos;
    });
  };

  const renderRightActions = (id) => (
    <TouchableOpacity style={styles.deleteButton} onPress={() => eliminarElemento(id)}>
      <Ionicons name="trash-outline" size={24} color="#FFF" />
    </TouchableOpacity>
  );

  const renderItem = ({ item }) => (
    <Swipeable renderRightActions={() => renderRightActions(item.id)}>
      <View style={[styles.card, item.hecha && styles.cardHecha]}>
        
        <TouchableOpacity style={styles.checkbox} onPress={() => toggleHecha(item.id)}>
          <Ionicons name={item.hecha ? "checkmark-circle" : "ellipse-outline"} size={28} color={item.hecha ? '#948979' : '#DFD0B8'} />
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.7} style={{ flex: 1 }} onPress={() => abrirEdicion(item)}>
          <Text style={[styles.itemText, item.hecha && styles.textHecha]}>{item.nombre}</Text>
          <View style={styles.tagsContainer}>
            {item.fecha ? <View style={styles.tag}><Feather name="calendar" size={12} color="#948979" /><Text style={styles.tagText}>{item.fecha}</Text></View> : null}
            {item.hora ? <View style={styles.tag}><Feather name="clock" size={12} color="#948979" /><Text style={styles.tagText}>{item.hora}</Text></View> : null}
          </View>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.7} onPress={() => toggleImportante(item.id)}>
          <Ionicons name={item.importante ? "star" : "star-outline"} size={26} color={item.importante ? "#DFD0B8" : "#948979"} />
        </TouchableOpacity>
      </View>
    </Swipeable>
  );

  return (
    <SafeAreaView style={styles.container}>
      {tareasFiltradas.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Feather name="inbox" size={60} color="#393E46" />
          <Text style={styles.emptyText}>Lista vacía. ¡Agrega tu primer elemento!</Text>
        </View>
      ) : (
        <SectionList
          sections={secciones}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.sectionHeader}>{title}</Text>
          )}
          contentContainerStyle={{ paddingBottom: 100 }} 
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={abrirCreacion}>
        <Feather name="plus" size={32} color="#222831" />
      </TouchableOpacity>

      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>{itemEditando ? 'Editar Elemento' : 'Nuevo Elemento'}</Text>

            <TextInput style={styles.input} placeholder="¿Qué necesitas hacer?" placeholderTextColor="#948979" value={nuevoTitulo} onChangeText={setNuevoTitulo} />

            <TouchableOpacity style={styles.inputSelector} onPress={() => setMostrarCalendario(true)}>
              <Feather name="calendar" size={18} color={textoFecha ? '#FFFFFF' : '#948979'} />
              <Text style={{ color: textoFecha ? '#FFFFFF' : '#948979', marginLeft: 10 }}>{textoFecha || 'Elegir Fecha'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.inputSelector} onPress={() => setMostrarReloj(true)}>
              <Feather name="clock" size={18} color={textoHora ? '#FFFFFF' : '#948979'} />
              <Text style={{ color: textoHora ? '#FFFFFF' : '#948979', marginLeft: 10 }}>{textoHora || 'Elegir Hora'}</Text>
            </TouchableOpacity>

            {mostrarCalendario && <DateTimePicker value={fechaSeleccionada} mode="date" display="default" onValueChange={(e, d) => { setMostrarCalendario(false); if(d) { setFechaSeleccionada(d); setTextoFecha(d.toLocaleDateString()); } }} />}
            {mostrarReloj && <DateTimePicker value={horaSeleccionada} mode="time" display="default" onValueChange={(e, d) => { setMostrarReloj(false); if(d) { setHoraSeleccionada(d); setTextoHora(d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})); } }} />}

            <TouchableOpacity style={[styles.inputSelector, {justifyContent: 'center'}]} onPress={() => setEsImportante(!esImportante)}>
              <Ionicons name={esImportante ? "star" : "star-outline"} size={20} color={esImportante ? "#DFD0B8" : "#948979"} />
              <Text style={{ color: esImportante ? '#DFD0B8' : '#948979', marginLeft: 10, fontWeight: 'bold' }}>Marcar como Importante</Text>
            </TouchableOpacity>

            <View style={styles.botonesModal}>
              <TouchableOpacity style={styles.btnCancelar} onPress={() => setModalVisible(false)}>
                <Text style={styles.btnTextCancelar}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnGuardar} onPress={guardarElemento}>
                <Text style={styles.btnTextGuardar}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#222831' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { textAlign: 'center', marginTop: 15, fontSize: 16, color: '#948979' },
  sectionHeader: { fontSize: 14, fontWeight: 'bold', color: '#948979', marginTop: 20, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 },
  card: { backgroundColor: '#393E46', padding: 18, borderRadius: 15, marginBottom: 12, flexDirection: 'row', alignItems: 'center', elevation: 2 },
  cardHecha: { backgroundColor: '#2C3139', opacity: 0.7 },
  checkbox: { marginRight: 15 },
  itemText: { fontSize: 17, fontWeight: '600', color: '#DFD0B8', marginBottom: 4 },
  textHecha: { textDecorationLine: 'line-through', color: '#948979' },
  tagsContainer: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  tag: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  tagText: { fontSize: 12, color: '#948979' },
  deleteButton: { backgroundColor: '#A54646', justifyContent: 'center', alignItems: 'center', width: 70, borderRadius: 15, marginBottom: 12, marginLeft: 10 },
  fab: { position: 'absolute', bottom: 30, right: 20, backgroundColor: '#DFD0B8', width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', elevation: 6 },
  centeredView: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(34, 40, 49, 0.9)' },
  modalView: { width: '100%', backgroundColor: '#222831', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 30, elevation: 10, borderWidth: 1, borderColor: '#393E46' },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#DFD0B8' },
  input: { width: '100%', backgroundColor: '#393E46', borderRadius: 12, padding: 15, marginBottom: 15, color: '#DFD0B8', fontSize: 16 },
  inputSelector: { width: '100%', flexDirection: 'row', alignItems: 'center', backgroundColor: '#393E46', borderRadius: 12, padding: 15, marginBottom: 15 },
  botonesModal: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, gap: 15 },
  btnCancelar: { flex: 1, padding: 15, borderRadius: 12, backgroundColor: '#393E46', alignItems: 'center' },
  btnGuardar: { flex: 1, padding: 15, borderRadius: 12, backgroundColor: '#DFD0B8', alignItems: 'center' },
  btnTextCancelar: { color: '#948979', fontWeight: 'bold', fontSize: 16 },
  btnTextGuardar: { color: '#222831', fontWeight: 'bold', fontSize: 16 }
});