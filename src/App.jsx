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
import Pagamento from "./pages/Pagameto";
import NotFound from "./pages/NotFound";

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
          path="/portifoliouser/:username"
          element={
            <DefaultLayout>
              <Portfolio />
            </DefaultLayout>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />

        <Route
          path="/detalhesprojeto/:id"
          element={
            <DefaultLayout>
              <DetalhesProjeto />
            </DefaultLayout>
          } />
        <Route
          path="/pagamento/:id"
          element={
            <DefaultLayout>
              <Pagamento />
            </DefaultLayout>
          }
        />
        <Route
          path="*"
          element={
            <DefaultLayout>
              <NotFound />
            </DefaultLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
