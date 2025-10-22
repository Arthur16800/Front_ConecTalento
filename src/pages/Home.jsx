import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Chip,
  Stack,
  Snackbar,
  Alert,
  Pagination,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import LikeButton from "../Components/likeButton";
import LoginPromptModal from "../Components/LoginPromptModal";
import api from "../axios/axios";
import Header from "../Components/Header";
import BottonUpgrade from "../Components/BottonUpgrade";

function Home() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [ordenacao, setOrdenacao] = useState("maisRecentes");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const projetosPorPagina = 6;
  const navigate = useNavigate();

  const [userPlan, setUserPlan] = useState({
    plan: null,
    authenticated: null,
  });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.getAllProjects();
        let rawProjects = response?.data?.profile_projeto ?? [];
        console.log(response.data)

        const formattedProjects = rawProjects.map((p) => ({
          ID_projeto: p.ID_projeto,
          titulo: p.titulo || "Sem título",
          total_curtidas: p.total_curtidas ?? 0,
          imagem: p.imagem ? `data:${p.tipo_imagem};base64,${p.imagem}` : null,
        }));

        const sorted = formattedProjects.sort(
          (a, b) => b.ID_projeto - a.ID_projeto
        );

        setProjects(sorted);
        setFilteredProjects(sorted);
      } catch (err) {
        console.error("Erro ao buscar projetos:", err);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    const ordenados = [...projects];

    switch (ordenacao) {
      case "maisCurtidos":
        ordenados.sort((a, b) => b.total_curtidas - a.total_curtidas);
        break;
      case "menosCurtidos":
        ordenados.sort((a, b) => a.total_curtidas - b.total_curtidas);
        break;
      case "tituloAZ":
        ordenados.sort((a, b) => a.titulo.localeCompare(b.titulo));
        break;
      case "tituloZA":
        ordenados.sort((a, b) => b.titulo.localeCompare(a.titulo));
        break;
      case "maisRecentes":
      default:
        ordenados.sort((a, b) => b.ID_projeto - a.ID_projeto);
        break;
    }

    setFilteredProjects(ordenados);
    setCurrentPage(1);
  }, [ordenacao, projects]);

  async function getUserById() {
    const authenticated = localStorage.getItem("authenticated");
    if (!authenticated) {
      setUserPlan((prev) => ({ ...prev, authenticated: false }));
      return null;
    }
    const id_user = localStorage.getItem("id_usuario");
    try {
      const response = await api.getUserById(id_user);
      const plan = Boolean(response.data.profile.plano);
      setUserPlan((prev) => ({ ...prev, plan, authenticated: true }));
      return plan;
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      setSnackbarMessage("Erro ao buscar usuário");
      setSnackbarOpen(true);
    }
  }

  useEffect(() => {
    getUserById();
  }, []);

  const handleCardClick = (projectId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setOpenModal(true);
    } else {
      navigate(`/detalhesprojeto/${projectId}`);
    }
  };

  const handleSearch = (query) => {
    setCurrentPage(1);
    if (!query) {
      setFilteredProjects(projects);
    } else {
      const filtered = projects.filter((p) =>
        p.titulo.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProjects(filtered);
    }
  };

  // Paginação
  const indexUltimoProjeto = currentPage * projetosPorPagina;
  const indexPrimeiroProjeto = indexUltimoProjeto - projetosPorPagina;
  const projetosVisiveis = filteredProjects.slice(
    indexPrimeiroProjeto,
    indexUltimoProjeto
  );
  const totalPaginas = Math.ceil(filteredProjects.length / projetosPorPagina);

  return (
    <>
      {userPlan.plan === false && userPlan.authenticated === true ? (
        <BottonUpgrade />
      ) : null}

      <Header onSearch={handleSearch} />

      <Stack
        direction="row"
        spacing={1}
        sx={{
          flexWrap: "wrap",
          justifyContent: "center",
          mt: -10,
          mb: 3,
          gap: 1.5,
        }}
      >
        {[
          { label: "Mais recentes", value: "maisRecentes" },
          { label: "Mais curtidos", value: "maisCurtidos" },
          { label: "Menos curtidos", value: "menosCurtidos" },
          { label: "Título A-Z", value: "tituloAZ" },
          { label: "Título Z-A", value: "tituloZA" },
        ].map((filtro) => (
          <Chip
            key={filtro.value}
            label={filtro.label}
            clickable
            variant={ordenacao === filtro.value ? "filled" : "outlined"}
            color={ordenacao === filtro.value ? "primary" : "default"}
            onClick={() => setOrdenacao(filtro.value)}
            sx={{
              fontWeight: ordenacao === filtro.value ? 600 : 400,
              boxShadow:
                ordenacao === filtro.value
                  ? "0px 3px 6px rgba(0, 0, 0, 0.15)"
                  : "none",
              borderWidth: ordenacao === filtro.value ? 2 : 1,
              borderColor: ordenacao === filtro.value ? "#1976d2" : "#ccc",
              transition: "all 0.2s ease-in-out",
            }}
          />
        ))}
      </Stack>

      <Grid container spacing={2} sx={{ mb: 5 }}>
        {projetosVisiveis.length > 0 ? (
          projetosVisiveis.map((project) => (
            <Grid key={project.ID_projeto} item xs={12} sm={6} md={4}>
              <Card
                sx={{
                  mx: "auto",
                  mt: 2,
                  borderRadius: 2,
                  bgcolor: "#fff",
                  boxShadow: 3,
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  position: "relative",
                  transition: "transform 0.3s",
                  overflow: "visible",
                  maxWidth: 400,
                  "&:hover": { transform: "scale(1.03)" },
                }}
                onClick={() => handleCardClick(project.ID_projeto)}
              >
                <Box
                  sx={{
                    width: "100%",
                    height: 160,
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8,
                    position: "relative",
                    backgroundColor: project.imagem ? "transparent" : "#f0f0f0",
                    backgroundImage: project.imagem
                      ? `url(${project.imagem})`
                      : "none",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      top: 6,
                      right: 6,
                      zIndex: 10,
                      backgroundColor: "white",
                      borderRadius: "50%",
                      padding: 0.5,
                      boxShadow: 1,
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <LikeButton
                      projectId={project.ID_projeto}
                      userId={localStorage.getItem("id_usuario")}
                      initialLikes={project.total_curtidas}
                      onRequireLogin={() => setOpenModal(true)}
                    />
                  </Box>

                  {!project.imagem && (
                    <Typography
                      variant="body2"
                      color="gray"
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      Sem imagem
                    </Typography>
                  )}
                </Box>

                <CardContent
                  sx={{
                    padding: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h6" color="#000" sx={{ mb: 1 }}>
                    {project.titulo}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {/* {project.user.name}  */}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography
              variant="h6"
              color="textSecondary"
              align="center"
              sx={{ mt: 5 }}
            >
              Nenhum projeto encontrado
            </Typography>
          </Grid>
        )}
      </Grid>

      {/* Paginação */}
      {totalPaginas > 1 && (
        <Box display="flex" justifyContent="center" mt={2} mb={4}>
          <Pagination
            count={totalPaginas}
            page={currentPage}
            onChange={(e, page) => setCurrentPage(page)}
            color="primary"
            shape="rounded"
          />
        </Box>
      )}

      <LoginPromptModal open={openModal} onClose={() => setOpenModal(false)} />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="error"
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default Home;
