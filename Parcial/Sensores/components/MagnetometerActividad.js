import { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Magnetometer } from 'expo-sensors';

export default function MagnetometerSensor() {
    const [datos, setDatos] = useState({
        x: 0,
        y: 0,
        z: 0
    });

    useEffect(() => {
        // 1.- Suscribirnos al sensor
        const suscripcion = Magnetometer.addListener(mediciones => {
            setDatos(mediciones);
        });

        // 2.- Definir el intervalo de mediciones (100ms está perfecto para que se sienta fluido)
        Magnetometer.setUpdateInterval(100);

        // 3.- Definir la des-suscripción
        return () => {
            suscripcion.remove();
        }
    }, []);

    // 4.- Calcular la magnitud total del campo magnético
    const magnitud = Math.sqrt(datos.x ** 2 + datos.y ** 2 + datos.z ** 2);
    
    // 5.- Definir un umbral (mayor a 80 μT normalmente significa que hay un imán o metal cerca)
    const detectarMetal = magnitud > 80;

    return (
        // Cambiamos el color de fondo dinámicamente si detecta algo
        <View style={[styles.container, { backgroundColor: detectarMetal ? '#ff4c4c' : '#2c3e50' }]}>
            
            <Text style={[styles.title, { color: detectarMetal ? '#fff' : '#4ecdc4' }]}>
                {detectarMetal ? '¡Objeto Detectado!' : 'Escaneando...'}
            </Text>

            <View style={styles.mainCard}>
                <Text style={styles.mainAxis}>Fuerza Total:</Text>
                <Text style={styles.mainValue}>{magnitud.toFixed(2)} μT</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.axis}>X:</Text>
                <Text style={styles.value}>{datos.x.toFixed(2)}</Text>
            </View>
            <View style={styles.card}>
                <Text style={styles.axis}>Y:</Text>
                <Text style={styles.value}>{datos.y.toFixed(2)}</Text>
            </View>
            <View style={styles.card}>
                <Text style={styles.axis}>Z:</Text>
                <Text style={styles.value}>{datos.z.toFixed(2)}</Text>
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
        // El color de fondo ahora se controla dinámicamente arriba
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
    },
    mainCard: {
        backgroundColor: '#fff',
        padding: 25,
        marginBottom: 30,
        borderRadius: 15,
        alignItems: 'center',
        width: '100%',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
    },
    mainAxis: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#555",
        marginBottom: 10,
    },
    mainValue: {
        fontSize: 36,
        fontWeight: "bold",
        color: "#e74c3c"
    },
    card: {
        backgroundColor: 'rgba(255,255,255,0.9)',
        padding: 15,
        marginBottom: 10,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    axis: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#34495e"
    },
    value: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#2980b9"
    },
});