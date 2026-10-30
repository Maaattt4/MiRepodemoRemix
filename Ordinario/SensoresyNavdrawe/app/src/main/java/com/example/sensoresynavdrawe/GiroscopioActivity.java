package com.example.sensoresynavdrawe;

import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.Bundle;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;

public class GiroscopioActivity extends AppCompatActivity implements SensorEventListener {

    private SensorManager sensorManager;
    private Sensor giroscopio;
    private TextView txtValores;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_giroscopio);

        txtValores = findViewById(R.id.txt_valores_giroscopio);
        sensorManager = (SensorManager) getSystemService(SENSOR_SERVICE);
        giroscopio = sensorManager.getDefaultSensor(Sensor.TYPE_GYROSCOPE);
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (giroscopio != null) {
            sensorManager.registerListener(this, giroscopio, SensorManager.SENSOR_DELAY_NORMAL);
        } else {
            txtValores.setText("El sensor de giroscopio no está disponible en este dispositivo.");
        }
    }

    @Override
    protected void onPause() {
        super.onPause();
        sensorManager.unregisterListener(this);
    }

    @Override
    public void onSensorChanged(SensorEvent event) {
        float x = event.values[0];
        float y = event.values[1];
        float z = event.values[2];

        txtValores.setText(String.format("X: %.2f rad/s\nY: %.2f rad/s\nZ: %.2f rad/s", x, y, z));
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) {}
}