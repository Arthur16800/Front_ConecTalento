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
import NotFound from "./NotFound";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import PinterestIcon from "@mui/icons-material/Pinterest";
import PhoneIcon from "@mui/icons-material/Phone";

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
          extrainfo: dataUser.extrainfo || {},
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

  if (notFound) return <NotFound />;
  if (!user) return null;

  // paginação
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedProjects = projects.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <>
      {/* CSS RESPONSIVO */}
      <style>{`
  '''''/* Base: leve redução já no desktop médio */
  .portfolio-container { max-width: 1200px; }
  .projects-grid { gap: 22px !important; }
  .card-project { max-width: 340px !important; }
  .card-project .preview { padding-top: 54% !important; } /* pouco mais baixo */

  /* <= 1100px: diminuir min-width e o max do card */
  @media (max-width: 1100px) {
    .projects-grid {
      grid-template-columns: repeat(2, minmax(220px, 1fr)) !important;
      gap: 20px !important;
    }
    .card-project { max-width: 320px !important; }
    .card-project .preview { padding-top: 52% !important; }
  }

  /* <= 900px: 1 coluna e cards mais compactos */
  @media (max-width: 900px) {
    .projects-grid {
      grid-template-columns: 1fr !important;
      gap: 18px !important;
    }
    .avatar-img { width: 160px !important; height: 160px !important; }
    .bio-text { font-size: 15px !important; }
    .card-project { max-width: 300px !important; margin: 0 auto !important; }
    .card-project .preview { padding-top: 50% !important; }
  }

  /* <= 768px: layout em coluna; card ocupa a linha mas com altura menor */
  @media (max-width: 768px) {
    .portfolio-container {
      flex-direction: column !important;
      align-items: stretch !important;
      gap: 24px !important;
      padding: 16px 12px !important;
      width: 95% !important;
    }
    .divider-vert { display: none !important; }
    .user-panel { align-items: center !important; padding: 8px !important; }
    .projects-panel { padding-bottom: 16px !important; }

    .card-project {
      max-width: 100% !important;
      width: 100% !important;
    }
    .card-project .preview { padding-top: 48% !important; }
  }

    /* <= 600px: mais redução de espaços e botão de like menor */
    @media (max-width: 600px) {
      .projects-grid { gap: 14px !important; }
      .card-project { border-radius: 6px !important; }
      .card-project .preview { padding-top: 46% !important; }
      .user-name { font-size: 16px !important; }
      .bio-text { font-size: 14px !important; line-height: 1.5 !important; }
      .likeBtn { width: 32px !important; height: 32px !important; top: 6px !important; right: 6px !important; }
      .caption { font-size: 13px !important; }
    }

    /* <= 480px: o mais compacto (evita “pular” e barra horizontal) */
    @media (max-width: 480px) {
      .projects-grid { gap: 12px !important; }
      .card-project { max-width: 100% !important; }
      .card-project .preview { padding-top: 44% !important; }
      .caption { font-size: 12.5px !important; }
    }
`}</style>

      {userPlan.plan === false && userPlan.authenticated === true ? (
        <BottonUpgrade />
      ) : null}

      <Box style={styles.container} className="portfolio-container">
        {/* Perfil do usuário */}
        <Box style={styles.box_user} className="user-panel">
          {user.imagem ? (
            <Avatar
              src={user.imagem}
              alt="Foto do perfil"
              sx={styles.avatar}
              className="avatar-img"
            />
          ) : (
            <AccountCircleIcon sx={styles.accountIcon} />
          )}

          <Box style={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography style={styles.userName} className="user-name">
              {user.name}
            </Typography>
            {isOwner && (
              <IconButton size="small" onClick={() => navigate("/perfiluser")}>
                <EditIcon fontSize="small" sx={{ color: "#6A22F0" }} />
              </IconButton>
            )}
          </Box>

          <Typography style={styles.bio} className="bio-text">
            {user.biografia}
          </Typography>

          {/* Contatos */}
          <Box style={styles.box_contatos}>
            <Box style={styles.contato}>
              <EmailIcon />
              <Typography>{user.email}</Typography>
            </Box>

            {user.extrainfo?.numero_telefone && (
              <Box style={styles.contato}>
                <PhoneIcon />
                <Typography>{user.extrainfo.numero_telefone}</Typography>
              </Box>
            )}

            {user.extrainfo?.link_insta && (
              <Box style={styles.contato}>
                <InstagramIcon color="secondary" />
                <Typography
                  component="a"
                  href={user.extrainfo.link_insta}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ textDecoration: "none", color: "inherit" }}
                >
                  Instagram
                </Typography>
              </Box>
            )}

            {user.extrainfo?.link_facebook && (
              <Box style={styles.contato}>
                <FacebookIcon color="primary" />
                <Typography
                  component="a"
                  href={user.extrainfo.link_facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ textDecoration: "none", color: "inherit" }}
                >
                  Facebook
                </Typography>
              </Box>
            )}

            {user.extrainfo?.link_github && (
              <Box style={styles.contato}>
                <GitHubIcon />
                <Typography
                  component="a"
                  href={user.extrainfo.link_github}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ textDecoration: "none", color: "inherit" }}
                >
                  GitHub
                </Typography>
              </Box>
            )}

            {user.extrainfo?.link_pinterest && (
              <Box style={styles.contato}>
                <PinterestIcon sx={{ color: "#E60023" }} />
                <Typography
                  component="a"
                  href={user.extrainfo.link_pinterest}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ textDecoration: "none", color: "inherit" }}
                >
                  Pinterest
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        <Box style={styles.divider} className="divider-vert" />

        {/* Projetos */}
        <Box style={styles.box_projeto} className="projects-panel">
          {isOwner && (
            <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 2 }}>
              <IconButton
                onClick={() => navigate("/criarProjeto")}
                sx={{
                  backgroundColor: "#6A22F0",
                  color: "#fff",
                  "&:hover": { backgroundColor: "#54007aff" },
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

          <Box style={styles.grid} className="projects-grid">
            {displayedProjects.map((p) => (
              <Box
                key={p.id}
                style={styles.card}
                className="card-project"
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
                    <Box sx={{ display: "flex" }}>
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

        {/* Modal, Snackbar (inalterados) */}
        <ModalBase open={openModal} onClose={() => setOpenModal(false)}>
          <Box
            sx={{
              p: 3,
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                mb: 3,
                fontWeight: 600,
                color: "text.primary",
              }}
            >
              Deseja realmente excluir este projeto?
            </Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 2,
              }}
            >
              <button
                onClick={() => setOpenModal(false)}
                style={{
                  padding: "10px 22px",
                  background: "#64058fff",
                  color: "#ffffffff",
                  border: "none",
                  borderRadius: "6px",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "background 0.2s ease",
                }}
                onMouseEnter={(e) => (e.target.style.background = "#5a0283ff")}
                onMouseLeave={(e) => (e.target.style.background = "#64058fff")}
              >
                Cancelar
              </button>

              <button
                onClick={handleDeleteProject}
                style={{
                  padding: "10px 22px",
                  background: "#d32f2f",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "background 0.2s ease",
                }}
                onMouseEnter={(e) => (e.target.style.background = "#b71c1c")}
                onMouseLeave={(e) => (e.target.style.background = "#d32f2f")}
              >
                Excluir
              </button>
            </Box>
          </Box>
        </ModalBase>

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
