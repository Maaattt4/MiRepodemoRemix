import React from 'react';
import { View, Button } from 'react-native';


export default function HomeScreen({ navigation }) {
    return (
        <View style={{ flex: 1, alignItems: 'center', padding: 20 }}>
            <Button title="Calculadora IMC" onPress={() => navigation.navigate('IMC')} />
            <Button title="Calculadora Divisas" onPress={() => navigation.navigate('Currency')} />
            <Button title="Calculadora de Propinas" onPress={() => navigation.navigate('Tip')} />
        </View>
    );
}
