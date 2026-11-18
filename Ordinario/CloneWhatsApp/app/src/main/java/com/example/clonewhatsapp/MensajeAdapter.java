package com.example.clonewhatsapp;

import android.graphics.Typeface;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import com.bumptech.glide.Glide;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class MensajeAdapter extends RecyclerView.Adapter<MensajeAdapter.Holder> {

    public interface OnMensajeLongClick {
        void onLongClick(Mensaje mensaje);
    }

    private static final int TIPO_ENVIADO = 1;
    private static final int TIPO_RECIBIDO = 2;

    private final List<Mensaje> listaMensajes;
    private final List<Mensaje> visibles = new ArrayList<>();
    private final String miUsuarioId;
    private String filtro = "";
    private boolean esGrupo;
    private Map<String, String> nombres = new HashMap<>();
    private OnMensajeLongClick longClick;

    public MensajeAdapter(List<Mensaje> listaMensajes, String miUsuarioId) {
        this.listaMensajes = listaMensajes;
        this.miUsuarioId = miUsuarioId;
    }

    public void setOnMensajeLongClick(OnMensajeLongClick l) {
        this.longClick = l;
    }

    public void setGrupo(boolean esGrupo, Map<String, String> nombres) {
        this.esGrupo = esGrupo;
        this.nombres = nombres;
        notifyDataSetChanged();
    }

    public void filtrar(String q) {
        filtro = q == null ? "" : q.trim().toLowerCase();
        actualizar();
    }

    public void actualizar() {
        visibles.clear();
        for (Mensaje m : listaMensajes) {
            if (filtro.isEmpty()
                    || (!m.isEliminado() && !m.esImagen() && m.getContent().toLowerCase().contains(filtro))) {
                visibles.add(m);
            }
        }
        notifyDataSetChanged();
    }

    @Override
    public int getItemViewType(int position) {
        return visibles.get(position).getRemitenteId().equals(miUsuarioId) ? TIPO_ENVIADO : TIPO_RECIBIDO;
    }

    @NonNull
    @Override
    public Holder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        boolean enviado = viewType == TIPO_ENVIADO;
        View v = LayoutInflater.from(parent.getContext())
                .inflate(enviado ? R.layout.item_mensaje_enviado : R.layout.item_mensaje_recibido, parent, false);
        return new Holder(v, enviado);
    }

    @Override
    public void onBindViewHolder(@NonNull Holder h, int position) {
        Mensaje m = visibles.get(position);
        boolean enviado = getItemViewType(position) == TIPO_ENVIADO;

        if (h.tvRemitente != null) {
            if (esGrupo && !enviado) {
                String n = nombres.get(m.getRemitenteId());
                h.tvRemitente.setText(n != null ? n : "Usuario");
                h.tvRemitente.setVisibility(View.VISIBLE);
            } else {
                h.tvRemitente.setVisibility(View.GONE);
            }
        }

        if (m.isEliminado()) {
            h.ivImagen.setVisibility(View.GONE);
            Glide.with(h.ivImagen.getContext()).clear(h.ivImagen);
            h.tvMensaje.setVisibility(View.VISIBLE);
            h.tvMensaje.setText("Este mensaje fue eliminado");
            h.tvMensaje.setTypeface(null, Typeface.ITALIC);
            h.tvMensaje.setTextColor(0xFF4F7A92);
        } else if (m.esImagen()) {
            h.tvMensaje.setVisibility(View.GONE);
            h.ivImagen.setVisibility(View.VISIBLE);
            Glide.with(h.ivImagen.getContext()).load(m.getContent()).override(600).into(h.ivImagen);
        } else {
            h.ivImagen.setVisibility(View.GONE);
            Glide.with(h.ivImagen.getContext()).clear(h.ivImagen);
            h.tvMensaje.setVisibility(View.VISIBLE);
            h.tvMensaje.setText(m.getContent());
            h.tvMensaje.setTypeface(null, Typeface.NORMAL);
            h.tvMensaje.setTextColor(0xFF0B3954);
        }

        if (enviado) {
            h.itemView.setOnLongClickListener(v -> {
                if (longClick != null && !m.isEliminado() && m.getId() != null) longClick.onLongClick(m);
                return true;
            });
        } else {
            h.itemView.setOnLongClickListener(null);
        }
    }

    @Override
    public int getItemCount() {
        return visibles.size();
    }

    static class Holder extends RecyclerView.ViewHolder {
        TextView tvMensaje;
        TextView tvRemitente;
        ImageView ivImagen;

        Holder(@NonNull View v, boolean enviado) {
            super(v);
            tvMensaje = v.findViewById(enviado ? R.id.tvMensajeEnviado : R.id.tvMensajeRecibido);
            tvRemitente = v.findViewById(R.id.tvRemitente);
            ivImagen = v.findViewById(R.id.ivMensajeImagen);
        }
    }
}
