import * as React from "react";
import { useState, useEffect, useRef } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  Avatar,
  Snackbar,
  Alert,
} from "@mui/material";
import background2 from "../assets/background2.png";
import DeleteIcon from "@mui/icons-material/Delete";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import api from "../axios/axios";
import ModalBase from "../Components/ModalBase";
import BottonUpgrade from "../Components/BottonUpgrade";

function PerfilUser() {
  const styles = Styles();
  const id_user = localStorage.getItem("id_usuario");
  const fileInputRef = useRef(null);
  const [openModal, setOpenModal] = useState(false);

  const [editing, setEditing] = useState(false);
  const [hover, setHover] = useState(false); // estado de hover no avatar
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    biografia: "",
    imagem: null,
  });

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    severity: "",
    message: "",
  });

  const [userPlan, setUserPlan] = useState({
    plan: null,
    authenticated: null,
  });

  // Carrega dados do usuário
  useEffect(() => {
    async function getUserById() {
      try {
        const response = await api.getUserById(id_user);
        const data = response.data.profile;

        const isBase64 = data.imagem?.startsWith("data:image");
        const base64Src = data.imagem
          ? isBase64
            ? data.imagem
            : `data:image/jpeg;base64,${data.imagem}`
          : null;

        setFormData((prev) => ({
          ...prev,
          name: data.name,
          username: data.username,
          email: data.email,
          biografia: data.biografia,
          imagem: base64Src,
        }));

        setAvatarPreview(base64Src);
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        showAlert(
          "error",
          error.response?.data?.error
        );
      }
    }
    getUserById();
  }, [id_user]);

  // Função de delete do usuário
  async function deleteUser() {
    setLoading(true);
    try {
      const response = await api.deleteUser(id_user);
      showAlert(
        "success",
        response.data.message || "Usuário deletado com sucesso!"
      );
      localStorage.clear();
      window.location.href = "/";
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
      showAlert(
        "error",
        error.response?.data?.error || "Erro ao deletar usuário."
      );
    } finally {
      setLoading(false);
    }
  }

  const showAlert = (severity, message) =>
    setAlert({ open: true, severity, message });
  const handleCloseAlert = () => setAlert({ ...alert, open: false });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);
  const handleDeleteUser = () => {
    deleteUser();
    handleCloseModal();
  };

  const handleEditClick = () => setEditing(true);
  const handleSaveClick = () => updateUser();

  function base64ToFile(base64, filename) {
    if (!base64) return null;
    const arr = base64.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  // Atualiza perfil do usuário
  async function updateUser() {
    setLoading(true);
    try {
      const data = new FormData();
      data.append("email", formData.email);
      data.append("biografia", formData.biografia);
      data.append("username", formData.username);
      data.append("name", formData.name);

      let imageToSend = formData.imagem;
      if (imageToSend && typeof imageToSend === "string") {
        imageToSend = base64ToFile(imageToSend, "perfil_atual.jpg");
      }

      if (imageToSend) {
        data.append("imagens", imageToSend);
      }

      const response = await api.updateUser(id_user, data);

      if (response.data?.profile?.imagem) {
        const img = response.data.profile.imagem;
        const isBase64 = img.startsWith("data:image");
        const base64Src = isBase64 ? img : `data:image/jpeg;base64,${img}`;
        setAvatarPreview(base64Src);
        setFormData((prev) => ({ ...prev, imagem: base64Src }));
      }

      showAlert(
        "success",
        response.data.message || "Perfil atualizado com sucesso!"
      );
      setEditing(false);
    } catch (error) {
      console.error("Erro no updateUser:", error);
      showAlert(
        "error",
        error.response?.data?.error
      );
    } finally {
      setLoading(false);
    }
  }

  // Avatar click (só permite enviar imagem se estiver editando)
  const handleAvatarClick = () => {
    if (!editing) return;
    fileInputRef.current.click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setAvatarPreview(URL.createObjectURL(file));
    setFormData((prev) => ({ ...prev, imagem: file }));
  };

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

  return (
    <>
      {userPlan.plan === false && userPlan.authenticated === true ? <BottonUpgrade /> : null}
      
      <Box style={styles.container}>
        <Snackbar
          open={alert.open}
          autoHideDuration={3000}
          onClose={handleCloseAlert}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseAlert}
            severity={alert.severity}
            sx={{ width: "100%" }}
          >
            {alert.message}
          </Alert>
        </Snackbar>

        {/* Card lateral */}
        <Box style={styles.leftCard}>
          <Box style={styles.box_IMG} />

          <Box style={styles.user_perfil}>
            <Box
              sx={{
                position: "relative",
                width: 100,
                height: 100,
                borderRadius: "50%",
                overflow: "hidden",
                border: "3px solid #ddd",
                cursor: editing ? "pointer" : "default",
              }}
              onClick={handleAvatarClick}
              onMouseEnter={() => editing && setHover(true)}
              onMouseLeave={() => editing && setHover(false)}
            >
              <Avatar
                src={avatarPreview}
                alt="Foto do perfil"
                sx={{ width: "100%", height: "100%" }}
              />
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundColor: "rgba(0,0,0,0.5)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "white",
                  opacity: hover ? 1 : 0,
                  transition: "opacity 0.3s",
                  pointerEvents: "none",
                }}
              >
                <CameraAltIcon />
              </Box>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleImageChange}
                disabled={!editing}
              />
            </Box>

            <Box style={styles.name_user}>
              <span style={styles.user_name}>{formData.name}</span>
              <DeleteIcon style={styles.removeIcon} onClick={handleOpenModal} />
            </Box>
          </Box>

          {!editing && (
            <Button style={styles.editBtn} onClick={handleEditClick}>
              Editar Perfil
            </Button>
          )}
        </Box>

        {/* Painel de formulário */}
        <Box style={styles.formPanel}>
          <Typography style={styles.formTitle}>Perfil do Usuário</Typography>

          <TextField
            required
            fullWidth
            margin="normal"
            label="Nome"
            variant="outlined"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            disabled={!editing}
            style={styles.camposForm}
          />

          <TextField
            required
            fullWidth
            margin="normal"
            label="Username"
            variant="outlined"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            disabled={!editing}
            style={styles.camposForm}
          />

          <TextField
            required
            fullWidth
            margin="normal"
            label="E-mail"
            type="email"
            variant="outlined"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            disabled={!editing}
            style={styles.camposForm}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Biografia"
            multiline
            rows={3}
            variant="outlined"
            name="biografia"
            value={formData.biografia}
            onChange={handleInputChange}
            disabled={!editing}
            style={styles.camposForm}
          />

          {editing && (
            <Button
              style={styles.saveBtn}
              onClick={handleSaveClick}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                "Salvar"
              )}
            </Button>
          )}
        </Box>

        <ModalBase open={openModal} onClose={handleCloseModal}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "80%",
              padding: 3,
              textAlign: "center",
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, color: "#222", mb: 1 }}
            >
              Tem certeza que deseja deletar sua conta?
            </Typography>
            <Typography variant="body2" sx={{ color: "#555" }}>
              Essa ação é irreversível e todos os seus dados serão perdidos.
            </Typography>

            <Box sx={{ display: "flex", gap: 2, width: "100%", mt: 2 }}>
              <Button
                variant="outlined"
                sx={{
                  flex: 1,
                  borderRadius: 5,
                  borderColor: "#ccc",
                  color: "#555",
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                    borderColor: "#bbb",
                  },
                }}
                onClick={handleCloseModal}
              >
                Cancelar
              </Button>

              <Button
                variant="contained"
                sx={{
                  flex: 1,
                  borderRadius: 5,
                  background: "linear-gradient(90deg, #F23A3A 0%, #D12F2F 100%)",
                  color: "#fff",
                  "&:hover": {
                    background:
                      "linear-gradient(90deg, #D12F2F 0%, #B82828 100%)",
                  },
                }}
                onClick={handleDeleteUser}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  "Deletar"
                )}
              </Button>
            </Box>
          </Box>
        </ModalBase>
      </Box>

    </>

  );
}

function Styles() {
  return {
    container: {
      display: "flex",
      justifyContent: "space-between",
      gap: 30,
      padding: "24px 16px",
      maxWidth: "70%",
      margin: "0 auto",
    },
    leftCard: {
      maxWidth: 280,
      minWidth: 250,
      flex: 2,
      width: "100%",
      height: "10%",
      backgroundColor: "#fff",
      border: "1px solid #E5E5E5",
      borderRadius: 16,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    box_IMG: {
      height: 50,
      borderRadius: "16px 16px 0 0",
      backgroundImage: `url(${background2})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      marginBottom: 16,
      width: "100%",
    },
    user_perfil: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      marginBottom: 12,
    },
    name_user: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      flexDirection: "row",
    },
    removeIcon: {
      color: "#7e7e7ea9",
      cursor: "pointer",
    },
    editBtn: {
      marginTop: 12,
      marginBottom: 12,
      borderRadius: 5,
      textTransform: "none",
      fontWeight: 700,
      padding: "10px 0",
      background: "linear-gradient(90deg, #7A2CF6 0%, #6D2AF0 100%)",
      color: "#fff",
      border: "none",
      width: "90%",
    },
    formPanel: {
      flex: 1,
      backgroundColor: "#fff",
      border: "1px solid #E5E5E5",
      borderRadius: 16,
      padding: 24,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      minWidth: 400,
      maxWidth: 800,
    },
    formTitle: {
      fontSize: 20,
      fontWeight: 600,
      marginBottom: 8,
      textAlign: "center",
      color: "#222",
    },
    camposForm: {
      width: "100%",
      maxWidth: 560,
    },
    saveBtn: {
      width: "20%",
      marginTop: 16,
      borderRadius: 5,
      textTransform: "none",
      fontWeight: 700,
      padding: "12px 0",
      background: "linear-gradient(90deg, #7A2CF6 0%, #6D2AF0 100%)",
      color: "#fff",
      border: "none",
    },
    content: {
      display: "flex",
      flexDirection: "column",
      gap: 16,
      padding: 16,
      alignItems: "center",
    },
    button: {
      background: "linear-gradient(90deg, #F23A3A 0%, #D12F2F 100%)",
      color: "#fff",
      borderRadius: 5,
      width: "100%",
    },
  };
}

export default PerfilUser;
