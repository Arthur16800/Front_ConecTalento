import * as React from "react";
import { useState, useEffect } from "react";
import { Box, Typography, Avatar } from "@mui/material";
import background2 from "../assets/background2.png";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import InstagramIcon from "@mui/icons-material/Instagram";
import EmailIcon from "@mui/icons-material/Email";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useParams } from "react-router-dom";
import api from "../axios/axios";
import BottonUpgrade from "../Components/BottonUpgrade";

function Portfolio() {
  const Params = useParams();
  const styles = Styles();

  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [userPlan, setUserPlan] = useState({
    plan: null,
    authenticated: null,
  });

  const projects = [
    { id: 1, title: "design sapato" },
    { id: 2, title: "design sapato" },
    { id: 3, title: "design sapato" },
  ];

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

  useEffect(() => {
    async function getByUsername() {
      if (!Params.username) return;

      setLoading(true);
      setError(null);
      setUser(null);

      try {
        const response = await api.getByUsername(Params.username);
        const data = response.data.profile;

        const isBase64 = data.imagem?.startsWith("data:image");
        const base64Src = data.imagem
          ? isBase64
            ? data.imagem
            : `data:image/jpeg;base64,${data.imagem}`
          : null;

        setUser({
          name: data.name,
          email: data.email,
          biografia: data.biografia || "Nenhuma biografia cadastrada.",
          imagem: base64Src,
        });
      } catch (error) {
        console.log("error:", error?.response?.data?.error);
        setError("Página Não Encontrada");
      }
      setLoading(false);
    }

    getByUsername();
  }, [Params.username]);

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
    <>
      {userPlan.plan === false && userPlan.authenticated === true ? <BottonUpgrade /> : null}

      <Box style={styles.container}>
        <Box style={styles.box_user}>
          {user.imagem ? (
            <Avatar src={user.imagem} alt="Foto do perfil" sx={styles.avatar} />
          ) : (
            <AccountCircleIcon sx={styles.accountIcon} />
          )}

          <Typography style={styles.userName}>{user.name}</Typography>

          <Typography style={styles.bio}>{user.biografia}</Typography>

          <Box style={styles.box_contatos}>
            <Box style={styles.contato}>
              <InstagramIcon />
              <Typography>teste</Typography>
            </Box>
            <Box style={styles.contato}>
              <EmailIcon />
              <Typography>{user.email}</Typography>
            </Box>
          </Box>
        </Box>

        <Box style={styles.divider} />

        <Box style={styles.box_projeto}>
          <Box style={styles.grid}>
            {projects.map((p) => (
              <Box key={p.id} style={styles.card}>
                <Box
                  style={{
                    ...styles.preview,
                    backgroundImage: `url(${background2})`,
                  }}
                >
                  <Box style={styles.likeBtn}>
                    <FavoriteBorderIcon fontSize="small" />
                  </Box>
                </Box>
                <Typography style={styles.caption}>{p.title}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </>

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
    accountIcon: {
      color: "#E5E5E5",
      fontSize: 250,
    },
    avatar: {
      width: 200,
      height: 200,
      borderRadius: "50%",
      border: "4px solid #E5E5E5",
      objectFit: "cover",
    },
    userName: {
      fontWeight: 600,
      fontSize: 18,
      marginTop: 8,
    },
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
    contato: {
      display: "flex",
      alignItems: "center",
      gap: 8,
    },
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
    },
    preview: {
      position: "relative",
      width: "100%",
      paddingTop: "56.25%", // 16:9
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
    caption: {
      textAlign: "center",
      padding: "10px 12px 14px",
      fontSize: 14,
    },
  };
}

export default Portfolio;
