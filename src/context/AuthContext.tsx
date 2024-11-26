import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User, getAuth } from "firebase/auth";
import { auth } from "../firebase/firebase";

interface AuthContextProps {
  user: User | null; // Usuario autenticado
  loading: boolean; // Indica si estamos verificando el estado
  logout: () => Promise<void>; // Método para cerrar sesión
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Manejar estado de carga

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser || null);
      setLoading(false); // Estado de carga completado
    });
    return unsubscribe;
  }, []);

  const logout = async () => {
    await auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};
