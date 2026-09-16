import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Pedometer } from 'expo-sensors';

export default function PodometerSensor() {
    const [pasos, setPasos] = useState(0);
    const [disponible, setDisponible] = useState(false);

    useEffect(() => {
        let suscripcion = null;
        let isMounted = true;

        const iniciar = async () => {
            // 1. Comprobar la disponibilidad del sensor
            const esDisponible = await Pedometer.isAvailableAsync();
            
            if (isMounted) {
                setDisponible(esDisponible);
            }

            // 2. Iniciar la suscripción si está disponible
            if (esDisponible && isMounted) {
                suscripcion = Pedometer.watchStepCount(resultado => {
                    setPasos(resultado.steps);
                });
            }
        };

        iniciar();

        // 3. Cancelar la suscripción al desmontar
        return () => {
            isMounted = false;
            if (suscripcion) {
                suscripcion.remove();
            }
        };
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Podómetro</Text>

            <View>
                <Text style={styles.title}>
                    Disponible: {disponible ? "SÍ" : "NO"}
                </Text>
            </View>            

            <View style={styles.card}>
                <Text style={styles.axis}>Pasos:</Text>
                <Text style={styles.value}>{pasos}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 25,
        backgroundColor: '#808080',
        width: '100%',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#dc1212',
    },
    card: {
        backgroundColor: '#fff',
        padding: 20,
        marginBottom: 15,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
    },
    axis: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#256734"
    },
    value: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#7b0a73"
    },
});