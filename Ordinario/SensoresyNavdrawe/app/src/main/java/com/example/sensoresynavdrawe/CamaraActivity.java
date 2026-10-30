package com.example.sensoresynavdrawe;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Bundle;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.Toast;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.FileProvider;
import java.io.File;

public class CamaraActivity extends AppCompatActivity {

    private ImageView imageView;
    private File photoFile;
    private Uri photoUri;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_camara);

        imageView = findViewById(R.id.img_foto);
        Button btnTomarFoto = findViewById(R.id.btn_tomar_foto);

        photoFile = new File(getFilesDir(), "foto_temp.jpg");
        photoUri = FileProvider.getUriForFile(this, getPackageName() + ".fileprovider", photoFile);

        // Carga la foto guardada previamente si existe
        cargarFotoGuardada();

        // Configura el lanzador para tomar la fotografía y guardarla en el Uri
        ActivityResultLauncher<Uri> tomarFotoLauncher = registerForActivityResult(
                new ActivityResultContracts.TakePicture(),
                exito -> {
                    if (Boolean.TRUE.equals(exito)) {
                        cargarFotoGuardada();
                        Toast.makeText(this, "Foto guardada temporalmente", Toast.LENGTH_SHORT).show();
                    }
                }
        );

        btnTomarFoto.setOnClickListener(v -> tomarFotoLauncher.launch(photoUri));
    }

    private void cargarFotoGuardada() {
        if (photoFile.exists()) {
            Bitmap bitmap = BitmapFactory.decodeFile(photoFile.getAbsolutePath());
            if (bitmap != null) {
                imageView.setImageBitmap(bitmap);
            }
        }
    }
}