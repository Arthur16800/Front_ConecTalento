import {
  Box,
  Container,
  TextField,
  Typography,
  Snackbar,
  Alert,
  Button,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { useEffect, useState } from "react";
import api from "../axios/axios";
import BottonUpgrade from "../Components/BottonUpgrade";
import { useNavigate } from "react-router-dom";

function CriarProjeto() {
  const styles = Styles();
  const navigate = useNavigate();
  const ID_user = localStorage.getItem("id_usuario");
  const [username, setUsername] = useState("");
  const [userPlan, setUserPlan] = useState({ plan: null, authenticated: null });
  const [form, setForm] = useState({ titulo: "", descricao: "" });
  const [imagens, setImagens] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [draggingIndex, setDraggingIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleSnackbarClose = (_, reason) => {
    if (reason === "clickaway") return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setImagens((prev) => [...prev, ...files]);

    const readFileSequentially = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

    for (const file of files) {
      try {
        const result = await readFileSequentially(file);
        setPreviews((prev) => [...prev, result]);
      } catch (err) {
        console.error("Erro ao gerar prévia:", err);
      }
    }

    e.target.value = null;
  };


  const handleRemoveImage = (indexToRemove) => {
    setImagens((prev) => prev.filter((_, i) => i !== indexToRemove));
    setPreviews((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  // Drag & Drop
  const handleDragStart = (index) => setDraggingIndex(index);
  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggingIndex === null || draggingIndex === index) return;

    const newPreviews = [...previews];
    const newImagens = [...imagens];
    const draggedPreview = newPreviews[draggingIndex];
    const draggedImagem = newImagens[draggingIndex];

    newPreviews.splice(draggingIndex, 1);
    newImagens.splice(draggingIndex, 1);

    newPreviews.splice(index, 0, draggedPreview);
    newImagens.splice(index, 0, draggedImagem);

    setPreviews(newPreviews);
    setImagens(newImagens);
    setDraggingIndex(index);
  };
  const handleDragEnd = () => setDraggingIndex(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.createProjeto(ID_user, form, imagens);
      setSnackbar({
        open: true,
        message: response.data.message,
        severity: "success",
      });
      setTimeout(() => {
        if (username) navigate(`/${username}`);
      }, 1500);
    } catch (error) {
      const msg = error.response?.data?.error || "Erro ao criar projeto";
      setSnackbar({ open: true, message: msg, severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  async function getUserById() {
    const authenticated = localStorage.getItem("authenticated");
    if (!authenticated) {
      setUserPlan((prev) => ({ ...prev, authenticated: false }));
      return;
    }
    try {
      const response = await api.getUserById(ID_user);
      const plan = Boolean(response.data.profile.plano);
      const usernameFromAPI = response.data.profile.username;
      setUsername(usernameFromAPI);
      setUserPlan((prev) => ({ ...prev, plan, authenticated: true }));
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
    }
  }

  useEffect(() => {
    getUserById();
  }, []);

  return (
    <>
      <style>{`
        .criar-projeto { padding-left: 12px; padding-right: 12px; }
        .form-projeto { max-width: 1100px; }
        .thumb { width: 120px; height: 120px; }
        .campo { max-width: 720px; }
        @media (max-width: 1024px) {
          .campo { width: 70% !important; max-width: 640px !important; }
          .thumb { width: 110px !important; height: 110px !important; }
          .preview-list { gap: 12px !important; }
        }
        @media (max-width: 768px) {
          .form-projeto {
            margin: 16px auto !important;
            align-items: stretch !important;
            padding-right: 4px; 
          }
          .titulo-pagina { font-size: 28px !important; margin-bottom: 16px !important; }
          .label-padrao { font-size: 15px !important; margin-bottom: 8px !important; }
          .campo {
            width: 100% !important;
            max-width: 100% !important;
            height: 52px !important;
          }
          .upload-btn { width: 200px !important; justify-content: center !important; font-size: 12px; }
          .thumb { width: 100px !important; height: 100px !important; }
          .preview-list { gap: 10px !important; }
          .btn-submit { width: 100px !important; padding: 12px 20px !important; }
        }
        @media (max-width: 480px) {
          .titulo-pagina { font-size: 24px !important; }
          .label-padrao { font-size: 14px !important; }
          .thumb { width: 88px !important; height: 88px !important; }
          .btn-submit { font-size: 15px !important;}
        }
        @media (max-width: 400px){
          .btn-submit {margin: auto}
        }
      `}</style>

      {userPlan.plan === false && userPlan.authenticated === true && (
        <BottonUpgrade />
      )}

      <Container maxWidth="sx" className="criar-projeto">
        <form
          style={styles.box_principal}
          className="form-projeto"
          onSubmit={handleSubmit}
        >
          <Typography style={styles.font_Titulo} className="titulo-pagina">
            Criar novo projeto
          </Typography>

          <Typography style={styles.label} className="label-padrao">
            Adicionar imagens:
          </Typography>

          <Box>
            <input
              type="file"
              multiple
              accept="image/*"
              id="upload-images"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <label htmlFor="upload-images">
              <Button
                component="span"
                sx={styles.uploadBtn}
                className="upload-btn"
              >
                <UploadFileIcon fontSize="small" />
                Selecionar imagens
              </Button>
            </label>
          </Box>

          <Box
            mt={2}
            display="flex"
            flexWrap="wrap"
            gap={2}
            className="preview-list"
            sx={{ cursor: "grab" }}
          >
            {previews.map((src, index) => (
              <Box
                key={index}
                className="thumb"
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                sx={{
                  position: "relative",
                  borderRadius: 2,
                  overflow: "hidden",
                  boxShadow: 1,
                  border: "1px solid #ccc",
                  opacity: draggingIndex === index ? 0.4 : 1,
                  transition: "opacity 0.2s ease",
                }}
              >
                <img
                  src={src}
                  alt={`preview-${index}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    userSelect: "none",
                  }}
                />
                <DeleteIcon
                  onClick={() => handleRemoveImage(index)}
                  sx={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    background: "rgba(255,255,255,0.85)",
                    borderRadius: "50%",
                    padding: "2px",
                    fontSize: 20,
                    cursor: "pointer",
                    color: "#d32f2f",
                  }}
                />
              </Box>
            ))}
          </Box>

          <TextField
            required
            fullWidth
            margin="normal"
            label="Título"
            name="titulo"
            id="titulo"
            variant="outlined"
            onChange={handleChange}
            style={styles.textfield}
            className="campo"
            sx={{
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "black" },
            }}
          />

          <TextField
            required
            fullWidth
            margin="normal"
            label="Descrição"
            name="descricao"
            id="descricao"
            variant="outlined"
            onChange={handleChange}
            style={styles.textfield}
            className="campo"
            sx={{
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "black" },
            }}
          />

          <Button
            type="submit"
            style={styles.button}
            className="btn-submit"
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Criar"
            )}
          </Button>
        </form>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
}

function Styles() {
  return {
    box_principal: {
      marginTop: "3%",
      marginLeft: "3%",
      marginBottom: "3%",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
    },
    button: {
      backgroundColor: "#8500C2",
      color: "#fff",
      borderRadius: "5px",
      fontWeight: "bold",
      fontSize: "16px",
      textTransform: "none",
      marginTop: "20px",
      padding: "10px 30px",
    },
    font_Titulo: {
      fontWeight: "600",
      fontSize: "35px",
      marginBottom: "20px",
    },
    label: {
      fontWeight: "600",
      fontSize: "16px",
      marginBottom: "10px",
    },
    textfield: {
      width: "50%",
      backgroundColor: "#f0f0f0",
      borderRadius: 5,
      height: 55,
    },
    uploadBtn: {
      backgroundColor: "rgb(133, 0, 194)",
      color: "white",
      borderRadius: "8px",
      padding: "12px 28px",
      textTransform: "none",
      fontSize: "16px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      transition: "all 0.3s ease",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
      },
    },
  };
}

export default CriarProjeto;