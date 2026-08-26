import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, Button, Modal } from 'react-native';

export default function App() {

  const [modal, setModal] = useState(false);
  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modal}
      >
        <View style={styles.containerModal}>
          <View style={styles.viewModal}>
            <Text>Esto esta dentro del modal</Text>
            <Button title="cerrar modal" onPress={() => setModal(false)} />
          </View>
        </View>
      </Modal>
      <Text>Esto esta fuera del modal</Text>
      <Text>Esto esta fuera del modal</Text>
      <Text>Esto esta fuera del modal</Text>
      <Text>Esto esta fuera del modal</Text>
      <Text>Esto esta fuera del modal</Text>
      <Button title="mostrar modal" onPress={() => setModal(true)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerModal: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.45)',
    padding: 20,
  },
  viewModal: {
    backgroundColor: 'rgba(255,255,255,1)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 15,
    
  }
});


