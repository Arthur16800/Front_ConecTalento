// Home.jsx
import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Box, Grid } from "@mui/material";
import LikeButton from "../Components/LikeButton";
import LoginPromptModal from "../Components/LoginPromptModal";
import sheets from "../axios/axios";

// Função para embaralhar array
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
  const [openModal, setOpenModal] = useState(false);
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await sheets.getAllProjects();
        const rawProjects = response?.data?.profile_projeto ?? [];

        const formattedProjects = rawProjects.map((p) => ({
          ID_projeto: p.ID_projeto,
          titulo: p.titulo || "Sem título",
          total_curtidas: p.total_curtidas ?? 0,
          imagem: p.imagem ? `data:${p.tipo_imagem};base64,${p.imagem}` : null,
        }));

        setProjects(shuffleArray(formattedProjects));
      } catch (err) {
        console.error("Erro ao buscar projetos:", err);
        setProjects([]);
      }
    };

    fetchProjects();
  }, []);

  return (
    <>
      <Grid container spacing={2} sx={{ mb: 5 }}>
        {projects.map((project) => (
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
                  borderRadius: 2,
                  mb: 2,
                  mt: 2,
                  bottom: "-20px",
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: project.imagem ? "transparent" : "#f0f0f0",
                  backgroundImage: project.imagem ? `url(${project.imagem})` : "none",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <Box
                  sx={{ position: "absolute", top: 8, right: 8 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <LikeButton
                    projectId={project.ID_projeto}
                    initialLikes={project.total_curtidas}
                    onRequireLogin={() => setOpenModal(true)}
                  />
                </Box>

                {!project.imagem && (
                  <Typography color="gray" variant="body2">
                    Sem imagem
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

      <LoginPromptModal open={openModal} onClose={() => setOpenModal(false)} />
    </>
  );
}

export default Home;
