package com.example.demointent;

import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;

public class Actividad3 extends AppCompatActivity {

    TextView txtContador;
    Button btnContar, btnRegresar;
    int contador = 0;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_3);

        txtContador = findViewById(R.id.txtContador);
        btnContar = findViewById(R.id.btnContar);
        btnRegresar = findViewById(R.id.btnRegresar3);

        // Recibir Extra entero
        contador = getIntent().getIntExtra("valorInicial", 0);
        txtContador.setText("Clicks: " + contador);

        btnContar.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                contador++;
                txtContador.setText("Clicks: " + contador);
            }
        });

        // Botón de regreso
        btnRegresar.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });
    }
}