import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { Gyroscope } from 'expo-sensors';

// Obtenemos el tamaño de la pantalla
const { width, height } = Dimensions.get('window');

export default function GyroscopeSensor() {
    const [datos, setDatos] = useState({ x: 0, y: 0, z: 0 });
    
    // Estados para acumular el movimiento y la rotación
    const [posicion, setPosicion] = useState({ rotacionZ: 0, movX: 0, movY: 0 });

    useEffect(() => {
        Gyroscope.setUpdateInterval(50);

        const suscripcion = Gyroscope.addListener(mediciones => {
            setDatos(mediciones);

            setPosicion(prev => ({
                // Eje Z controla el giro del volante
                rotacionZ: prev.rotacionZ + (mediciones.z * 15), 
                // Eje Y y X controlan el movimiento (los limité un poco para que el volante no se salga tan fácil de la pantalla)
                movX: prev.movX + (mediciones.y * 5),
                movY: prev.movY + (mediciones.x * 5)
            }));
        });

        return () => {
            suscripcion.remove();
        }
    }, []);

    return (
        <View style={styles.container}>
            {/* Imagen del volante en pantalla completa */}
            <Image
                // 👇 PON AQUÍ EL LINK DE TU IMAGEN PNG 👇
                source={{ uri: 'https://m.media-amazon.com/images/I/513wHm5LD7L._AC_SX342_SY445_QL70_ML2_.jpg' }} 
                style={[
                    styles.fullScreenImage,
                    {
                        transform: [
                            { translateX: posicion.movX },
                            { translateY: posicion.movY },
                            { rotate: `${posicion.rotacionZ}deg` }
                        ]
                    }
                ]}
            />

            {/* Contenedor de Textos flotantes */}
            <View style={styles.uiContainer}>
                <Text style={styles.title}>Giroscopio</Text>
                
                <View style={styles.card}>
                    <Text style={styles.axis}>Rotación (Z):</Text>
                    <Text style={styles.value}>{datos.z.toFixed(2)}</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullScreenImage: {
        position: 'absolute', // Hace que la imagen se desvincule del flujo y quede de fondo
        width: width,         // Ocupa el 100% del ancho de la pantalla
        height: height,       // Ocupa el 100% del alto de la pantalla
        resizeMode: 'contain',// Asegura que el volante no se deforme aunque sea grande
        zIndex: 0,            // Lo coloca en el fondo
    },
    uiContainer: {
        flex: 1,
        width: '100%',
        padding: 25,
        justifyContent: 'flex-start', // Pone los textos arriba
        zIndex: 1, // Mantiene los textos por encima de la imagen
        marginTop: 50, // Separación de la barra de estado superior
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#ffffff',
        textShadowColor: 'rgba(0, 0, 0, 0.75)', // Sombra para que se lea sobre la imagen
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10
    },
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.85)', // Fondo semi-transparente
        padding: 20,
        marginBottom: 15,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
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