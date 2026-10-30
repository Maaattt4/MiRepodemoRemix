package com.example.sensoresynavdrawe;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.view.MenuItem;
import androidx.annotation.NonNull;
import androidx.appcompat.app.ActionBarDrawerToggle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.core.view.GravityCompat;
import androidx.drawerlayout.widget.DrawerLayout;
import com.google.android.material.navigation.NavigationView;

public class MainActivity extends AppCompatActivity {
    private DrawerLayout drawerLayout;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        drawerLayout = findViewById(R.id.drawer_layout);
        NavigationView navigationView = findViewById(R.id.nav_view);

        // Configura el ícono de hamburguesa
        ActionBarDrawerToggle toggle = new ActionBarDrawerToggle(this, drawerLayout, toolbar, R.string.app_name, R.string.app_name);
        drawerLayout.addDrawerListener(toggle);
        toggle.syncState();

        // Escucha los clics en el menú lateral
        navigationView.setNavigationItemSelectedListener(new NavigationView.OnNavigationItemSelectedListener() {
            @Override
            public boolean onNavigationItemSelected(@NonNull MenuItem item) {
                int id = item.getItemId();

                // 1. Cerramos el menú primero
                drawerLayout.closeDrawer(GravityCompat.START);

                // 2. Retrasamos el salto a la otra pantalla por 250ms
                new Handler().postDelayed(() -> {
                    if (id == R.id.nav_acelerometro) {
                        startActivity(new Intent(MainActivity.this, AcelerometroActivity.class));
                    } else if (id == R.id.nav_giroscopio) {
                        startActivity(new Intent(MainActivity.this, GiroscopioActivity.class));
                    } else if (id == R.id.nav_magnetometro) {
                        startActivity(new Intent(MainActivity.this, MagnetometroActivity.class));
                    } else if (id == R.id.nav_podometro) {
                        startActivity(new Intent(MainActivity.this, PodometroActivity.class));
                    } else if (id == R.id.nav_gps) {
                        startActivity(new Intent(MainActivity.this, GpsActivity.class));
                    } else if (id == R.id.nav_camara) {
                        startActivity(new Intent(MainActivity.this, CamaraActivity.class));
                    }
                }, 250);

                return true;
            }
        });
    }

    // Cierra el panel lateral si está abierto al presionar el botón "Atrás" del teléfono
    @Override
    public void onBackPressed() {
        if (drawerLayout.isDrawerOpen(GravityCompat.START)) {
            drawerLayout.closeDrawer(GravityCompat.START);
        } else {
            super.onBackPressed();
        }
    }
}