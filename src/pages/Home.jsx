import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Box, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
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

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await sheets.getAllProjects();
        let rawProjects = response?.data?.profile_projeto ?? [];

        const formattedProjects = rawProjects.map((p) => ({
          ID_projeto: p.ID_projeto,
          titulo: p.titulo || "Sem título",
          total_curtidas: p.total_curtidas ?? 0,
          imagem: p.imagem ? `data:${p.tipo_imagem};base64,${p.imagem}` : null,
        }));

        const shuffled = shuffleArray(formattedProjects);
        setProjects(shuffled);
        setFilteredProjects(shuffled);
      } catch (err) {
        console.error("Erro ao buscar projetos:", err);
      }
    };

    fetchProjects();
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
    if (!query) {
      setFilteredProjects(projects);
    } else {
      const filtered = projects.filter((p) =>
        p.titulo.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProjects(filtered);
    }
  };

  return (
    <>
      <Header onSearch={handleSearch} />

      <Grid container spacing={2} sx={{ mb: 5 }}>
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
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  position: "relative",
                  transition: "transform 0.3s",
                  overflow: "visible",
                  "&:hover": { transform: "scale(1.03)" },
                }}
                onClick={() => handleCardClick(project.ID_projeto)}
              >
                <Box
                  sx={{
                    width: "100%",
                    height: 180,
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
                      top: 8,
                      right: 8,
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
                    {project.total_curtidas} Curtidas
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

      <LoginPromptModal open={openModal} onClose={() => setOpenModal(false)} />
    </>
  );
}

export default Home;
