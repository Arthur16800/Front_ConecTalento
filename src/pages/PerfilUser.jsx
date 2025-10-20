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
import DeleteIcon from "@mui/icons-material/Delete";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import background2 from "../assets/background2.png";
import api from "../axios/axios";
import ModalBase from "../Components/ModalBase";

function PerfilUser() {
  const styles = Styles();
  const id_user = localStorage.getItem("id_usuario");
  const fileInputRef = useRef(null);

  const [openModal, setOpenModal] = useState(false);
  const [openModalSenha, setOpenModalSenha] = useState(false);
  const [openModalRedes, setOpenModalRedes] = useState(false);
  const [openModalEsqueci, setOpenModalEsqueci] = useState(false);

  const [editing, setEditing] = useState(false);
  const [hover, setHover] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    biografia: "",
    imagem: null,
  });

  const [senhas, setSenhas] = useState({
    senha_atual: "",
    nova_senha: "",
    confirmar_senha: "",
  });

  const [redes, setRedes] = useState({
    facebook: "",
    github: "",
    insta: "",
    pinterest: "",
    numero_telefone: "",
  });

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ open: false, severity: "", message: "" });

  // Estados para esqueci minha senha
  const [emailRecuperacao, setEmailRecuperacao] = useState("");
  const [codigo, setCodigo] = useState("");
  const [codigoEnviado, setCodigoEnviado] = useState(false);
  const [codigoValidado, setCodigoValidado] = useState(false);
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmSenha, setConfirmSenha] = useState("");

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

        setFormData({
          name: data.name,
          username: data.username,
          email: data.email,
          biografia: data.biografia,
          imagem: base64Src,
        });
        setAvatarPreview(base64Src);
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        showAlert("error", error.response?.data?.error || "Erro ao buscar usuário");
      }
    }
    getUserById();
  }, [id_user]);

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
  const handleOpenModalSenha = () => setOpenModalSenha(true);
  const handleCloseModalSenha = () => setOpenModalSenha(false);

  const handleOpenModalRedesSociais = () => setOpenModalRedes(true);
  const handleCloseModalRedesSociais = () => setOpenModalRedes(false);

  const handleOpenModalEsqueci = () => setOpenModalEsqueci(true);
  const handleCloseModalEsqueciSenha = () => {
    setOpenModalEsqueci(false);
    setCodigoEnviado(false);
    setCodigoValidado(false);
    setEmailRecuperacao("");
    setCodigo("");
    setNovaSenha("");
    setConfirmSenha("");
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
      if (imageToSend) data.append("imagens", imageToSend);

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
      setLoading(false);
      setEditing(false);
    } catch (error) {
      console.error("Erro no updateUser:", error);
      showAlert(
        "error",
        error.response?.data?.error || "Erro inesperado ao atualizar perfil."
      );
      setLoading(false);
    }
  }

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

  async function updatePassword() {
    setLoading(true);
    try {
      const response = await api.updatePassword(id_user, senhas);
      showAlert("success", response.data.message);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao atualizar senha:", error);
      showAlert("error", error.response?.data?.error);
      setLoading(false);
    }
  }

  async function deleteUser() {
    setLoading(true);
    try {
      const response = await api.deleteUser(id_user);
      showAlert("success", response.data.message);
      localStorage.clear();
      window.location.href = "/";
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
      showAlert("error", error.response?.data?.error);
      setLoading(false);
    }
  }

  // ================= ESQUECI MINHA SENHA =================
  const forgotPasswordSendCode = async () => {
    setLoading(true);
    try {
      const res = await api.forgotPassword({ email: emailRecuperacao });
      showAlert("success", res.data.message);
      setCodigoEnviado(true);
    } catch (err) {
      console.error(err);
      showAlert("error", err.response?.data?.error || "Erro ao enviar código");
    } finally {
      setLoading(false);
    }
  };

  const validarCodigo = async () => {
    setLoading(true);
    try {
      const res = await api.forgotPassword({
        email: emailRecuperacao,
        code: codigo,
        atualizar: false,
      });
      showAlert("success", res.data.message);
      setCodigoValidado(true);
    } catch (err) {
      console.error(err);
      showAlert("error", err.response?.data?.error || "Código inválido");
    } finally {
      setLoading(false);
    }
  };

  const atualizarSenhaEsquecida = async () => {
    if (novaSenha !== confirmSenha) {
      showAlert("error", "As senhas não coincidem.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.forgotPassword({
        email: emailRecuperacao,
        code: codigo,
        password: novaSenha,
        confirmPassword: confirmSenha,
        atualizar: true,
      });
      showAlert("success", res.data.message);
      handleCloseModalEsqueciSenha();
    } catch (err) {
      console.error(err);
      showAlert("error", err.response?.data?.error || "Erro ao atualizar senha");
    } finally {
      setLoading(false);
    }
  };

  return (
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
          <>
            <Button style={styles.editBtn} onClick={handleEditClick}>
              Editar Perfil
            </Button>
            <Button style={styles.editBtn} onClick={handleOpenModalRedesSociais}>
              Informações de Contato
            </Button>
            <Typography
              variant="body2"
              sx={{
                mt: 2,
                textDecoration: "underline",
                color: "#6D2AF0",
                cursor: "pointer",
                fontWeight: 600,
              }}
              onClick={handleOpenModalEsqueci}
            >
              Esqueci Minha Senha
            </Typography>
          </>
        )}
      </Box>

      {/* Form principal */}
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
          <>
            <Button
              style={styles.saveBtn}
              onClick={handleOpenModalSenha}
              disabled={loading}
            >
              {loading ? <CircularProgress size={20} color="inherit" /> : "Alterar Senha"}
            </Button>
            <Button
              style={styles.saveBtn}
              onClick={handleSaveClick}
              disabled={loading}
            >
              {loading ? <CircularProgress size={20} color="inherit" /> : "Salvar"}
            </Button>
          </>
        )}
      </Box>

      {/* MODAIS */}
      {/* Delete */}
      <ModalBase open={openModal} onClose={handleCloseModal}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "80%", padding: 3, textAlign: "center" }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: "#222", mb: 1 }}>
            Tem certeza que deseja deletar sua conta?
          </Typography>
          <Typography variant="body2" sx={{ color: "#555" }}>
            Essa ação é irreversível e todos os seus dados serão perdidos.
          </Typography>
          <Box sx={{ display: "flex", gap: 2, width: "100%", mt: 2 }}>
            <Button variant="outlined" sx={{ flex: 1 }} onClick={handleCloseModal}>Cancelar</Button>
            <Button variant="contained" sx={{ flex: 1 }} onClick={handleDeleteUser} disabled={loading}>Deletar</Button>
          </Box>
        </Box>
      </ModalBase>

      {/* Modal Esqueci Minha Senha */}
      <ModalBase open={openModalEsqueci} onClose={handleCloseModalEsqueciSenha}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 3.5, textAlign: "center" }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: "#222", mb: 2 }}>
            Esqueci Minha Senha
          </Typography>

          {!codigoValidado ? (
            <>
              <TextField
                required
                fullWidth
                margin="normal"
                label="E-mail"
                type="email"
                variant="outlined"
                value={emailRecuperacao}
                onChange={(e) => setEmailRecuperacao(e.target.value)}
                style={styles.camposForm}
                disabled={codigoEnviado}
              />
              {codigoEnviado && (
                <TextField
                  required
                  fullWidth
                  margin="normal"
                  label="Código"
                  variant="outlined"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  style={styles.camposForm}
                />
              )}
              <Button
                style={styles.saveBtn}
                onClick={codigoEnviado ? validarCodigo : forgotPasswordSendCode}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : codigoEnviado ? "Validar Código" : "Enviar Código"}
              </Button>
            </>
          ) : (
            <>
              <TextField
                required
                fullWidth
                margin="normal"
                label="Nova Senha"
                type="password"
                variant="outlined"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                style={styles.camposForm}
              />
              <TextField
                required
                fullWidth
                margin="normal"
                label="Confirmar Senha"
                type="password"
                variant="outlined"
                value={confirmSenha}
                onChange={(e) => setConfirmSenha(e.target.value)}
                style={styles.camposForm}
              />
              <Button
                style={styles.saveBtn}
                onClick={atualizarSenhaEsquecida}
                disabled={loading}
              >
                {loading ? <CircularProgress size={20} color="inherit" /> : "Atualizar Senha"}
              </Button>
            </>
          )}
        </Box>
      </ModalBase>
    </Box>
  );
}

function Styles() {
  return {
    container: { display: "flex", justifyContent: "space-between", gap: 30, padding: "24px 16px", maxWidth: "70%", margin: "0 auto" },
    leftCard: { maxWidth: 280, minWidth: 250, flex: 2, width: "100%", backgroundColor: "#fff", border: "1px solid #E5E5E5", borderRadius: 16, display: "flex", flexDirection: "column", alignItems: "center" },
    box_IMG: { height: 50, borderRadius: "16px 16px 0 0", backgroundImage: `url(${background2})`, backgroundSize: "cover", backgroundPosition: "center", marginBottom: 16, width: "100%" },
    user_perfil: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 12 },
    name_user: { display: "flex", alignItems: "center", justifyContent: "center", gap: 8, flexDirection: "row" },
    removeIcon: { color: "#7e7e7ea9", cursor: "pointer" },
    editBtn: { marginTop: 12, marginBottom: 12, borderRadius: 5, textTransform: "none", fontWeight: 700, padding: "10px 0", background: "linear-gradient(90deg, #7A2CF6 0%, #6D2AF0 100%)", color: "#fff", border: "none", width: "90%" },
    formPanel: { flex: 1, backgroundColor: "#fff", border: "1px solid #E5E5E5", borderRadius: 16, padding: 24, display: "flex", flexDirection: "column", alignItems: "center", minWidth: 400, maxWidth: 800 },
    formTitle: { fontSize: 20, fontWeight: 600, marginBottom: 8, textAlign: "center", color: "#222" },
    camposForm: { width: "100%", marginBottom: 16 },
    saveBtn: { marginTop: 12, borderRadius: 5, textTransform: "none", fontWeight: 700, padding: "10px 0", background: "linear-gradient(90deg, #7A2CF6 0%, #6D2AF0 100%)", color: "#fff", border: "none", width: "60%" },
  };
}

export default PerfilUser;
