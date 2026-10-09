package com.example.calculadora;

import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {

    private EditText etNumero1, etNumero2;
    private Button btnSumar;
    private TextView tvResultado;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        etNumero1 = findViewById(R.id.etNumero1);
        etNumero2 = findViewById(R.id.etNumero2);
        btnSumar = findViewById(R.id.btnSumar);
        tvResultado = findViewById(R.id.tvResultado);

        // Configuramos el evento de clic del botón
        btnSumar.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                sumar();
            }
        });
    }

    private void sumar() {
        String s1 = etNumero1.getText().toString();
        String s2 = etNumero2.getText().toString();

        if (!s1.isEmpty() && !s2.isEmpty()) {
            double n1 = Double.parseDouble(s1);
            double n2 = Double.parseDouble(s2);
            double suma = n1 + n2;

            tvResultado.setText("Resultado: " + suma);
        } else {
            Toast.makeText(this, "Por favor, ingresa ambos números", Toast.LENGTH_SHORT).show();
        }
    }
}