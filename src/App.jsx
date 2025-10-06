import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Home from "./pages/Home";
import CriarProjeto from "./pages/CriarProjeto";
import DetalhesProjeto from "./pages/DetalheProjeto";
import PerfilUser from "./pages/PerfilUser";
import Portfolio from "./pages/Portifolio";
import DefaultLayout from "./Components/DefaultLayout";
import UpdateProjeto from "./pages/updateProjeto";


function App() {
  return (
    <Router>
      <Routes>

        <Route
          path="/"
          element={
            <DefaultLayout>
              <Home />
            </DefaultLayout>
          }
        />
        <Route
          path="/criarProjeto"
          element={
            <DefaultLayout>
              <CriarProjeto />
            </DefaultLayout>
          }
        />
        <Route
          path="/perfiluser"
          element={
            <DefaultLayout>
              <PerfilUser />
            </DefaultLayout>
          }
        />
        <Route
          path="/updateprojeto/:ID_projeto"
          element={
            <DefaultLayout>
              <UpdateProjeto />
            </DefaultLayout>
          }
        />
        <Route
          path="/portifoliouser"
          element={
            <DefaultLayout>
              <Portfolio />
            </DefaultLayout>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/detalhesprojeto" element={<DefaultLayout> <DetalhesProjeto/> </DefaultLayout>} />
        <Route path="/detalhesprojeto/:id" element={<DefaultLayout> <DetalhesProjeto/> </DefaultLayout>} />
      </Routes>
    </Router>
  );
}

export default App;
