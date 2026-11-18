package com.example.clonewhatsapp;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Matrix;
import android.media.ExifInterface;
import android.net.Uri;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.UUID;

public class ImagenUtil {

    public static final String SUPABASE_URL = "https://azbyrfczkruskdbkrwcn.supabase.co";
    public static final String SUPABASE_KEY = "sb_publishable_KcER3YV1UhdIOC_Qq8HGcQ_-lUb7D78";

    public static byte[] comprimir(Context ctx, Uri uri, int maxLado) throws Exception {
        BitmapFactory.Options o = new BitmapFactory.Options();
        o.inJustDecodeBounds = true;
        try (InputStream is = ctx.getContentResolver().openInputStream(uri)) {
            BitmapFactory.decodeStream(is, null, o);
        }
        int s = 1;
        while (o.outWidth / (s * 2) >= maxLado || o.outHeight / (s * 2) >= maxLado) s *= 2;
        o = new BitmapFactory.Options();
        o.inSampleSize = s;
        Bitmap bmp;
        try (InputStream is = ctx.getContentResolver().openInputStream(uri)) {
            bmp = BitmapFactory.decodeStream(is, null, o);
        }
        if (bmp == null) throw new Exception("Imagen inválida");

        int grados = 0;
        try (InputStream is = ctx.getContentResolver().openInputStream(uri)) {
            int ori = new ExifInterface(is).getAttributeInt(ExifInterface.TAG_ORIENTATION, 1);
            if (ori == ExifInterface.ORIENTATION_ROTATE_90) grados = 90;
            else if (ori == ExifInterface.ORIENTATION_ROTATE_180) grados = 180;
            else if (ori == ExifInterface.ORIENTATION_ROTATE_270) grados = 270;
        } catch (Exception ignored) {
        }

        float escala = Math.min(1f, (float) maxLado / Math.max(bmp.getWidth(), bmp.getHeight()));
        Matrix m = new Matrix();
        m.postScale(escala, escala);
        m.postRotate(grados);
        Bitmap fin = Bitmap.createBitmap(bmp, 0, 0, bmp.getWidth(), bmp.getHeight(), m, true);

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        fin.compress(Bitmap.CompressFormat.JPEG, 80, out);
        return out.toByteArray();
    }

    public static String subir(String token, String bucket, String userId, byte[] bytes) throws Exception {
        return subir(token, bucket, userId, bytes, true);
    }

    private static String subir(String token, String bucket, String userId, byte[] bytes, boolean reintentar) throws Exception {
        String path = userId + "/" + UUID.randomUUID() + ".jpg";
        URL url = new URL(SUPABASE_URL + "/storage/v1/object/" + bucket + "/" + path);
        HttpURLConnection c = (HttpURLConnection) url.openConnection();
        c.setRequestMethod("POST");
        c.setRequestProperty("apikey", SUPABASE_KEY);
        c.setRequestProperty("Authorization", "Bearer " + Http.token(token));
        c.setRequestProperty("Content-Type", "image/jpeg");
        c.setDoOutput(true);
        try (OutputStream os = c.getOutputStream()) {
            os.write(bytes);
        }
        int code = c.getResponseCode();
        if (code == 401 && reintentar && Http.refrescar()) return subir(token, bucket, userId, bytes, false);
        if (code != 200 && code != 201) throw new Exception("Storage " + code);
        return SUPABASE_URL + "/storage/v1/object/public/" + bucket + "/" + path;
    }
}
