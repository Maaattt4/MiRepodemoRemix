package com.example.demointent; // Usa el nombre de tu paquete

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {

    Button btn1, btn2, btn3;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        btn1 = findViewById(R.id.btnIrActividad1);
        btn2 = findViewById(R.id.btnIrActividad2);
        btn3 = findViewById(R.id.btnIrActividad3);

        btn1.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(MainActivity.this, Actividad1.class);
                intent.putExtra("mensaje", "Bienvenido a la Calculadora");
                startActivity(intent);
            }
        });

        btn2.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(MainActivity.this, Actividad2.class);
                intent.putExtra("nombreUsuario", "Gibrán");
                startActivity(intent);
            }
        });

        btn3.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(MainActivity.this, Actividad3.class);
                intent.putExtra("valorInicial", 5);
                startActivity(intent);
            }
        });
    }
}