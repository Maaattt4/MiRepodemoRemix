package com.example.layouts; // Asegúrate de que coincida con tu paquete

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Referencias a los botones
        Button btnLinear = findViewById(R.id.btnLinear);
        Button btnRelative = findViewById(R.id.btnRelative);
        Button btnFrame = findViewById(R.id.btnFrame);
        Button btnTable = findViewById(R.id.btnTable);

        // Eventos Click para navegar a cada ejemplo
        btnLinear.setOnClickListener(v -> startActivity(new Intent(MainActivity.this, LinearActivity.class)));
        btnRelative.setOnClickListener(v -> startActivity(new Intent(MainActivity.this, RelativeActivity.class)));
        btnFrame.setOnClickListener(v -> startActivity(new Intent(MainActivity.this, FrameActivity.class)));
        btnTable.setOnClickListener(v -> startActivity(new Intent(MainActivity.this, TableActivity.class)));
    }
}