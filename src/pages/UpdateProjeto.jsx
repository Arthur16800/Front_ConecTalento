import {
  Box,
  Container,
  TextField,
  Typography,
  Snackbar,
  Alert,
  IconButton,
  Button,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import api from "../axios/axios";
import BottonUpgrade from "../Components/BottonUpgrade";

function UpdateProjeto() {
  const styles = Styles();
  const { ID_projeto } = useParams();
  const ID_user = localStorage.getItem("id_usuario");
  const [form, setForm] = useState({ titulo: "", descricao: "" });
  const [imagensExistentes, setImagensExistentes] = useState([]);
  const [imagensNovas, setImagensNovas] = useState([]);
  const [previewsNovas, setPreviewsNovas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [userPlan, setUserPlan] = useState({ plan: null, authenticated: null });

  const handleSnackbarClose = (_, reason) => {
    if (reason === "clickaway") return;
    setSnackbar((s) => ({ ...s, open: false }));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setImagensNovas((prev) => [...prev, ...files]);
    const readers = files.map(
      (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        })
    );
    Promise.all(readers)
      .then((base64Images) =>
        setPreviewsNovas((prev) => [...prev, ...base64Images])
      )
      .catch((err) => console.error("Erro ao gerar prévias:", err));
  };

  const removerImagemExistente = (index) => {
    setImagensExistentes((prev) => prev.filter((_, i) => i !== index));
  };

  const removerImagemNova = (index) => {
    setImagensNovas((prev) => prev.filter((_, i) => i !== index));
    setPreviewsNovas((prev) => prev.filter((_, i) => i !== index));
  };

  // Função para converter DataURL em arquivo
  function dataURLToFile(dataUrl, filenameFallback = "imagem_existente") {
    try {
      const arr = dataUrl.split(",");
      if (arr.length < 2) return null;
      const mimeMatch = arr[0].match(/data:(.*?);base64/);
      const mime = mimeMatch ? mimeMatch[1] : "image/jpeg";
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) u8arr[n] = bstr.charCodeAt(n);
      try {
        return new File(
          [u8arr],
          `${filenameFallback}.${mime.split("/")[1] || "jpg"}`,
          { type: mime }
        );
      } catch {
        const blob = new Blob([u8arr], { type: mime });
        blob.name = `${filenameFallback}.${mime.split("/")[1] || "jpg"}`;
        return blob;
      }
    } catch {
      return null;
    }
  }

  useEffect(() => {
    let ativo = true;
    const fetchProjeto = async () => {
      try {
        setLoading(true);
        const res = await api.getProjectDetails(ID_projeto);
        if (!ativo) return;
        const projeto = res.data?.projeto;
        if (projeto) {
          setForm({
            titulo: projeto.titulo || "",
            descricao: projeto.descricao || "",
          });
          setUsername(projeto.autor?.username);
          const imgs = projeto.imagens
            ?.map((img) => {
              if (typeof img === "string") return img;
              if (img?.imagem)
                return `data:${img.tipo_imagem || "image/jpeg"};base64,${
                  img.imagem
                }`;
              return null;
            })
            .filter(Boolean);
          setImagensExistentes(imgs || []);
        }
        setLoading(false);
      } catch (err) {
        console.error("Erro ao carregar projeto:", err);
        setLoading(false);
      }
    };
    fetchProjeto();
    return () => {
      ativo = false;
    };
  }, [ID_projeto]);

  // Drag and drop
  const [draggingIndex, setDraggingIndex] = useState(null);

  const handleDragStart = (index) => setDraggingIndex(index);

  const handleDragOver = (e, index) => {
    e.preventDefault();
    const total = [...imagensExistentes, ...previewsNovas];
    if (draggingIndex === null || draggingIndex === index) return;

    const draggedItem = total[draggingIndex];
    const newList = total.filter((_, i) => i !== draggingIndex);
    newList.splice(index, 0, draggedItem);

    const novasExistentes = newList.slice(0, imagensExistentes.length);
    const novasNovas = newList.slice(imagensExistentes.length);

    setImagensExistentes(novasExistentes);
    setPreviewsNovas(novasNovas);
    setDraggingIndex(index);
  };

  const handleDragEnd = () => setDraggingIndex(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("titulo", form.titulo);
      formData.append("descricao", form.descricao);
      formData.append("ID_user", ID_user);

      const arquivosDeExistentes = imagensExistentes
        .map((src, idx) =>
          typeof src === "string" && src.startsWith("data:")
            ? dataURLToFile(src, `imagem_existente_${idx + 1}`)
            : null
        )
        .filter(Boolean);

      const arquivosParaEnviar = [...arquivosDeExistentes, ...imagensNovas];
      if (arquivosParaEnviar.length === 0) {
        setSnackbar({
          open: true,
          message:
            "Selecione ao menos uma imagem ou mantenha alguma imagem existente.",
          severity: "error",
        });
        setLoading(false);
        return;
      }

      arquivosParaEnviar.forEach((file) => formData.append("imagens", file));
      const response = await api.updateProjeto(ID_projeto, formData);
      setSnackbar({
        open: true,
        message: response.data?.message,
        severity: "success",
      });
    } catch (error) {
      console.error(error);
      setSnackbar({
        open: true,
        message: error.response?.data?.error,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (snackbar.open && snackbar.severity === "success") {
      const timer = setTimeout(() => {
        navigate(`/${username}`);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [snackbar, navigate, username]);

  async function getUserById() {
    const authenticated = localStorage.getItem("authenticated");
    if (!authenticated) {
      setUserPlan((prev) => ({ ...prev, authenticated: false }));
      return null;
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
          <Typography style={styles.font_Titulo}>Atualizar projeto</Typography>

          <Box
            mt={2}
            display="flex"
            flexWrap="wrap"
            gap={2}
            sx={{ cursor: "grab" }}
          >
            {[...imagensExistentes, ...previewsNovas].map((src, index) => {
              const isNova = index >= imagensExistentes.length;
              const removeFn = isNova
                ? () => removerImagemNova(index - imagensExistentes.length)
                : () => removerImagemExistente(index);

              return (
                <Box
                  key={index}
                  sx={{
                    ...styles.previewBox,
                    opacity: draggingIndex === index ? 0.4 : 1,
                  }}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                >
                  <img src={src} alt={`img-${index}`} style={styles.previewImg} />
                  <IconButton
                    size="small"
                    sx={styles.deleteBtn}
                    onClick={removeFn}
                  >
                    <DeleteIcon fontSize="small" sx={{ color: "#d32f2f" }} />
                  </IconButton>
                </Box>
              );
            })}
          </Box>

          <Typography style={styles.label}>Adicione ou remova as imagens:</Typography>
          <Box>
            <input
              type="file"
              multiple
              accept="image/*"
              id="upload-novas"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <label htmlFor="upload-novas">
              <Button component="span" sx={styles.uploadBtn}>
                <UploadFileIcon fontSize="small" />
                Selecionar imagens
              </Button>
            </label>
          </Box>

          <TextField
            required
            fullWidth
            margin="normal"
            label="Título"
            name="titulo"
            variant="outlined"
            value={form.titulo}
            onChange={handleChange}
            style={styles.textfield}
          />

          <TextField
            required
            fullWidth
            margin="normal"
            label="Descrição"
            name="descricao"
            variant="outlined"
            value={form.descricao}
            onChange={handleChange}
            style={styles.textfield}
          />

          <Button type="submit" style={styles.button} disabled={loading}>
            {loading ? <CircularProgress size={24} color="inherit" /> : "Atualizar"}
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
    previewBox: {
      position: "relative",
      width: 120,
      height: 120,
      borderRadius: 2,
      overflow: "hidden",
      border: "1px solid #ccc",
      boxShadow: 1,
      transition: "opacity 0.2s",
    },
    previewImg: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      userSelect: "none",
    },
    deleteBtn: {
      position: "absolute",
      top: 4,
      right: 4,
      backgroundColor: "rgba(255,255,255,0.8)",
      padding: "2px",
      borderRadius: "50%",
    },
  };
}

export default UpdateProjeto;
