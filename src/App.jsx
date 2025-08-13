import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Home from "./pages/Home";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Cadastro />}/>   
        <Route path="/login" element={<Login />}/>   
        <Route path="/cadastro" element={<Cadastro />}/>   
      </Routes>
    </Router>
  );
}

export default App;
