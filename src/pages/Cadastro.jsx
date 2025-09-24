import {
  Box,
  Container,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import Button from "@mui/material/Button";
import { useState, useEffect } from "react";
import background2 from "../assets/background2.png";
import logo from "../assets/logo_ct.png";
import { Link, useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import api from "../axios/axios";
import InputAdornment from "@mui/material/InputAdornment";
import ModalBase from "../Components/ModalBase";
import { Alert, Snackbar } from "@mui/material";

function Cadastro() {
  const [user, setUser] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    code: "",
    showPassword: false,
    showConfirmPassword: false,
  });

  const [openModal, setOpenModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutos em segundos
  const [isTimerActive, setIsTimerActive] = useState(false);

  const [alert, setAlert] = useState({
    open: false,
    severity: "",
    message: "",
  });

  const [loading, setLoading] = useState(false); // Novo estado para ícone de carregamento

  useEffect(() => {
    let timer;

    if (openModal && isTimerActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }

    if (timeLeft === 0) {
      clearInterval(timer);
      setIsTimerActive(false);
    }

    return () => clearInterval(timer);
  }, [openModal, isTimerActive, timeLeft]);

  const navigate = useNavigate();

  const showAlert = (severity, message) => {
    setAlert({ open: true, severity, message });
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  const onChange = (event) => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    cadastro();
  };

  const handleSubmitCode = (event) => {
    event.preventDefault();
    validateCode();
  };

  const handleOpenModal = () => {
    setOpenModal(true);
    setTimeLeft(15 * 60);
    setIsTimerActive(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setIsTimerActive(false);
  };

  async function cadastro() {
    setLoading(true); // Ativa o ícone de carregamento
    await api.postCadastro(user).then(
      (response) => {
        showAlert("success", response.data.message);
        handleOpenModal();
        setLoading(false); // Desativa o ícone após resposta
      },
      (error) => {
        showAlert("error", error.response.data.error);
        setLoading(false); // Desativa o ícone após erro
      }
    );
  }

  async function validateCode() {
    await api.postCadastro(user).then(
      (response) => {
        showAlert("success", response.data.message);
        localStorage.setItem("authenticated", true);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("id_usuario", response.data.user.ID_user);
        localStorage.setItem("username", response.data.user.username);
        
        handleCloseModal();
        navigate("/");
      },
      (error) => {
        showAlert("error", error.response.data.error);
      }
    );
  }

  const formatTime = (totalSeconds) => {
    const mins = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    const secs = String(totalSeconds % 60).padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const styles = Styles();

  return (
    <Box style={styles.principal}>
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
      <Container style={styles.container}>
        <Box style={styles.box_Cadastro}>
          <Box style={styles.box_logo_img}>
            <img style={styles.logo} src={logo} alt="Logo site" />
          </Box>

          <Box
            style={styles.box_Formulario}
            component="form"
            onSubmit={handleSubmit}
          >
            <Typography style={styles.font_Titulo}>Cadastro</Typography>

            <TextField
              required
              fullWidth
              margin="normal"
              label="Nome"
              name="name"
              id="name"
              value={user.name}
              onChange={onChange}
              variant="outlined"
              style={styles.camposForm}
            />

            <TextField
              required
              fullWidth
              margin="normal"
              label="Username"
              name="username"
              id="username"
              value={user.username}
              onChange={onChange}
              variant="outlined"
              style={styles.camposForm}
            />

            <TextField
              required
              fullWidth
              margin="normal"
              label="Email"
              name="email"
              id="email"
              value={user.email}
              onChange={onChange}
              variant="outlined"
              style={styles.camposForm}
            />

            <TextField
              required
              fullWidth
              margin="normal"
              label="Senha"
              name="password"
              id="password"
              type={user.showPassword ? "text" : "password"}
              value={user.password}
              onChange={onChange}
              variant="outlined"
              style={styles.camposForm}
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
              sx={{
                m: 0,
              }}
            />

            <TextField
              required
              fullWidth
              margin="normal"
              label="Confirme sua senha"
              name="confirmPassword"
              id="confirmPassword"
              type={user.showConfirmPassword ? "text" : "password"}
              value={user.confirmPassword}
              onChange={onChange}
              variant="outlined"
              style={styles.camposForm}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setUser((prev) => ({
                            ...prev,
                            showConfirmPassword: !prev.showConfirmPassword,
                          }))
                        }
                        edge="end"
                        aria-label="toggle password visibility"
                      >
                        {user.showConfirmPassword ? (
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
              sx={{
                m: 0,
              }}
            />

            <Button type="submit" style={styles.button} disabled={loading}>
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Cadastrar"
              )}
            </Button>

            <Box style={styles.textoLogin}>
              <Typography>Já possui uma conta?</Typography>
              <Typography component={Link} to="/login">
                Faça login
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box style={styles.box_IMG_02}>
          <Typography style={styles.style_Font}>
            Seja bem-vindo ao ConecTalento!
          </Typography>
        </Box>
      </Container>

      <ModalBase open={openModal} onClose={handleCloseModal}>
        <Box component="form" onSubmit={handleSubmitCode} sx={styles.content}>
          <Typography variant="h5" fontWeight="bold">
            Quase lá
          </Typography>
          <Typography>Digite o código que enviamos no seu email</Typography>

          <Box style={styles.timer}>
            <Typography
              variant="body1"
              color="black"
              sx={{ mt: 1, mb: 1, marginRight: "2px" }}
            >
              Código expira em:
            </Typography>
            <Typography variant="body1" color="error" sx={{ mt: 1, mb: 1 }}>
              {formatTime(timeLeft)}
            </Typography>
          </Box>

          <TextField
            variant="outlined"
            placeholder="XXX-XXX"
            name="code"
            id="code"
            value={user.code}
            onChange={onChange}
          />

          <Button
            variant="contained"
            sx={styles.button}
            type="submit"
            disabled={timeLeft === 0}
          >
            Continuar
          </Button>
        </Box>
      </ModalBase>
    </Box>
  );
}

function Styles() {
  return {
    container: {
      backgroundColor: "white",
      width: "55%",
      height: "500px",
      borderRadius: "5px",
      boxShadow: "3px 8px 24px rgba(0, 0, 0, 0.71)",
      display: "flex",
      alignItems: "center",
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      padding: 0,
    },
    timer: {
      display: "flex",
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
      fontSize: "24px",
      fontWeight: "bold",
      borderRadius: "0px 5px 5px 0px",
    },
    box_Cadastro: {
      width: "60%",
      height: "100%",
      borderRadius: "5px 0px 0px 5px",
      display: "flex",
      flexDirection: "column",
    },
    style_Font: {
      width: "95%",
      fontSize: "33px",
      fontWeight: "900",
    },
    box_logo_img: {
      width: "100%",
      display: "flex",
      justifyContent: "start",
    },
    logo: {
      marginTop: "10px",
      marginLeft: "10px",
      width: "45px",
    },
    font_Titulo: {
      fontWeight: "600",
      fontSize: "35px",
    },
    box_Formulario: {
      margin:"-25px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      alignContent: "center",
      justifyContent: "center",
    },
    textoLogin: {
      display: "flex",
      gap: "5px",
    },
    camposForm: {
      width: "75%",   // diminui a largura para caber melhor
      margin: "3.5px 0",
    },    
    button: {
      backgroundColor: "#8500C2",
      color: "#fff",
      borderRadius: "8px",
      width: "50%",
      height: "45px",
      fontWeight: "bold",
      fontSize: "16px",
      textTransform: "none",
      marginTop: "15px",
      marginBottom: "10px",
      cursor: "pointer",
    },
    content: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 1,
      marginTop: 5,
    },
  };
}

export default Cadastro;