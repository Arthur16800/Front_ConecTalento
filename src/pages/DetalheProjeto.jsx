import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  Button,
  Grid,
  CircularProgress,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import api from "../axios/axios";
import LikeButton from "../Components/likeButton";
import LoginPromptModal from "../Components/LoginPromptModal";
import BottonUpgrade from "../Components/BottonUpgrade";

function DetalhesProjeto({ imagesCount = 4 }) {
  const styles = Styles();
  const { id, id_projeto, projectId } = useParams();
  const navigate = useNavigate();
  const projetoId = Number(id || id_projeto || projectId || 1);

  const [imagens, setImagens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [projeto, setProjeto] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const [userPlan, setUserPlan] = useState({
    plan: null,
    authenticated: null,
  });

  // 🔹 Buscar imagens do projeto
  useEffect(() => {
    let ativo = true;

    async function carregarImagens() {
      setLoading(true);
      setErro(null);
      try {
        const res = await api.getProjectDetails(projetoId);
        if (!ativo) return;
        const dadosProjeto = res.data?.projeto;
        setProjeto(dadosProjeto);
        const imgs = res.data?.projeto?.imagens || [];
        setImagens(imgs);
      } catch (err) {
        console.error("Erro ao buscar imagens:", err);
        if (ativo) setErro(err);
      } finally {
        if (ativo) setLoading(false);
      }
    }

    carregarImagens();
    return () => {
      ativo = false;
    };
  }, [projetoId]);

  async function getUserById() {
    const authenticated = localStorage.getItem("authenticated");
    if (!authenticated) {
      setUserPlan(prev => ({ ...prev, authenticated: false }));
      return null;
    }
    const id_user = localStorage.getItem("id_usuario");
    try {
      const response = await api.getUserById(id_user);
      const plan = Boolean(response.data.profile.plano);
      setUserPlan(prev => ({ ...prev, plan, authenticated: true }));
      return plan;
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      alert("error");
    }
  }

  useEffect(() => {
    getUserById();
  }, []);


  // 🔹 Converter formatos de imagem
  const origin = "http://localhost:5000";
  const imageUrls =
    imagens && imagens.length > 0
      ? imagens.map((img) => {
        if (!img) return null;
        if (typeof img === "object" && img.imagem) {
          const base64 = img.imagem;
          const tipo = img.tipo_imagem || "image/jpeg";
          return `data:${tipo};base64,${base64}`;
        }
        if (typeof img === "string") {
          if (img.startsWith("http")) return img;
          if (img.startsWith("/")) return `${origin}${img}`;
          return `${origin}/${img}`;
        }
        return null;
      })
      : Array.from({ length: imagesCount }).map(
        (_, i) => `${origin}/api/v1/projectdetail/${projetoId}?index=${i}`
      );

  // 🔹 Garantir índice válido
  useEffect(() => {
    if (selectedIndex >= imageUrls.length) setSelectedIndex(0);
  }, [imageUrls]);

  return (
    <>
      {userPlan.plan === false && userPlan.authenticated === true ? <BottonUpgrade /> : null}

      <Container sx={styles.container}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Typography sx={styles.titulo}>
              {projeto?.titulo || "Título do Portfólio"}
            </Typography>


            <Card sx={styles.cardPrincipal}>
              {loading ? (
                <Box sx={styles.loaderBox}>
                  <CircularProgress />
                </Box>
              ) : erro ? (
                <Box sx={styles.imagemPrincipal}>Erro ao carregar imagens</Box>
              ) : imageUrls.length > 0 ? (
                <Box sx={{ ...styles.imagemContainer, position: "relative" }}>
                  <img
                    src={imageUrls[selectedIndex]}
                    alt={`Imagem ${selectedIndex + 1}`}
                    style={styles.imagemPrincipalImg}
                  />

                  {/* 🔹 LikeButton posicionado no canto superior direito */}
                  {projeto && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 60,
                        right: 60,
                        zIndex: 10,
                      }}
                    >
                      <LikeButton
                        projectId={projeto.ID_projeto}
                        initialLikes={projeto.total_curtidas ?? 0}
                        userId={localStorage.getItem("id_usuario")}
                        onRequireLogin={() => setOpenModal(true)}
                      />
                    </Box>
                  )}
                </Box>
              ) : (
                <Box sx={styles.imagemPrincipal}>Nenhuma imagem disponível</Box>
              )}
            </Card>

            {/* 🔹 Miniaturas */}
            <Grid container spacing={2} sx={styles.gridMiniaturas}>
              {imageUrls.map((src, index) => (
                <Grid item xs={6} sm={3} key={index}>
                  <Card
                    sx={{
                      p: 0.5,
                      cursor: "pointer",
                      border:
                        index === selectedIndex
                          ? "2px solid #7A2CF6"
                          : "1px solid #e0e0e0",
                      transition: "all 0.2s ease-in-out",
                      "&:hover": { transform: "scale(1.03)" },
                      boxShadow:
                        index === selectedIndex
                          ? "0 0 8px rgba(122,44,246,0.3)"
                          : "none",
                    }}
                    onClick={() => setSelectedIndex(index)}
                  >
                    <img
                      src={src}
                      alt={`miniatura ${index + 1}`}
                      style={styles.boxMiniImg}
                    />
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* 🔹 Descrição */}
            <Typography sx={styles.tituloDesc}>Descrição:</Typography>
            <Typography sx={styles.descricao}>
              {projeto?.descricao || "Sem descrição disponível."}
            </Typography>
          </Grid>

          {/* 🔹 Coluna Direita - Perfil do Autor */}
          <Grid item xs={12} md={4}>
            <Card sx={styles.cardPerfil}>
              <Avatar
                sx={styles.avatar}
                src={
                  projeto?.autor?.imagem
                    ? `data:${projeto.autor.tipo_imagem};base64,${projeto.autor.imagem}`
                    : undefined
                }
              />

              <CardContent>
                <Typography variant="h6" sx={styles.nome}>
                  {projeto?.autor?.nome || "Sem Autor disponível."}
                </Typography>
                <Button
                  variant="contained"
                  sx={styles.button}
                  onClick={() => {
                    if (projeto?.autor?.username) {
                      navigate(`/${projeto.autor.username}`);
                    }
                  }}
                >
                  Visualizar perfil
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* 🔹 Modal de login para curtidas */}
        <LoginPromptModal open={openModal} onClose={() => setOpenModal(false)} />
      </Container>
    </>

  );
}

/* 🎨 Estilos */
function Styles() {
  return {
    container: {
      py: 4,
      maxWidth: "100%",
    },
    titulo: {
      fontSize: 28,
      fontWeight: 700,
      color: "#222",
    },
    cardPrincipal: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      p: 2,
      mb: 3,
      borderRadius: 3,
      boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
      backgroundColor: "#fafafa",
    },
    loaderBox: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: 250,
    },
    imagemContainer: {
      width: "100%",
      borderRadius: 3,
      overflow: "hidden",
      backgroundColor: "#fff",
      border: "1px solid #ddd",
    },
    imagemPrincipalImg: {
      width: "100%",
      height: "auto",
      display: "block",
      objectFit: "contain",
      maxHeight: 500,
      margin: "0 auto",
    },
    imagemPrincipal: {
      textAlign: "center",
      color: "#777",
      py: 5,
    },
    gridMiniaturas: {
      mt: 2,
      mb: 4,
    },
    boxMiniImg: {
      width: "100%",
      height: 90,
      objectFit: "cover",
      borderRadius: 4,
      display: "block",
    },
    tituloDesc: {
      mt: 4,
      fontSize: 18,
      fontWeight: 600,
    },
    descricao: {
      mb: 6,
      textAlign: "justify",
      color: "#444",
    },
    cardPerfil: {
      textAlign: "center",
      p: 3,
      mt: { xs: 4, md: 8 },
      borderRadius: 3,
      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      backgroundColor: "#fff",
    },
    avatar: {
      width: 90,
      height: 90,
      mx: "auto",
      mb: 1.5,
    },
    nome: {
      mt: 1,
      fontWeight: 700,
      color: "#222",
    },
    button: {
      mt: 2,
      borderRadius: 3,
      textTransform: "none",
      fontWeight: 600,
      background: "linear-gradient(90deg, #7A2CF6 0%, #6D2AF0 100%)",
    },
  };
}

export default DetalhesProjeto;