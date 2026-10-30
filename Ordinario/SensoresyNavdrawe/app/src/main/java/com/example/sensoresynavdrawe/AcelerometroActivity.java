package com.example.sensoresynavdrawe;

import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.Bundle;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;

public class AcelerometroActivity extends AppCompatActivity implements SensorEventListener {

    private SensorManager sensorManager;
    private Sensor acelerometro;
    private TextView txtValores;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_acelerometro);

        txtValores = findViewById(R.id.txt_valores_acelerometro);

        // 1. Inicializar el administrador de sensores del sistema
        sensorManager = (SensorManager) getSystemService(SENSOR_SERVICE);

        // 2. Obtener el sensor del acelerómetro
        if (sensorManager != null) {
            acelerometro = sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER);

            if (acelerometro == null) {
                txtValores.setText("El dispositivo no tiene Acelerómetro.");
            }
        }
    }

    // Registrar el listener cuando la actividad está en primer plano
    @Override
    protected void onResume() {
        super.onResume();
        if (acelerometro != null) {
            sensorManager.registerListener(this, acelerometro, SensorManager.SENSOR_DELAY_NORMAL);
        }
    }

    // Detener el listener para ahorrar batería cuando se sale de la actividad
    @Override
    protected void onPause() {
        super.onPause();
        sensorManager.unregisterListener(this);
    }

    // Método que se ejecuta cada vez que el sensor detecta un cambio
    @Override
    public void onSensorChanged(SensorEvent event) {
        if (event.sensor.getType() == Sensor.TYPE_ACCELEROMETER) {
            float x = event.values[0];
            float y = event.values[1];
            float z = event.values[2];

            String texto = String.format("Eje X: %.2f\nEje Y: %.2f\nEje Z: %.2f", x, y, z);
            txtValores.setText(texto);
        }
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) {
        // No es necesario implementarlo para este ejemplo
    }
}