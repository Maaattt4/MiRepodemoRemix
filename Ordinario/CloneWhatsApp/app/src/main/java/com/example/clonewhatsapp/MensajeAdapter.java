package com.example.clonewhatsapp;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import java.util.List;

public class MensajeAdapter extends RecyclerView.Adapter<RecyclerView.ViewHolder> {

    private List<Mensaje> listaMensajes;
    private String miUsuarioId;

    private static final int TIPO_ENVIADO = 1;
    private static final int TIPO_RECIBIDO = 2;

    public MensajeAdapter(List<Mensaje> listaMensajes, String miUsuarioId) {
        this.listaMensajes = listaMensajes;
        this.miUsuarioId = miUsuarioId;
    }

    @Override
    public int getItemViewType(int position) {
        Mensaje mensaje = listaMensajes.get(position);
        // Si el remitente soy yo, es un mensaje enviado
        if (mensaje.getRemitenteId().equals(miUsuarioId)) {
            return TIPO_ENVIADO;
        } else {
            return TIPO_RECIBIDO;
        }
    }

    @NonNull
    @Override
    public RecyclerView.ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        if (viewType == TIPO_ENVIADO) {
            View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_mensaje_enviado, parent, false);
            return new MensajeEnviadoViewHolder(view);
        } else {
            View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_mensaje_recibido, parent, false);
            return new MensajeRecibidoViewHolder(view);
        }
    }

    @Override
    public void onBindViewHolder(@NonNull RecyclerView.ViewHolder holder, int position) {
        Mensaje mensaje = listaMensajes.get(position);

        // Validamos qué tipo de burbuja es para asignar el texto correctamente
        if (holder.getItemViewType() == TIPO_ENVIADO) {
            MensajeEnviadoViewHolder enviadoHolder = (MensajeEnviadoViewHolder) holder;
            enviadoHolder.tvMensaje.setText(mensaje.getContent());
        } else {
            MensajeRecibidoViewHolder recibidoHolder = (MensajeRecibidoViewHolder) holder;
            recibidoHolder.tvMensaje.setText(mensaje.getContent());
        }
    }

    @Override
    public int getItemCount() {
        return listaMensajes == null ? 0 : listaMensajes.size();
    }

    // --- CLASES VIEWHOLDER DESCOMENTADAS Y CORREGIDAS ---

    public static class MensajeEnviadoViewHolder extends RecyclerView.ViewHolder {
        TextView tvMensaje;

        public MensajeEnviadoViewHolder(@NonNull View itemView) {
            super(itemView);
            // ⚠️ IMPORTANTE: Asegúrate de que "tvMensajeEnviado" sea el ID correcto en tu item_mensaje_enviado.xml
            tvMensaje = itemView.findViewById(R.id.tvMensajeEnviado);
        }
    }

    public static class MensajeRecibidoViewHolder extends RecyclerView.ViewHolder {
        TextView tvMensaje;

        public MensajeRecibidoViewHolder(@NonNull View itemView) {
            super(itemView);
            // ⚠️ IMPORTANTE: Asegúrate de que "tvMensajeRecibido" sea el ID correcto en tu item_mensaje_recibido.xml
            tvMensaje = itemView.findViewById(R.id.tvMensajeRecibido);
        }
    }
}