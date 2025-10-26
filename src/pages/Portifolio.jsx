import * as React from "react";
import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Snackbar,
  Alert,
  Pagination,
} from "@mui/material";
import background2 from "../assets/background2.png";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EmailIcon from "@mui/icons-material/Email";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useParams, useNavigate } from "react-router-dom";
import api from "../axios/axios";
import LikeButton from "../Components/likeButton";
import ModalBase from "../Components/ModalBase";
import BottonUpgrade from "../Components/BottonUpgrade";
import NotFound from "./NotFound"; // para exibir a página 404

function Portfolio() {
  const { username } = useParams();
  const navigate = useNavigate();
  const styles = Styles();

  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [usernameLocal, setusernameLocal] = useState(null);

  const isOwner = usernameLocal === username;

  // paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const itemsPerPage = 4;

  // Modal
  const [openModal, setOpenModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const [userPlan, setUserPlan] = useState({
    plan: null,
    authenticated: null,
  });

  // Snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleDeleteProject = async () => {
    if (!selectedProject) return;

    try {
      const ID_user = localStorage.getItem("id_usuario");
      await api.deleteProject(selectedProject, ID_user);

      setProjects((prev) => prev.filter((p) => p.id !== selectedProject));
      setOpenModal(false);
      setSelectedProject(null);
      setSnackbar({
        open: true,
        message: "Projeto deletado com sucesso!",
        severity: "success",
      });
    } catch (error) {
      console.error("Erro ao deletar projeto:", error);
      setSnackbar({
        open: true,
        message: "Erro ao deletar o projeto.",
        severity: "error",
      });
      setOpenModal(false);
      setSelectedProject(null);
    }
  };

  useEffect(() => {
    async function fetchUserAndProjects() {
      if (!username) return;

      setLoading(true);
      setNotFound(false);

      try {
        const responseUser = await api.getByUsername(username);
        const dataUser = responseUser.data.profile;

        if (!dataUser) {
          setNotFound(true);
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
            imagem: p.imagem ? `data:${p.tipo_imagem};base64,${p.imagem}` : null,
          }))
        );

        setTotalPaginas(Math.ceil(dataProjects.length / itemsPerPage));
      } catch (error) {
        console.log("error:", error?.response?.data?.error);
        setNotFound(true);
      }

      setLoading(false);
    }

    fetchUserAndProjects();
  }, [username]);

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
      setusernameLocal(response.data.profile.username);
      setUserPlan((prev) => ({ ...prev, plan, authenticated: true }));
      return plan;
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      alert("error");
    }
  }

  useEffect(() => {
    getUserById();
  }, []);

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

  // Quando usuário não existe ou houve erro na busca
  if (notFound) {
    return <NotFound />;
  }

  if (!user) return null;

  // lógica de paginação
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedProjects = projects.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <>
      {userPlan.plan === false && userPlan.authenticated === true ? (
        <BottonUpgrade />
      ) : null}

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
          {isOwner && (
            <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 2 }}>
              <IconButton
                onClick={() => navigate("/criarProjeto")}
                sx={{
                  backgroundColor: "#1976d2",
                  color: "#fff",
                  "&:hover": { backgroundColor: "#1565c0" },
                  borderRadius: "50%",
                  width: 56,
                  height: 56,
                  boxShadow: "0px 3px 6px rgba(0,0,0,0.2)",
                }}
              >
                <AddIcon sx={{ fontSize: 32 }} />
              </IconButton>
            </Box>
          )}

          <Box style={styles.grid}>
            {displayedProjects.map((p) => (
              <Box
                key={p.id}
                style={styles.card}
                onClick={() => navigate(`/detalhesprojeto/${p.id}`)}
              >
                <Box
                  style={{
                    ...styles.preview,
                    backgroundImage: `url(${p.imagem || background2})`,
                  }}
                >
                  <Box style={styles.likeBtn}>
                    <LikeButton
                      projectId={p.id}
                      userId={localStorage.getItem("id_usuario")}
                      initialLikes={p.total_curtidas}
                    />
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
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/updateprojeto/${p.id}`);
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>

                      <IconButton
                        size="small"
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProject(p.id);
                          setOpenModal(true);
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  )}
                </Box>
              </Box>
            ))}
          </Box>

          {/* PAGINAÇÃO */}
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
        </Box>

        {/* Modal de confirmação */}
        <ModalBase open={openModal} onClose={() => setOpenModal(false)}>
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h6" sx={{ mt: 9, mb: 2 }}>
              Deseja realmente excluir este projeto?
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
              <button
                onClick={() => setOpenModal(false)}
                style={{
                  padding: "8px 16px",
                  background: "#ccc",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteProject}
                style={{
                  padding: "8px 16px",
                  background: "#e53935",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Excluir
              </button>
            </Box>
          </Box>
        </ModalBase>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
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
      borderRadius: 5,
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
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    caption: { textAlign: "center", fontSize: 14 },
  };
}

export default Portfolio;