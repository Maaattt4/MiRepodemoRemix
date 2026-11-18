package com.example.clonewhatsapp;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.CheckBox;
import android.widget.ImageView;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import com.bumptech.glide.Glide;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class SeleccionAdapter extends RecyclerView.Adapter<SeleccionAdapter.VH> {

    private final List<Contacto> lista;
    private final Set<String> seleccionados = new HashSet<>();

    public SeleccionAdapter(List<Contacto> lista) {
        this.lista = lista;
    }

    public List<String> getSeleccionados() {
        return new ArrayList<>(seleccionados);
    }

    @NonNull
    @Override
    public VH onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        return new VH(LayoutInflater.from(parent.getContext()).inflate(R.layout.item_contacto_seleccion, parent, false));
    }

    @Override
    public void onBindViewHolder(@NonNull VH h, int position) {
        Contacto c = lista.get(position);
        h.tvNombre.setText(c.getUsername());
        h.cb.setChecked(seleccionados.contains(c.getId()));
        Glide.with(h.itemView.getContext())
                .load(c.getAvatarUrl())
                .placeholder(R.mipmap.ic_launcher_round)
                .error(R.mipmap.ic_launcher_round)
                .circleCrop()
                .into(h.ivAvatar);
        h.itemView.setOnClickListener(v -> {
            if (!seleccionados.remove(c.getId())) seleccionados.add(c.getId());
            notifyItemChanged(h.getBindingAdapterPosition());
        });
    }

    @Override
    public int getItemCount() {
        return lista.size();
    }

    static class VH extends RecyclerView.ViewHolder {
        TextView tvNombre;
        ImageView ivAvatar;
        CheckBox cb;

        VH(@NonNull View v) {
            super(v);
            tvNombre = v.findViewById(R.id.tvNombreSeleccion);
            ivAvatar = v.findViewById(R.id.ivAvatarSeleccion);
            cb = v.findViewById(R.id.cbSeleccion);
        }
    }
}
