package com.example.verthorizon;
import androidx.appcompat.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

public class MainActivity extends AppCompatActivity {

    private static final String TAG = "CicloVidaApp";
    private EditText inputValor;
    private TextView textoResultado;
    private Button btnMostrar;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        Log.d(TAG, "onCreate: La actividad ha sido creada.");
        Toast.makeText(this, "onCreate() ejecutado", Toast.LENGTH_SHORT).show();

        inputValor = findViewById(R.id.inputValor);
        textoResultado = findViewById(R.id.textoResultado);
        btnMostrar = findViewById(R.id.btnMostrar);

        // Pasamos el texto del EditText al TextView al hacer clic
        btnMostrar.setOnClickListener(v -> {
            String valorIngresado = inputValor.getText().toString();
            textoResultado.setText(valorIngresado);
        });
    }

    // 1. ESTE MÉTODO GUARDA EL DATO ANTES DE QUE SE DESTRUYA LA PANTALLA AL GIRAR
    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        // Guardamos el contenido actual del TextView usando la llave "MI_TEXTO_GUARDADO"
        outState.putString("MI_TEXTO_GUARDADO", textoResultado.getText().toString());
        Log.d(TAG, "onSaveInstanceState: Rescatando el dato antes de girar...");
    }

    // 2. ESTE MÉTODO RECUPERA EL DATO CUANDO LA PANTALLA SE VUELVE A CREAR
    @Override
    protected void onRestoreInstanceState(Bundle savedInstanceState) {
        super.onRestoreInstanceState(savedInstanceState);
        // Sacamos el texto usando la misma llave que usamos al guardar
        String textoRecuperado = savedInstanceState.getString("MI_TEXTO_GUARDADO");

        // Si hay un texto guardado, lo volvemos a poner en el TextView
        if (textoRecuperado != null) {
            textoResultado.setText(textoRecuperado);
            Log.d(TAG, "onRestoreInstanceState: ¡Dato recuperado y puesto en el TextView!");
        }
    }

    @Override
    protected void onPause() {
        super.onPause();
        Log.d(TAG, "onPause: La actividad está en pausa.");
        Toast.makeText(this, "onPause() ejecutado", Toast.LENGTH_SHORT).show();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        Log.d(TAG, "onDestroy: La actividad va a ser destruida.");
        Toast.makeText(this, "onDestroy() ejecutado", Toast.LENGTH_SHORT).show();
    }
}