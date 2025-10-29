import {
  Box,
  Container,
  TextField,
  Typography,
  Snackbar,
  Alert,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { useEffect, useState } from "react";
import api from "../axios/axios";
import BottonUpgrade from "../Components/BottonUpgrade";

function CriarProjeto() {
  const styles = Styles();
  const ID_user = localStorage.getItem("id_usuario");
  const [userPlan, setUserPlan] = useState({ plan: null, authenticated: null });

  const [form, setForm] = useState({ titulo: "", descricao: "" });
  const [imagens, setImagens] = useState([]);
  const [previews, setPreviews] = useState([]);

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

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImagens((prev) => [...prev, ...files]);

    const readers = files.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers)
      .then((base64Images) =>
        setPreviews((prev) => [...prev, ...base64Images])
      )
      .catch((err) => console.error("Erro ao gerar prévias:", err));
  };

  const handleRemoveImage = (indexToRemove) => {
    setImagens((prev) => prev.filter((_, i) => i !== indexToRemove));
    setPreviews((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.createProjeto(ID_user, form, imagens);
      setSnackbar({
        open: true,
        message: response.data.message,
        severity: "success",
      });
    } catch (error) {
      const msg = error.response?.data?.error || "Erro ao criar projeto";
      setSnackbar({ open: true, message: msg, severity: "error" });
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
      {userPlan.plan === false && userPlan.authenticated === true && (
        <BottonUpgrade />
      )}
      <Container maxWidth="sx">
        <form style={styles.box_principal} onSubmit={handleSubmit}>
          <Typography style={styles.font_Titulo}>Criar novo projeto</Typography>

          <Typography style={styles.label}>Adicionar imagens:</Typography>

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
              <Button component="span" sx={styles.uploadBtn}>
                <UploadFileIcon fontSize="small" />
                Selecionar imagens
              </Button>
            </label>
          </Box>

          <Box mt={2} display="flex" flexWrap="wrap" gap={2}>
            {previews.map((src, index) => (
              <Box
                key={index}
                sx={{
                  position: "relative",
                  width: 120,
                  height: 120,
                  borderRadius: 2,
                  overflow: "hidden",
                  boxShadow: 1,
                  border: "1px solid #ccc",
                }}
              >
                <img
                  src={src}
                  alt={`preview-${index}`}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <DeleteIcon
                  onClick={() => handleRemoveImage(index)}
                  sx={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    background: "rgba(255,255,255,0.8)",
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
            sx={{
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "black" },
            }}
          />

          <Button type="submit" style={styles.button}>
            Criar
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
      fontWeight: 100,
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
