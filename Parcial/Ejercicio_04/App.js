import React from 'react';
import {View, Text, Modal, StyleSheet, Button, SafeAreaView, TextInput} from 'react-native';
import CustomModal from './componentes/CustomModal';

export default function App() {
    const [modalVisible, setModalVisible] = React.useState(false);
    const [texto, setTexto] = React.useState('');
    const objetoContenido = { valor: texto };

    return (
        <SafeAreaView style={styles.container}>
            <View>
                <TextInput
                    style={styles.input}
                    placeholder="Escribe un texto"
                    value={texto}
                    onChangeText={setTexto}
                />
                <CustomModal
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    contenido={objetoContenido}
                />
                <Button
                    title="Mostrar Modal"
                    onPress={() => setModalVisible(true)}
                />
                
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        width: 250,
        borderWidth: 1,
        borderColor: '#999',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
});