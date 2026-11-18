package com.example.clonewhatsapp;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import com.bumptech.glide.Glide;
import java.util.ArrayList;
import java.util.List;

public class ContactoAdapter extends RecyclerView.Adapter<ContactoAdapter.ContactoViewHolder> {

    private List<Contacto> listaContactos;
    private OnItemClickListener listener;

    // 1. Interfaz para detectar el clic en un usuario (Seleccionar destinatario)
    public interface OnItemClickListener {
        void onItemClick(Contacto contacto);
    }

    // 2. Actualizamos el constructor para recibir el listener
    public ContactoAdapter(List<Contacto> listaContactos, OnItemClickListener listener) {
        this.listaContactos = listaContactos;
        this.listener = listener;
    }

    @NonNull
    @Override
    public ContactoViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_contacto, parent, false);
        return new ContactoViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ContactoViewHolder holder, int position) {
        Contacto contacto = listaContactos.get(position);
        holder.tvNombre.setText(contacto.esGrupo() ? "👥 " + contacto.getUsername() : contacto.getUsername());

        Glide.with(holder.itemView.getContext())
                .load(contacto.getAvatarUrl())
                .placeholder(R.mipmap.ic_launcher_round)
                .error(R.mipmap.ic_launcher_round)
                .circleCrop()
                .into(holder.ivAvatar);

        // 3. Asignar el evento clic a todo el recuadro del contacto
        holder.itemView.setOnClickListener(v -> listener.onItemClick(contacto));
    }

    @Override
    public int getItemCount() {
        return listaContactos.size();
    }

    // 4. Método para actualizar la lista cuando se usa el buscador
    public void filtrarLista(List<Contacto> listaFiltrada) {
        this.listaContactos = listaFiltrada;
        notifyDataSetChanged();
    }

    public static class ContactoViewHolder extends RecyclerView.ViewHolder {
        TextView tvNombre;
        ImageView ivAvatar;

        public ContactoViewHolder(@NonNull View itemView) {
            super(itemView);
            tvNombre = itemView.findViewById(R.id.tvNombreContacto);
            ivAvatar = itemView.findViewById(R.id.ivAvatarContacto);
        }
    }
}