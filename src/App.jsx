import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Home from "./pages/Home";
import Header from "./Components/Header";
import DetalhesProjeto from "./pages/DetalheProjeto";

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
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/detalhes-projeto" element={<Header> <DetalhesProjeto/> </Header>} />
      </Routes>
    </Router>
  );
}

export default App;
