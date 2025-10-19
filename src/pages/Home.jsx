import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Box, Grid } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import LikeButton from "../Components/likeButton";
import LoginPromptModal from "../Components/LoginPromptModal";
import sheets from "../axios/axios";
import Header from "../Components/Header";

const shuffleArray = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

function Home() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Carrega projetos
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await sheets.getAllProjects();
        const rawProjects = response?.data?.profile_projeto ?? [];
        const formatted = rawProjects.map((p) => ({
          ID_projeto: p.ID_projeto,
          titulo: p.titulo || "Sem título",
          total_curtidas: p.total_curtidas ?? 0,
          imagem: p.imagem ? `data:${p.tipo_imagem};base64,${p.imagem}` : null,
        }));
        const shuffled = shuffleArray(formatted);
        setProjects(shuffled);
        
        // Aplica filtro se houver termo na location.state
        if (location.state?.search) {
          const filtered = shuffled.filter((p) =>
            p.titulo.toLowerCase().includes(location.state.search.toLowerCase())
          );
          setFilteredProjects(filtered);
        } else {
          setFilteredProjects(shuffled);
        }
      } catch (err) {
        console.error("Erro ao buscar projetos:", err);
      }
    };
    fetchProjects();
  }, [location.state]);

  // Filtro
  const handleSearch = (query) => {
    if (!query) {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(
        projects.filter((p) =>
          p.titulo.toLowerCase().includes(query.toLowerCase())
        )
      );
    }
  };

  const handleCardClick = (id) => {
    const token = localStorage.getItem("token");
    if (!token) setOpenModal(true);
    else navigate(`/detalhesprojeto/${id}`);
  };

  return (
    <>
      <Header onSearch={handleSearch} />
      <Grid container spacing={2} sx={{ mt: 10, mb: 5 }}>
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <Grid key={project.ID_projeto} item xs={12} sm={6} md={4}>
              <Card
                sx={{
                  mt: 5,
                  borderRadius: 2,
                  bgcolor: "#fff",
                  boxShadow: 3,
                  cursor: "pointer",
                  "&:hover": { transform: "scale(1.03)" },
                  transition: "transform 0.3s",
                }}
                onClick={() => handleCardClick(project.ID_projeto)}
              >
                <Box
                  sx={{
                    width: "100%",
                    height: 180,
                    backgroundImage: project.imagem
                      ? `url(${project.imagem})`
                      : "none",
                    backgroundColor: project.imagem ? "transparent" : "#f0f0f0",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <CardContent>
                  <Typography variant="h6">{project.titulo}</Typography>
                  <Typography variant="body2">
                    {project.total_curtidas} Curtidas
                  </Typography>
                </CardContent>
                <Box
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    zIndex: 10,
                    backgroundColor: "white",
                    borderRadius: "50%",
                    padding: 0.5,
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
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography variant="h6" align="center" sx={{ mt: 5 }}>
              Nenhum projeto encontrado
            </Typography>
          </Grid>
        )}
      </Grid>
      <LoginPromptModal open={openModal} onClose={() => setOpenModal(false)} />
    </>
  );
}

export default Home;