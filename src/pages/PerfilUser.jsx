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
import BottonUpgrade from "../Components/BottonUpgrade";

function PerfilUser() {
  const styles = Styles();
  const id_user = localStorage.getItem("id_usuario");
  const fileInputRef = useRef(null);

  const [openModal, setOpenModal] = useState(false);
  const [openModalSenha, setOpenModalSenha] = useState(false);
  const [openModalEsqueci, setOpenModalEsqueci] = useState(false);
  const [openModalContato, setOpenModalContato] = useState(false);

  const [editing, setEditing] = useState(false);
  const [hover, setHover] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingSenha, setLoadingSenha] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    biografia: "",
    imagem: null,
  });

  const [senhaData, setSenhaData] = useState({
    senha_atual: "",
    nova_senha: "",
    confirmar_senha: "",
  });

  const [formContatoData, setFormContatoData] = useState({
    telefone: "",
    instagram: "",
    linkedin: "",
    github: "",
    pinterest: "",
  });

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [alert, setAlert] = useState({
    open: false,
    severity: "",
    message: "",
  });

  const [emailRecuperacao, setEmailRecuperacao] = useState("");
  const [codigo, setCodigo] = useState("");
  const [codigoEnviado, setCodigoEnviado] = useState(false);
  const [codigoValidado, setCodigoValidado] = useState(false);
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmSenha, setConfirmSenha] = useState("");

  const [userPlan, setUserPlan] = useState({
    plan: null,
    authenticated: null,
  });

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
        showAlert(
          "error",
          error.response?.data?.error || "Erro ao buscar usuário."
        );
      }
    }
    async function getContactInfo() {
      try {
        const response = await api.getExtraInfo(id_user);
        const data = response.data
        setFormContatoData({
          telefone: data.numero_telefone || "",
          instagram: data.link_insta || "",
          linkedin: data.link_facebook || "",
          github: data.link_github || "",
          pinterest: data.link_pinterest || "",
        });
      } catch (error) {
        console.error("Erro ao buscar informações de contato:", error);
      }
    }
    getUserById();
    getContactInfo();
  }, [id_user]);

  const showAlert = (severity, message) =>
    setAlert({ open: true, severity, message });
  const handleCloseAlert = () => setAlert({ ...alert, open: false });

  const handleInputChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleSenhaChange = (e) =>
    setSenhaData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleContatoChange = (e) =>
    setFormContatoData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);
  const handleOpenModalSenha = () => setOpenModalSenha(true);
  const handleCloseModalSenha = () => setOpenModalSenha(false);
  const handleOpenModalContato = () => setOpenModalContato(true);
  const handleCloseModalContato = () => setOpenModalContato(false);

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

      const img = response.data?.profile?.imagem;
      if (img) {
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
        error.response?.data?.error || "Erro ao atualizar perfil."
      );
    } finally {
      setLoading(false);
    }
  }

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

  async function handleUpdateContactInfo() {
    try {
      const response = await api.updateExtraInfo({
        link_insta: formContatoData.instagram,
        link_facebook: formContatoData.linkedin,
        link_github: formContatoData.github,
        link_pinterest: formContatoData.pinterest,
        numero_telefone: formContatoData.telefone,
        ID_user: id_user,
      });
      showAlert(
        "success",
        response.data.message || "Informações de contato atualizadas!"
      );
      handleCloseModalContato();
    } catch (error) {
      console.error("Erro ao atualizar informações de contato:", error);
      showAlert(
        "error",
        error.response?.data?.error || "Erro ao atualizar informações de contato."
      );
    }
  }

  async function handleUpdatePassword() {
    if (
      !senhaData.senha_atual ||
      !senhaData.nova_senha ||
      !senhaData.confirmar_senha
    ) {
      showAlert("error", "Preencha todos os campos.");
      return;
    }
    if (senhaData.nova_senha !== senhaData.confirmar_senha) {
      showAlert("error", "As novas senhas não coincidem.");
      return;
    }

    setLoadingSenha(true);
    try {
      const response = await api.updatePassword(id_user, {
        senha_atual: senhaData.senha_atual,
        nova_senha: senhaData.nova_senha,
      });
      showAlert(
        "success",
        response.data.message || "Senha atualizada com sucesso!"
      );
      setSenhaData({ senha_atual: "", nova_senha: "", confirmar_senha: "" });
      handleCloseModalSenha();
    } catch (error) {
      console.error("Erro ao atualizar senha:", error);
      showAlert(
        "error",
        error.response?.data?.error || "Erro ao atualizar senha."
      );
    } finally {
      setLoadingSenha(false);
    }
  }

  const handleAvatarClick = () => editing && fileInputRef.current.click();
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setAvatarPreview(URL.createObjectURL(file));
    setFormData((prev) => ({ ...prev, imagem: file }));
  };

  const handleOpenModalEsqueciSenha = () => setOpenModalEsqueci(true);
  const handleCloseModalEsqueciSenha = () => {
    setOpenModalEsqueci(false);
    setCodigoEnviado(false);
    setCodigoValidado(false);
    setEmailRecuperacao("");
    setCodigo("");
    setNovaSenha("");
    setConfirmSenha("");
  };

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
      showAlert(
        "error",
        err.response?.data?.error || "Erro ao atualizar senha"
      );
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <>
      {userPlan.plan === false && userPlan.authenticated === true ? (
        <BottonUpgrade />
      ) : null}

      <Box style={styles.container}>
        <Snackbar
          open={alert.open}
          autoHideDuration={3000}
          onClose={handleCloseAlert}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity={alert.severity} onClose={handleCloseAlert}>
            {alert.message}
          </Alert>
        </Snackbar>

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
                  inset: 0,
                  backgroundColor: "rgba(0,0,0,0.5)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "white",
                  opacity: hover ? 1 : 0,
                  transition: "opacity 0.3s",
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
              <Button style={styles.editBtn} onClick={handleOpenModalContato}>
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
                onClick={handleOpenModalEsqueciSenha}
              >
                Esqueci Minha Senha
              </Typography>
            </>
          )}
        </Box>

        <Box style={styles.formPanel}>
          <Typography style={styles.formTitle}>Perfil do Usuário</Typography>

          <TextField
            fullWidth
            label="Nome"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            disabled={!editing}
            style={styles.camposForm}
          />
          <TextField
            fullWidth
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            disabled={!editing}
            style={styles.camposForm}
          />
          <TextField
            fullWidth
            label="E-mail"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            disabled={!editing}
            style={styles.camposForm}
          />
          <TextField
            fullWidth
            label="Biografia"
            multiline
            rows={3}
            name="biografia"
            value={formData.biografia}
            onChange={handleInputChange}
            disabled={!editing}
            style={styles.camposForm}
          />

          {editing && (
            <>
              <Button
                variant="outlined"
                onClick={handleOpenModalSenha}
                style={styles.saveBtn}
              >
                Alterar Senha
              </Button>
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
            </>
          )}
        </Box>

        <ModalBase open={openModal} onClose={handleCloseModal}>
          <Box textAlign="center" p={3}>
            <Typography variant="h6" fontWeight={600}>
              Tem certeza que deseja deletar sua conta?
            </Typography>
            <Typography variant="body2" sx={{ color: "#555" }}>
              Essa ação é irreversível e todos os seus dados serão perdidos.
            </Typography>
            <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
              <Button
                variant="outlined"
                onClick={handleCloseModal}
                sx={{ flex: 1 }}
              >
                Cancelar
              </Button>
              <Button
                variant="contained"
                sx={{
                  flex: 1,
                  background: "linear-gradient(90deg,#F23A3A,#D12F2F)",
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

        <ModalBase open={openModalContato} onClose={handleCloseModalContato}>
          <Box textAlign="center" p={3} mt={-6}>
            <Typography variant="h6" fontWeight={600} mb={1}>
              Informações de Contato
            </Typography>

            <Box display="flex" flexDirection="column" gap={1.5}>
              <TextField
                fullWidth
                size="small"
                label="Telefone"
                name="telefone"
                value={formContatoData.telefone || ""}
                onChange={handleContatoChange}
              />
              <TextField
                fullWidth
                size="small"
                label="Instagram"
                name="instagram"
                value={formContatoData.instagram || ""}
                onChange={handleContatoChange}
              />
              <TextField
                fullWidth
                size="small"
                label="LinkedIn"
                name="linkedin"
                value={formContatoData.linkedin || ""}
                onChange={handleContatoChange}
              />
              <TextField
                fullWidth
                size="small"
                label="GitHub"
                name="github"
                value={formContatoData.github || ""}
                onChange={handleContatoChange}
              />
              <TextField
                fullWidth
                size="small"
                label="Pinterest"
                name="pinterest"
                value={formContatoData.pinterest || ""}
                onChange={handleContatoChange}
              />

              <Button
                variant="contained"
                sx={{
                  mt: 2,
                  borderRadius: 5,
                  background: "linear-gradient(90deg,#7A2CF6,#6D2AF0)",
                }}
                onClick={handleUpdateContactInfo}
              >
                Salvar Informações
              </Button>
            </Box>
          </Box>
        </ModalBase>

        <ModalBase open={openModalSenha} onClose={handleCloseModalSenha}>
          <Box textAlign="center" p={2}>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Alterar Senha
            </Typography>
            <TextField
              fullWidth
              label="Senha Atual"
              type="password"
              name="senha_atual"
              value={senhaData.senha_atual}
              onChange={handleSenhaChange}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Nova Senha"
              type="password"
              name="nova_senha"
              value={senhaData.nova_senha}
              onChange={handleSenhaChange}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Confirmar Nova Senha"
              type="password"
              name="confirmar_senha"
              value={senhaData.confirmar_senha}
              onChange={handleSenhaChange}
              sx={{ mb: 3 }}
            />
            <Button
              fullWidth
              variant="contained"
              sx={{
                borderRadius: 5,
                background: "linear-gradient(90deg,#7A2CF6,#6D2AF0)",
              }}
              onClick={handleUpdatePassword}
              disabled={loadingSenha}
            >
              {loadingSenha ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                "Salvar Nova Senha"
              )}
            </Button>
          </Box>
        </ModalBase>

        <ModalBase
          open={openModalEsqueci}
          onClose={handleCloseModalEsqueciSenha}
        >
          <Box textAlign="center" p={3}>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Esqueci Minha Senha
            </Typography>
            {!codigoValidado ? (
              <>
                <TextField
                  fullWidth
                  label="E-mail"
                  value={emailRecuperacao}
                  onChange={(e) => setEmailRecuperacao(e.target.value)}
                  disabled={codigoEnviado}
                  sx={{ mb: 2 }}
                />
                {codigoEnviado && (
                  <TextField
                    fullWidth
                    label="Código"
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                )}
                <Button
                  fullWidth
                  variant="contained"
                  onClick={
                    codigoEnviado ? validarCodigo : forgotPasswordSendCode
                  }
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : codigoEnviado ? (
                    "Validar Código"
                  ) : (
                    "Enviar Código"
                  )}
                </Button>
              </>
            ) : (
              <>
                <TextField
                  fullWidth
                  label="Nova Senha"
                  type="password"
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Confirmar Senha"
                  type="password"
                  value={confirmSenha}
                  onChange={(e) => setConfirmSenha(e.target.value)}
                  sx={{ mb: 3 }}
                />
                <Button
                  fullWidth
                  variant="contained"
                  onClick={atualizarSenhaEsquecida}
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    "Atualizar Senha"
                  )}
                </Button>
              </>
            )}
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
    removeIcon: { color: "#7e7e7ea9", cursor: "pointer" },
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
    camposForm: { width: "100%", marginBottom: 16 },
    saveBtn: {
      marginTop: 12,
      borderRadius: 5,
      textTransform: "none",
      fontWeight: 700,
      padding: "10px 0",
      background: "linear-gradient(90deg, #7A2CF6 0%, #6D2AF0 100%)",
      color: "#fff",
      border: "none",
      width: "60%",
    },
  };
}

export default PerfilUser;
