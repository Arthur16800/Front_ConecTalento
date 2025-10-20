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
import ProtectedRoute from "./Components/ProtectedRoutes";

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
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />

        <Route
          path="/criarProjeto"
          element={
            <ProtectedRoute>
              <DefaultLayout>
                <CriarProjeto />
              </DefaultLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/perfiluser"
          element={
            <ProtectedRoute>
              <DefaultLayout>
                <PerfilUser />
              </DefaultLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/updateprojeto/:ID_projeto"
          element={
            <ProtectedRoute>
              <DefaultLayout>
                <UpdateProjeto />
              </DefaultLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/:username"
          element={
            <ProtectedRoute>
              <DefaultLayout>
                <Portfolio />
              </DefaultLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/detalhesprojeto/:id"
          element={
            <ProtectedRoute>
              <DefaultLayout>
                <DetalhesProjeto />
              </DefaultLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/pagamento/:id"
          element={
            <ProtectedRoute>
              <DefaultLayout>
                <Pagamento />
              </DefaultLayout>
            </ProtectedRoute>
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
