import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Box, Grid } from "@mui/material";
import LikeButton from "../Components/LikeButton";
import LoginPromptModal from "../Components/LoginPromptModal";
import sheets from "../axios/axios";

// Função para embaralhar o array
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function Home() {
  const [projects, setProjects] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await sheets.getAllProjects();
        console.log("Projetos recebidos do backend:", response.data);
        // extrair o array real
        const projectArray = response.data.profile_projeto || [];
        setProjects(shuffleArray(projectArray));
      } catch (error) {
        console.error("Erro ao buscar projetos:", error);
        setProjects([]);
      }
    }
    fetchProjects();
  }, []);

  // Se não houver projetos, cria templates
  const displayProjects =
    projects.length > 0
      ? projects
      : Array.from({ length: 6 }).map((_, i) => ({
          ID_projeto: `template-${i}`,
          titulo: "Projeto em breve",
          imagem: null,
          total_curtidas: 0,
          isTemplate: true,
        }));

  return (
    <>
      <Grid container spacing={2} sx={{ mb: 5 }}>
        {displayProjects.map((project) => (
          <Grid key={project.ID_projeto} item xs={12} sm={6} md={4}>
            <Card
              sx={{
                mt: 5,
                borderRadius: 2,
                mx: 5,
                bgcolor: "#D9D9D9",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
              onClick={() => {
                if (!isLoggedIn) setOpenModal(true);
              }}
            >
              <Box
                sx={{
                  width: "80%",
                  height: 120,
                  bgcolor: "white",
                  borderRadius: 2,
                  mb: 2,
                  mt: 2,
                  bottom: "-20px",
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {/* LikeButton */}
                <Box
                  sx={{ position: "absolute", top: 8, right: 8 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <LikeButton
                    projectId={project.ID_projeto}
                    initialLikes={project.total_curtidas || 0}
                    onRequireLogin={() => setOpenModal(true)}
                  />
                </Box>

                {project.imagem || project.imagem_url ? (
                  <img
                    src={project.imagem || project.imagem_url}
                    alt={project.titulo}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: 8,
                    }}
                  />
                ) : (
                  <Typography color="gray" variant="body2">
                    {project.isTemplate ? "Imagem em breve" : "Sem imagem"}
                  </Typography>
                )}
              </Box>

              <CardContent>
                <Typography variant="h6" color="#000">
                  {project.titulo}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Modal de login global */}
      <LoginPromptModal open={openModal} onClose={() => setOpenModal(false)} />
    </>
  );
}

export default Home;
