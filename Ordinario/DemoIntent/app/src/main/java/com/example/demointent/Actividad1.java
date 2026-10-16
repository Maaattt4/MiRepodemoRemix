package com.example.demointent;

import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;

public class Actividad1 extends AppCompatActivity {

    TextView txtTitulo, txtResultado;
    EditText edtNum1, edtNum2;
    Button btnSumar, btnRegresar;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_1);

        txtTitulo = findViewById(R.id.txtTitulo1);
        txtResultado = findViewById(R.id.txtResultado);
        edtNum1 = findViewById(R.id.edtNum1);
        edtNum2 = findViewById(R.id.edtNum2);
        btnSumar = findViewById(R.id.btnSumar);
        btnRegresar = findViewById(R.id.btnRegresar1);

        // Recibir Extra
        String extraRecibido = getIntent().getStringExtra("mensaje");
        if (extraRecibido != null) {
            txtTitulo.setText(extraRecibido);
        }

        btnSumar.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String n1 = edtNum1.getText().toString();
                String n2 = edtNum2.getText().toString();
                if(!n1.isEmpty() && !n2.isEmpty()) {
                    int suma = Integer.parseInt(n1) + Integer.parseInt(n2);
                    txtResultado.setText("Resultado: " + suma);
                }
            }
        });

        // Botón de regreso
        btnRegresar.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish(); // Cierra esta actividad y regresa a la principal
            }
        });
    }
}