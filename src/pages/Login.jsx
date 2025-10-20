import * as React from "react";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import background2 from "../assets/background2.png";
import logo from "../assets/logo_ct.png";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Link, useNavigate } from "react-router-dom";
import api from "../axios/axios";
import { Snackbar, Alert, CircularProgress } from "@mui/material"; // Import do Snackbar e CircularProgress
import ModalBase from "../Components/ModalBase"; // <-- (adição) Modal idêntico ao PerfilUser

function Login() {
  const styles = Styles();
  const navigate = useNavigate();

  const [user, setUser] = useState({
    email: "",
    password: "",
    showPassword: false,
  });

  const [loading, setLoading] = useState(false); // Para o ícone de carregamento
  const [alert, setAlert] = useState({
    open: false,
    severity: "",
    message: "",
  }); // Para o Snackbar

  // ===== (adição) Estados idênticos ao PerfilUser para "Esqueci Minha Senha" =====
  const id_user = localStorage.getItem("id_usuario");
  const [openModalEsqueci, setOpenModalEsqueci] = useState(false);
  const [emailRecuperacao, setEmailRecuperacao] = useState("");
  const [codigo, setCodigo] = useState("");
  const [codigoEnviado, setCodigoEnviado] = useState(false);
  const [codigoValidado, setCodigoValidado] = useState(false);
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmSenha, setConfirmSenha] = useState("");

  const onChange = (event) => {
    const { name, value } = event.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const showAlert = (severity, message) => {
    setAlert({ open: true, severity, message });
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await loginUser();
  };

  async function loginUser() {
    setLoading(true);
    await api.postLogin(user).then(
      (response) => {
        showAlert("success", response.data.message);
        setLoading(false);
        localStorage.setItem("authenticated", true);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("username", response.data.user.username);
        localStorage.setItem("id_usuario", response.data.user.ID_user);
        navigate("/");
      },
      (error) => {
        showAlert("error", error.response?.data?.error || "Erro ao logar");
        setLoading(false);
      }
    );
  }

  // ===== (adição) Funções idênticas ao PerfilUser para "Esqueci Minha Senha" =====
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

  async function forgotPasswordSendCode() {
    setLoading(true);
    try {
      const res = await api.forgotPassword({ email: emailRecuperacao });
      showAlert("success", res.data.message);
      setCodigoEnviado(true);
      setLoading(false);
    } catch (err) {
      console.error(err);
      showAlert("error", err.response?.data?.error);
      setLoading(false);
    }
  }

  async function validarCodigo() {
    setLoading(true);
    try {
      const res = await api.forgotPassword({
        email: emailRecuperacao,
        code: codigo,
        atualizar: false,
      });
      showAlert("success", res.data.message);
      setCodigoValidado(true);
      setLoading(false);
    } catch (err) {
      console.error(err);
      showAlert("error", err.response?.data?.error || "Código inválido");
      setLoading(false);
    }
  }

  async function atualizarSenhaEsquecida() {
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
      setLoading(false);
    } catch (err) {
      console.error(err);
      showAlert("error", err.response?.data?.error);
      setLoading(false);
    }
  }

  return (
    <Box style={styles.main}>
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

      <Container style={styles.container} disableGutters>
        <Box style={styles.box_IMG_02}>
          <Typography style={styles.style_Font}>
            Seja bem-vindo de volta!
          </Typography>
        </Box>

        <Box style={styles.box_Login}>
          <Box style={styles.box_logo_img}>
            <img style={styles.logo} src={logo} alt="logo site" />
          </Box>
          <Box
            component="form"
            onSubmit={handleSubmit}
            style={styles.box_Formulario}
          >
            <Typography style={styles.font_Titulo}>Login</Typography>
            <Typography>Seja bem-vindo(a)!</Typography>
            <Typography>faça seu login na ConecTalento</Typography>

            <TextField
              required
              fullWidth
              margin="normal"
              label="Digite seu e-mail"
              name="email"
              id="email"
              variant="outlined"
              value={user.email}
              onChange={onChange}
              style={styles.camposFrom}
            />

            <TextField
              required
              fullWidth
              margin="normal"
              label="Digite sua senha"
              name="password"
              id="password"
              variant="outlined"
              value={user.password}
              onChange={onChange}
              style={styles.camposFrom2}
              type={user.showPassword ? "text" : "password"}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setUser((prev) => ({
                            ...prev,
                            showPassword: !prev.showPassword,
                          }))
                        }
                        edge="end"
                        aria-label="toggle password visibility"
                      >
                        {user.showPassword ? (
                          <VisibilityOffIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                  inputProps: { maxLength: 50 },
                },
              }}
              sx={{ m: 0 }}
            />

            <Button type="submit" style={styles.button} disabled={loading}>
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Login"
              )}
            </Button>

            <Box style={styles.textoCadastro}>
              <Typography>Não possui uma conta?</Typography>
              <Typography component={Link} to="/cadastro">
                Cadastre-se
              </Typography>
            </Box>

            {/* (adição) Link "Esqueci Minha Senha" idêntico ao PerfilUser */}
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
          </Box>
        </Box>
      </Container>

      {/* (adição) Modal "Esqueci Minha Senha" idêntico ao PerfilUser */}
      <ModalBase open={openModalEsqueci} onClose={handleCloseModalEsqueciSenha}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 3.5,
            textAlign: "center",
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: "#222", mb: 2 }}
          >
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
  );
}

function Styles() {
  return {
    main: { width: "100vw", height: "100vh" },
    container: {
      backgroundColor: "#fff",
      width: "55%",
      height: "500px",
      borderRadius: "5px",
      boxShadow: "3px 8px 24px rgba(0,0,0,0.71)",
      display: "flex",
      alignItems: "center",
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      padding: 0,
    },
    box_IMG_02: {
      backgroundImage: `url(${background2})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      height: "100%",
      width: "40%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#fff",
      borderRadius: "5px 0 0 5px",
    },
    style_Font: { width: "88%", fontSize: "35px", fontWeight: 900 },
    box_Login: {
      width: "60%",
      height: "100%",
      borderRadius: "0 5px 5px 0",
      display: "flex",
      flexDirection: "column",
    },
    box_logo_img: { width: "100%", display: "flex", justifyContent: "end" },
    logo: { margin: "10px", width: "45px" },
    font_Titulo: { fontWeight: 600, fontSize: "35px", marginBottom: "5px" },
    box_Formulario: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    },
    textoCadastro: { display: "flex", gap: "5px" },
    camposFrom: { width: "80%", marginTop: "20px" },
    camposFrom2: { width: "80%", marginTop: "10px", marginBottom: "10px" },
    button: {
      backgroundColor: "#8500C2",
      color: "#fff",
      borderRadius: "8px",
      width: "50%",
      height: "45px",
      fontWeight: "bold",
      fontSize: "16px",
      textTransform: "none",
      margin: "15px",
      cursor: "pointer",
    },
    // ===== (adição) estilos usados apenas no Modal "Esqueci Minha Senha" =====
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

export default Login;