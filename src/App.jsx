import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Home from "./pages/Home";
import Header from "./Components/Header";

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
          path="/login"
          element={
            <Header>
              <Login />
            </Header>
          }
        />

        {/* <Route path="/login" element={<Login />}/>   
        <Route path="/cadastro" element={<Cadastro />}/>    */}
      </Routes>
    </Router>
  );
}

export default App;
