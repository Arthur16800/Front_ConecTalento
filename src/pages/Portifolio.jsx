import * as React from "react";
import { useState, useEffect } from "react";
import { Box, Typography, Avatar, IconButton } from "@mui/material";
import background2 from "../assets/background2.png";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EmailIcon from "@mui/icons-material/Email";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { useParams, useNavigate } from "react-router-dom";
import api from "../axios/axios";

function Portfolio() {
  const { username } = useParams();
  const navigate = useNavigate();
  const styles = Styles();

  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const usernameLocal = localStorage.getItem("username");
  const isOwner = usernameLocal === username;

  useEffect(() => {
    async function fetchUserAndProjects() {
      if (!username) return;

      setLoading(true);
      setError(null);

      try {
        const responseUser = await api.getByUsername(username);
        const dataUser = responseUser.data.profile;

        if (!dataUser) {
          setError("Página Não Encontrada");
          setLoading(false);
          return;
        }

        const isBase64 = dataUser.imagem?.startsWith("data:image");
        const base64Src = dataUser.imagem
          ? isBase64
            ? dataUser.imagem
            : `data:image/jpeg;base64,${dataUser.imagem}`
          : null;

        setUser({
          name: dataUser.name,
          email: dataUser.email,
          biografia: dataUser.biografia || "Nenhuma biografia cadastrada.",
          imagem: base64Src,
        });

        const responseProjects = await api.getProjectsByUserName(username);
        const dataProjects = responseProjects.data.profile_projeto || [];

        setProjects(
          dataProjects.map((p) => ({
            id: p.ID_projeto,
            title: p.titulo,
            total_curtidas: p.total_curtidas,
            imagem: p.imagem
              ? `data:${p.tipo_imagem};base64,${p.imagem}`
              : null,
          }))
        );
      } catch (error) {
        console.log("error:", error?.response?.data?.error);
        setError("Página Não Encontrada");
      }

      setLoading(false);
    }

    fetchUserAndProjects();
  }, [username]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <Typography variant="h6">Carregando...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "80vh",
          textAlign: "center",
        }}
      >
        <AccountCircleIcon sx={{ fontSize: 120, color: "#ccc" }} />
        <Typography variant="h5" sx={{ mt: 2 }}>
          {error}
        </Typography>
      </Box>
    );
  }

  if (!user) return null;

  return (
    <Box style={styles.container}>
      {/* Perfil do usuário */}
      <Box style={styles.box_user}>
        {user.imagem ? (
          <Avatar src={user.imagem} alt="Foto do perfil" sx={styles.avatar} />
        ) : (
          <AccountCircleIcon sx={styles.accountIcon} />
        )}

        <Box style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Typography style={styles.userName}>{user.name}</Typography>
          {isOwner && (
            <IconButton
              color="primary"
              size="small"
              onClick={() => navigate("/perfiluser")}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          )}
        </Box>

        <Typography style={styles.bio}>{user.biografia}</Typography>

        {/* Contatos */}
        <Box style={styles.box_contatos}>
          <Box style={styles.contato}></Box>
          <Box style={styles.contato}>
            <EmailIcon />
            <Typography>{user.email}</Typography>
          </Box>
        </Box>
      </Box>

      <Box style={styles.divider} />

      {/* Projetos */}
      <Box style={styles.box_projeto}>
        <Box style={styles.grid}>
          {projects.map((p) => (
            <Box
              key={p.id}
              style={styles.card}
            >
              <Box
                style={{
                  ...styles.preview,
                  backgroundImage: `url(${p.imagem || background2})`,
                }}
                onClick={() => navigate(`/detalhesprojeto/${p.id}`)}
              >
                <Box style={styles.likeBtn}>
                  <FavoriteBorderIcon fontSize="small" />
                </Box>
              </Box>
              <Box
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 12px",
                }}
              >
                <Typography style={styles.caption}>{p.title}</Typography>
                {isOwner && (
                  <IconButton
                    size="small"
                    onClick={() => navigate(`/updateprojeto/${p.id}`)}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
            </Box>
          ))}

          {isOwner && (
            <Box
              onClick={() => navigate("/criarProjeto")}
              sx={{
                ...styles.card, // seu estilo de card quadrado
                display: "flex",
                marginTop: 6,
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
                backgroundColor: "#E0E0E0",
                width: 150, // tamanho do card
                height: 150,
                borderRadius: 2, // borda levemente arredondada do card
              }}
            >
              {/* Círculo dentro do card */}
              <Box
                sx={{
                  width: 60, // tamanho do círculo
                  height: 60,
                  borderRadius: "50%",
                  backgroundColor: "#BDBDBD",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  transition: "0.2s",
                  "&:hover": {
                    backgroundColor: "#A0A0A0",
                  },
                }}
              >
                <AddIcon sx={{ fontSize: 30, color: "#fff" }} />
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}

function Styles() {
  return {
    container: {
      display: "flex",
      justifyContent: "space-between",
      gap: 32,
      padding: "24px 16px",
      width: "90%",
      margin: "0 auto",
      alignItems: "flex-start",
    },
    box_user: {
      padding: 10,
      maxWidth: 500,
      minWidth: 100,
      flex: 1,
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 10,
    },
    accountIcon: { color: "#E5E5E5", fontSize: 250 },
    avatar: {
      width: 200,
      height: 200,
      borderRadius: "50%",
      border: "4px solid #E5E5E5",
      objectFit: "cover",
    },
    userName: { fontWeight: 600, fontSize: 18, marginTop: 8 },
    bio: {
      maxWidth: 560,
      lineHeight: 1.6,
      fontSize: 16,
      textAlign: "left",
      marginTop: 8,
    },
    box_contatos: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      gap: 6,
      marginTop: 8,
    },
    contato: { display: "flex", alignItems: "center", gap: 8 },
    divider: {
      width: 1,
      background: "#D9D9D9",
      height: 560,
      alignSelf: "center",
    },
    box_projeto: {
      flex: 1,
      width: "100%",
      padding: "0 0 24px 0",
      display: "flex",
      flexDirection: "column",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(2, minmax(280px, 1fr))",
      gap: 24,
      width: "100%",
      justifyItems: "center",
    },
    card: {
      width: "100%",
      maxWidth: 360,
      background: "#F0F0F0",
      borderRadius: 8,
      padding: 0,
      overflow: "hidden",
      cursor: "pointer",
    },
    preview: {
      position: "relative",
      width: "100%",
      paddingTop: "56.25%",
      backgroundSize: "cover",
      backgroundPosition: "center",
    },
    likeBtn: {
      position: "absolute",
      top: 8,
      right: 8,
      width: 36,
      height: 36,
      borderRadius: "50%",
      background: "#FFF",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 1px 6px rgba(0,0,0,0.15)",
    },
    caption: { textAlign: "center", fontSize: 14 },
  };
}

export default Portfolio;
