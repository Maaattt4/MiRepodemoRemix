import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import { Accelerometer } from 'expo-sensors';

const { width, height } = Dimensions.get('window');

// 1. Configuraciones visuales y físicas
const TABLE_PADDING = 30; // Grosor del borde marrón
const BALL_RADIUS = 20; // Tamaño de las bolas
const POCKET_RADIUS = 30; // Tamaño de los hoyos

const FRICTION = 0.985; // Fricción de la mesa (un poco más suave para que rueden más)
const BOUNCE_DAMPING = -0.7; // Rebote en las paredes
const SHAKE_THRESHOLD = 0.8; // Fuerza necesaria de sacudida
const IMPULSE_FACTOR = 25; // Multiplicador de velocidad al sacudir

// 2. Posiciones de los hoyos (Calculadas en base a la pantalla)
const POCKETS = [
    { id: 1, x: TABLE_PADDING, y: TABLE_PADDING }, 
    { id: 2, x: width - TABLE_PADDING, y: TABLE_PADDING }, 
    { id: 3, x: TABLE_PADDING, y: height / 2 }, 
    { id: 4, x: width - TABLE_PADDING, y: height / 2 }, 
    { id: 5, x: TABLE_PADDING, y: height - TABLE_PADDING }, 
    { id: 6, x: width - TABLE_PADDING, y: height - TABLE_PADDING }, 
];

// 3. Crear el triángulo inicial de las bolas (Punta hacia abajo)
const centerX = width / 2;
const startY = height / 3.5; 
const rowHeight = BALL_RADIUS * 1.732; 

const initialBalls = [
    // Fila superior (3 bolas)
    { id: 1, x: centerX - BALL_RADIUS * 2, y: startY, vx: 0, vy: 0, active: true },
    { id: 2, x: centerX, y: startY, vx: 0, vy: 0, active: true },
    { id: 3, x: centerX + BALL_RADIUS * 2, y: startY, vx: 0, vy: 0, active: true },
    // Fila media (2 bolas)
    { id: 4, x: centerX - BALL_RADIUS, y: startY + rowHeight, vx: 0, vy: 0, active: true },
    { id: 5, x: centerX + BALL_RADIUS, y: startY + rowHeight, vx: 0, vy: 0, active: true },
    // Punta inferior (1 bola)
    { id: 6, x: centerX, y: startY + rowHeight * 2, vx: 0, vy: 0, active: true },
];

export default function BilliardsTable() {
    const [bolas, setBolas] = useState(initialBalls);
    const previousAccel = useRef({ x: 0, y: 0, z: 0 });
    const physicsInterval = useRef(null);

    useEffect(() => {
        const suscripcion = Accelerometer.addListener(mediciones => {
            detectarSacudida(mediciones);
        });
        Accelerometer.setUpdateInterval(50);

        return () => suscripcion.remove();
    }, []);

    useEffect(() => {
        // Bucle de animación (~60fps)
        physicsInterval.current = setInterval(actualizarFisica, 16);
        return () => clearInterval(physicsInterval.current);
    }, []);

    const detectarSacudida = (data) => {
        const dx = Math.abs(data.x - previousAccel.current.x);
        const dy = Math.abs(data.y - previousAccel.current.y);
        const dz = Math.abs(data.z - previousAccel.current.z);

        const totalChange = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (totalChange > SHAKE_THRESHOLD) {
            setBolas(bolasActuales => bolasActuales.map(bola => {
                if (!bola.active) return bola;
                return {
                    ...bola,
                    // Dirección aleatoria con la fuerza de la sacudida
                    vx: bola.vx + (Math.random() - 0.5) * totalChange * IMPULSE_FACTOR,
                    vy: bola.vy + (Math.random() - 0.5) * totalChange * IMPULSE_FACTOR,
                };
            }));
        }
        previousAccel.current = data;
    };

    const actualizarFisica = () => {
        setBolas(bolasActuales => {
            // Creamos una copia para manipular las físicas globalmente
            let nuevasBolas = bolasActuales.map(b => ({ ...b }));

            const tableMinX = TABLE_PADDING + BALL_RADIUS;
            const tableMaxX = width - TABLE_PADDING - BALL_RADIUS;
            const tableMinY = TABLE_PADDING + BALL_RADIUS;
            const tableMaxY = height - TABLE_PADDING - BALL_RADIUS;

            // 1. Movimiento y rebote en paredes
            nuevasBolas.forEach(bola => {
                if (!bola.active) return;

                bola.x += bola.vx;
                bola.y += bola.vy;
                bola.vx *= FRICTION;
                bola.vy *= FRICTION;

                if (bola.x < tableMinX) { bola.x = tableMinX; bola.vx *= BOUNCE_DAMPING; }
                if (bola.x > tableMaxX) { bola.x = tableMaxX; bola.vx *= BOUNCE_DAMPING; }
                if (bola.y < tableMinY) { bola.y = tableMinY; bola.vy *= BOUNCE_DAMPING; }
                if (bola.y > tableMaxY) { bola.y = tableMaxY; bola.vy *= BOUNCE_DAMPING; }

                if (Math.abs(bola.vx) < 0.05) bola.vx = 0;
                if (Math.abs(bola.vy) < 0.05) bola.vy = 0;
            });

            // 2. Colisiones entre bolas (Para que reboten entre sí)
            for (let i = 0; i < nuevasBolas.length; i++) {
                for (let j = i + 1; j < nuevasBolas.length; j++) {
                    let b1 = nuevasBolas[i];
                    let b2 = nuevasBolas[j];
                    if (!b1.active || !b2.active) continue;

                    let dx = b2.x - b1.x;
                    let dy = b2.y - b1.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    let minDist = BALL_RADIUS * 2;

                    if (distance < minDist && distance > 0) {
                        // Separar bolas sobrepuestas
                        let overlap = minDist - distance;
                        let nx = dx / distance;
                        let ny = dy / distance;

                        b1.x -= nx * (overlap / 2);
                        b1.y -= ny * (overlap / 2);
                        b2.x += nx * (overlap / 2);
                        b2.y += ny * (overlap / 2);

                        // Intercambiar velocidades (rebote elástico)
                        let kx = b1.vx - b2.vx;
                        let ky = b1.vy - b2.vy;
                        let p = (nx * kx + ny * ky) * 0.9; // 0.9 es la pérdida de energía

                        b1.vx -= p * nx;
                        b1.vy -= p * ny;
                        b2.vx += p * nx;
                        b2.vy += p * ny;
                    }
                }
            }

            // 3. Detectar si caen en hoyos
            nuevasBolas.forEach(bola => {
                if (!bola.active) return;
                for (const pocket of POCKETS) {
                    let dx = bola.x - pocket.x;
                    let dy = bola.y - pocket.y;
                    if (Math.sqrt(dx * dx + dy * dy) < POCKET_RADIUS) {
                        bola.active = false;
                        bola.vx = 0;
                        bola.vy = 0;
                    }
                }
            });

            return nuevasBolas;
        });
    };

    return (
        <View style={styles.brownBorder}>
            <View style={styles.greenFelt} />

            {/* Hoyos Negros */}
            {POCKETS.map(pocket => (
                <View 
                    key={`pocket-${pocket.id}`} 
                    style={[styles.pocket, { 
                        left: pocket.x - POCKET_RADIUS, 
                        top: pocket.y - POCKET_RADIUS 
                    }]} 
                />
            ))}

            {/* Bolas Rojas */}
            {bolas.map(bola => bola.active && (
                <View 
                    key={`ball-${bola.id}`} 
                    style={[styles.ball, { 
                        left: bola.x - BALL_RADIUS, 
                        top: bola.y - BALL_RADIUS 
                    }]} 
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    brownBorder: {
        width: width, // Forzamos el ancho al 100% de la pantalla
        height: height, // Forzamos el alto al 100% de la pantalla
        position: 'absolute', // Evita que contenedores padres lo aplasten
        backgroundColor: '#bc8f60',
    },
    greenFelt: {
        flex: 1,
        backgroundColor: '#2ca451',
        margin: TABLE_PADDING, 
    },
    pocket: {
        position: 'absolute',
        width: POCKET_RADIUS * 2,
        height: POCKET_RADIUS * 2,
        backgroundColor: '#000000',
        borderRadius: POCKET_RADIUS,
    },
    ball: {
        position: 'absolute',
        width: BALL_RADIUS * 2,
        height: BALL_RADIUS * 2,
        backgroundColor: '#950b1d', 
        borderRadius: BALL_RADIUS,
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 1, height: 1 }, shadowOpacity: 0.5, shadowRadius: 2 },
            android: { elevation: 5 },
        }),
    },
});



