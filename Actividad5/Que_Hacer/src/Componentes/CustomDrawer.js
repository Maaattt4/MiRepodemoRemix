import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { TareasContext } from '../Context/TareasContext';

export default function CustomDrawer(props) {
  const { listasPersonalizadas, setListasPersonalizadas, datos, setDatos } = useContext(TareasContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [nuevaLista, setNuevaLista] = useState('');

  const agregarLista = () => {
    if (nuevaLista.trim() === '') return;
    setListasPersonalizadas([...listasPersonalizadas, nuevaLista]);
    setNuevaLista('');
    setModalVisible(false);
  };

  // Función para confirmar y eliminar la lista
  const eliminarLista = (nombreListaEliminar) => {
    Alert.alert(
      "Eliminar lista",
      `¿Estás seguro de que deseas eliminar la lista "${nombreListaEliminar}" y todas sus tareas?`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Eliminar", 
          style: "destructive",
          onPress: () => {
            // 1. Quitarla del menú lateral
            setListasPersonalizadas(listasPersonalizadas.filter(lista => lista !== nombreListaEliminar));
            
            // 2. Eliminar todas sus tareas del contexto
            setDatos(datosActuales => datosActuales.filter(seccion => seccion.title !== nombreListaEliminar));

            // 3. Si estábamos viendo esa lista, regresar a "Tareas" por seguridad
            const rutaActual = props.state.routes[props.state.index].name;
            const paramsActuales = props.state.routes[props.state.index].params;
            
            if (rutaActual === 'ListaGenerica' && paramsActuales?.nombreLista === nombreListaEliminar) {
              props.navigation.navigate('Tareas');
            }
          } 
        }
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#222831' }}>
      <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 0 }}>
        
        <View style={styles.perfilContainer}>
          <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }} style={styles.fotoPerfil} />
          <Text style={styles.nombrePerfil}>Gibran Razo</Text>
        </View>

        <View style={styles.divider} />

        <DrawerItemList {...props} />

        <View style={styles.divider} />
        <Text style={styles.seccionTitulo}>TUS LISTAS</Text>

        {listasPersonalizadas.map((lista, index) => (
          <View key={index} style={styles.listaPersonalizadaContainer}>
            {/* El botón de la lista que ocupa el 85% del espacio */}
            <View style={{ flex: 1 }}>
              <DrawerItem
                label={lista}
                labelStyle={{ color: '#DFD0B8', fontSize: 16, marginLeft: -15 }}
                icon={({color}) => <Feather name="folder" size={20} color={color} />}
                inactiveTintColor="#948979"
                activeTintColor="#ffffff"
                onPress={() => props.navigation.navigate('ListaGenerica', { nombreLista: lista })}
              />
            </View>
            
            {/* El botón de la basura alineado a la derecha */}
            <TouchableOpacity 
              style={styles.deleteListButton} 
              onPress={() => eliminarLista(lista)}
            >
              <Ionicons name="trash-outline" size={20} color="#948979" />
            </TouchableOpacity>
          </View>
        ))}
      </DrawerContentScrollView>

      <TouchableOpacity style={styles.botonAgregar} onPress={() => setModalVisible(true)}>
        <Feather name="plus-circle" size={20} color="#DFD0B8" />
        <Text style={styles.textoAgregar}>Nueva lista</Text>
      </TouchableOpacity>

      <Modal animationType="fade" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Crear nueva lista</Text>
            <TextInput style={styles.input} placeholder="Ej. Compras, Escuela..." placeholderTextColor="#948979" value={nuevaLista} onChangeText={setNuevaLista} />
            <View style={{ flexDirection: 'row', gap: 15, width: '100%' }}>
              <TouchableOpacity style={styles.btnCancelar} onPress={() => setModalVisible(false)}><Text style={styles.btnText}>Cancelar</Text></TouchableOpacity>
              <TouchableOpacity style={styles.btnAgregar} onPress={agregarLista}><Text style={[styles.btnText, {color: '#222831'}]}>Agregar</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  perfilContainer: { paddingTop: 40, paddingBottom: 25, backgroundColor: '#222831', alignItems: 'center' },
  fotoPerfil: { width: 90, height: 90, borderRadius: 45, borderWidth: 3, borderColor: '#393E46' },
  nombrePerfil: { color: '#DFD0B8', fontSize: 20, fontWeight: 'bold', marginTop: 15 },
  divider: { height: 1, backgroundColor: '#393E46', marginHorizontal: 20, marginVertical: 10 },
  seccionTitulo: { color: '#948979', fontSize: 12, fontWeight: 'bold', marginLeft: 20, marginTop: 10, marginBottom: 5, letterSpacing: 1 },
  
  /* NUEVOS ESTILOS PARA LA ELIMINACIÓN DE LISTAS */
  listaPersonalizadaContainer: { flexDirection: 'row', alignItems: 'center', paddingRight: 15 },
  deleteListButton: { padding: 10 },
  /* --------------------------------------------- */
  
  botonAgregar: { padding: 20, borderTopWidth: 1, borderColor: '#393E46', backgroundColor: '#222831', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  textoAgregar: { fontSize: 16, color: '#DFD0B8', fontWeight: 'bold' },
  centeredView: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(34, 40, 49, 0.85)' },
  modalView: { width: '85%', backgroundColor: '#222831', borderRadius: 20, padding: 25, alignItems: 'center', elevation: 5, borderWidth: 1, borderColor: '#393E46' },
  modalText: { fontSize: 18, fontWeight: 'bold', marginBottom: 20, color: '#DFD0B8' },
  input: { width: '100%', backgroundColor: '#393E46', borderRadius: 10, padding: 15, marginBottom: 20, color: '#DFD0B8' },
  btnCancelar: { flex: 1, padding: 15, backgroundColor: '#393E46', borderRadius: 10, alignItems: 'center' },
  btnAgregar: { flex: 1, padding: 15, backgroundColor: '#DFD0B8', borderRadius: 10, alignItems: 'center' },
  btnText: { color: '#948979', fontWeight: 'bold', fontSize: 16 }
});