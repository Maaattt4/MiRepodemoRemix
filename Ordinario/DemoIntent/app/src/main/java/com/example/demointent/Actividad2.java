package com.example.demointent;

import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;

public class Actividad2 extends AppCompatActivity {

    TextView txtSaludo;
    Button btnRegresar;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_2);

        txtSaludo = findViewById(R.id.txtSaludo);
        btnRegresar = findViewById(R.id.btnRegresar2);

        // Recibir Extra
        String nombre = getIntent().getStringExtra("nombreUsuario");
        if (nombre != null) {
            txtSaludo.setText("¡Hola " + nombre + ", bienvenido!");
        } else {
            txtSaludo.setText("¡Hola usuario!");
        }

        // Botón de regreso
        btnRegresar.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });
    }
}