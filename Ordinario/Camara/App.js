import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission, useFrameProcessor } from 'react-native-vision-camera';
import { useFaceDetector } from 'react-native-vision-camera-face-detector';
import { Worklets } from 'react-native-worklets-core';

export default function App() {
  const { hasPermission, requestPermission } = useCameraPermission();
  // Solicitamos la cámara frontal
  const device = useCameraDevice('front');
  const [rostros, setRostros] = useState([]);

  // Configuramos el detector de rostros para que sea rápido
  const faceDetector = useFaceDetector({
    performanceMode: 'fast',
    contourMode: 'none',
    landmarkMode: 'none',
  });

  // Pedimos permiso al iniciar
  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission]);

  // El Frame Processor analiza la cámara a 60 cuadros por segundo
  const frameProcessor = useFrameProcessor((frame) => {
    'worklet'; // Esto le dice a la app que corra en el hilo nativo de alto rendimiento
    const carasDetectadas = faceDetector.detectFaces(frame);
    
    // Pasamos las coordenadas del hilo nativo al estado de React (hilo JS)
    Worklets.createRunOnJS(setRostros)(carasDetectadas);
  }, [faceDetector]);

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text style={styles.texto}>Esperando permisos de cámara...</Text>
      </View>
    );
  }

  if (device == null) {
    return (
      <View style={styles.container}>
        <Text style={styles.texto}>No se detectó cámara frontal</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        frameProcessor={frameProcessor}
      />
      
      {/* Dibujamos el rectángulo verde por cada rostro detectado */}
      {rostros.map((rostro, index) => (
        <View
          key={index}
          style={[
            styles.rectanguloRostro,
            {
              left: rostro.bounds.x,
              top: rostro.bounds.y,
              width: rostro.bounds.width,
              height: rostro.bounds.height,
            },
          ]}
        >
          <Text style={styles.etiquetaTexto}>Rostro detectado</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  texto: {
    color: 'white',
    fontSize: 18,
  },
  rectanguloRostro: {
    position: 'absolute',
    borderWidth: 3,
    borderColor: '#00ff00',
    borderRadius: 10,
    justifyContent: 'flex-start',
  },
  etiquetaTexto: {
    color: '#00ff00',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignSelf: 'flex-start',
    fontWeight: 'bold',
    paddingHorizontal: 5,
    marginTop: -25,
    borderRadius: 4,
  }
});