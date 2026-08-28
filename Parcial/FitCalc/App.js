
import { StyleSheet, Text, View,TextInput, Button } from 'react-native';
import React from 'react';
import CustomModal from './Componentes/Modal';


export default function App() {
    
    const [peso, setPeso] = React.useState('');
    const [altura, setAltura] = React.useState('');
    const [modalVisible, setModalVisible] = React.useState(false);
    const [ResultadoIMC, setResultadoIMC] = React.useState('');

    const calcularIMC = () => {
        const pesoKg = parseFloat(peso);
        const alturaMetros = parseFloat(altura) / 100;

        if (pesoKg > 0 && alturaMetros > 0) {
            setResultadoIMC((pesoKg / (alturaMetros * alturaMetros)).toFixed(2));
            setModalVisible(true);
        }
    };

    
    
    

    return (
    
    <View style={styles.Input1}>
    <Text> Peso (kg)</Text>
    <TextInput
        style={styles.input}
        placeholder="Escribe tu peso"
        value={peso}
        onChangeText={setPeso}
        />
    <Text style={styles.alturaLabel}>Altura (cm)</Text>
    <TextInput
        style={styles.input}
        placeholder="Escribe tu altura"
        value={altura}
        onChangeText={setAltura}
        keyboardType="numeric"
        />

    <CustomModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        contenido={` ${ResultadoIMC}`}
    />
    <Button
        title="Calcular IMC"
        onPress={calcularIMC}
        />
    
        
    </View>
    

    );
}

const styles = StyleSheet.create({
    Input1: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 200,
    },
    
    input: {
        width: 250,
        borderWidth: 1,
        borderColor: '#999',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    alturaLabel: {
        marginTop: 20,
    },
});
