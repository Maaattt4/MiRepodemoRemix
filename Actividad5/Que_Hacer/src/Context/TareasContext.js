import React, { createContext, useState } from 'react';

export const TareasContext = createContext();

export const TareasProvider = ({ children }) => {
  const [datos, setDatos] = useState([
    { title: 'Tareas', data: [] },
    { title: 'Hábitos', data: [] },
  ]);
  const [listasPersonalizadas, setListasPersonalizadas] = useState([]);
  
  // Nuevo estado para controlar el inicio de sesión
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <TareasContext.Provider value={{ 
      datos, setDatos, 
      listasPersonalizadas, setListasPersonalizadas,
      isLoggedIn, setIsLoggedIn 
    }}>
      {children}
    </TareasContext.Provider>
  );
};