import React, { useState, createContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Feed from "./pages/Feed";
import AdFormPage from "./pages/AdFormPage";
import Drafts from "./pages/Drafts";
import { useAuth } from "./context/AuthContext";
import Header from "./components/Header";
import AdDetailPage from "./components/AdDetailPage"; 
import "./App.css";

// Crear el contexto de búsqueda
export const SearchContext = createContext<{
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}>({
  searchQuery: "",
  setSearchQuery: () => {},
});

const App: React.FC = () => {
  const { user, loading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
      <Router>
        <div>
          {user && <Header />}
          <Routes>
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/feed" />} />
            <Route path="/feed" element={user ? <Feed /> : <Navigate to="/login" />} />
            <Route path="/create" element={user ? <AdFormPage /> : <Navigate to="/login" />} />
            <Route path="/edit/:id" element={user ? <AdFormPage /> : <Navigate to="/login" />} />
            <Route path="/drafts" element={user ? <Drafts /> : <Navigate to="/login" />} />
            <Route path="*" element={<Navigate to={user ? "/feed" : "/login"} />} />
            <Route path="/ad/:id" element={user ? <AdDetailPage /> : <Navigate to="/login" />} />
          </Routes>
        </div>
      </Router>
    </SearchContext.Provider>
  );
};

export default App;
