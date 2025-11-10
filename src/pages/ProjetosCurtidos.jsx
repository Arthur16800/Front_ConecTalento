import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Pagination,
  Stack,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import LikeButton from "../Components/likeButton";
import LoginPromptModal from "../Components/LoginPromptModal";
import api from "../axios/axios";
import BottonUpgrade from "../Components/BottonUpgrade";

function ProjetosCurtidos() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [ordenacao, setOrdenacao] = useState("maisRecentes");
  const [currentPage, setCurrentPage] = useState(1);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const projetosPorPagina = 6;
  const navigate = useNavigate();
  const [userPlan, setUserPlan] = useState({ plan: null, authenticated: null });

  const id_user = localStorage.getItem("id_usuario");

  async function getUserById() {
    const authenticated = localStorage.getItem("authenticated");
    if (!authenticated) {
      setUserPlan((prev) => ({ ...prev, authenticated: false }));
      return null;
    }
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
  }, [id_user]);

  useEffect(() => {
    const fetchLikedProjects = async () => {
      try {
        const response = await api.getProjectsLikedUser(id_user);
        let rawProjects = response?.data?.profile_projeto ?? [];

        if (rawProjects.length === 0) {
          setProjects([]);
          setFilteredProjects([]);
        } else {
          const formattedProjects = rawProjects.map((p) => ({
            ID_projeto: p.ID_projeto,
            titulo: p.titulo || "Sem título",
            total_curtidas: p.total_curtidas ?? 0,
            imagem: p.imagem
              ? `data:${p.tipo_imagem};base64,${p.imagem}`
              : null,
          }));

          const sorted = formattedProjects.sort(
            (a, b) => b.ID_projeto - a.ID_projeto
          );

          setProjects(sorted);
          setFilteredProjects(sorted);
        }
      } catch (err) {
        console.error("Erro ao buscar projetos curtidos:", err);
      }
    };

    fetchLikedProjects();
  }, [id_user]);

  useEffect(() => {
    setCurrentPage(1);
  }, [ordenacao, projects]);

  const indexUltimoProjeto = currentPage * projetosPorPagina;
  const indexPrimeiroProjeto = indexUltimoProjeto - projetosPorPagina;
  const projetosVisiveis = filteredProjects.slice(
    indexPrimeiroProjeto,
    indexUltimoProjeto
  );
  const totalPaginas = Math.max(
    1,
    Math.ceil(filteredProjects.length / projetosPorPagina)
  );

  const handleCardClick = (projectId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setOpenModal(true);
    } else {
      navigate(`/detalhesprojeto/${projectId}`);
    }
  };

  return (
    <>
      {userPlan.plan === false && userPlan.authenticated === true && (
        <BottonUpgrade />
      )}

      {projetosVisiveis.length > 0 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            mt: { xs: -3, sm: -5, md: -7 },
            mb: 4,
            textAlign: "center",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "1.6rem", sm: "2rem", md: "2.4rem" },
              color: "black",
              WebkitBackgroundClip: "text",
              textShadow: "1px 1px 4px rgba(0,0,0,0.15)",
              letterSpacing: "0.5px",
              textAlign: "center",
              mt: 5
            }}
          >
            Projetos Curtidos
          </Typography>
        </Box>
      )}

      <Grid
        container
        spacing={2}
        sx={{
          mb: 5,
          px: { xs: 2, sm: 4 }, // padding lateral igual à Home
          justifyContent: "flex-start",
          mt: 0,
        }}
      >
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
                  {/* Botão Like responsivo como na Home */}
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
                      transition: "all 0.3s ease-in-out",
                      "@media (max-width:500px)": {
                        right: "auto",
                        left: 6,
                        transform: "scale(0.9)",
                      },
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
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ textAlign: "center" }}
                  >
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography
            variant="body1"
            align="center"
            sx={{ width: "100%", mt: 3 }}
          >
            Nenhum projeto curtido ainda.
          </Typography>
        )}
      </Grid>

      {totalPaginas > 1 && (
        <Stack alignItems="center" mt={4} mb={6}>
          <Pagination
            count={totalPaginas}
            page={currentPage}
            onChange={(e, value) => setCurrentPage(value)}
            color="primary"
          />
        </Stack>
      )}

      <LoginPromptModal open={openModal} onClose={() => setOpenModal(false)} />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert severity="error">{snackbarMessage}</Alert>
      </Snackbar>
    </>
  );
}

export default ProjetosCurtidos;
