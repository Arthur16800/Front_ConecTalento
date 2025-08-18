import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Home from "./pages/Home";
import Header from "./Components/Header";
import PerfilUser from "./pages/PerfilUser";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Header>
              <Home />
            </Header>
          }
        />
        <Route
          path="/perfiluser"
          element={
            <Header>
              <PerfilUser />
            </Header>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
      </Routes>
    </Router>
  );
}

export default App;
