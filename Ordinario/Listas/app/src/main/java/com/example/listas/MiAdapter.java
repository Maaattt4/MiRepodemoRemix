package com.example.listas;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import java.util.List;

// Define el Adapter
public class MiAdapter extends RecyclerView.Adapter<MiAdapter.MiViewHolder> {

    private List<String> listaDatos;

    public MiAdapter(List<String> listaDatos) {
        this.listaDatos = listaDatos;
    }

    @NonNull
    @Override
    public MiViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        // Inflamos el layout de la fila que creamos (item_lista.xml)
        View vista = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_lista, parent, false);
        return new MiViewHolder(vista);
    }

    @Override
    public void onBindViewHolder(@NonNull MiViewHolder holder, int position) {
        // Asignamos los datos al Holder según la posición
        String dato = listaDatos.get(position);
        holder.tvTitulo.setText(dato);
    }

    @Override
    public int getItemCount() {
        return listaDatos.size();
    }

    // Define el Holder (Clase interna)
    public static class MiViewHolder extends RecyclerView.ViewHolder {
        TextView tvTitulo;

        public MiViewHolder(@NonNull View itemView) {
            super(itemView);
            // Enlazamos la vista del XML
            tvTitulo = itemView.findViewById(R.id.tvTitulo);
        }
    }
}