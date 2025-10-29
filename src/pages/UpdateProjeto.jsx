import {
  Box,
  Container,
  TextField,
  Typography,
  Snackbar,
  Alert,
  IconButton,
  Button,
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

  const handleSnackbarClose = (_, reason) => {
    if (reason === "clickaway") return;
    setSnackbar((s) => ({ ...s, open: false }));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImagensNovas(files);

    const readers = files.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers)
      .then((base64Images) => setPreviewsNovas(base64Images))
      .catch((err) => console.error("Erro ao gerar prévias:", err));
  };

  const removerImagemExistente = (index) => {
    setImagensExistentes((prev) => prev.filter((_, i) => i !== index));
  };

  const removerImagemNova = (index) => {
    setImagensNovas((prev) => prev.filter((_, i) => i !== index));
    setPreviewsNovas((prev) => prev.filter((_, i) => i !== index));
  };

  const [userPlan, setUserPlan] = useState({ plan: null, authenticated: null });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("titulo", form.titulo);
      formData.append("descricao", form.descricao);
      formData.append("ID_user", ID_user);

      const arquivosDeExistentes = imagensExistentes
        .map((src, idx) => {
          if (typeof src === "string" && src.startsWith("data:")) {
            return dataURLToFile(src, `imagem_existente_${idx + 1}`);
          }
          return null;
        })
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

          <Typography style={styles.label}>
            Adicione ou remova as imagens:
          </Typography>
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

          <Box mt={2} display="flex" flexWrap="wrap" gap={2}>
            {previewsNovas.map((src, index) => (
              <Box key={index} sx={styles.previewBox}>
                <img
                  src={src}
                  alt={`preview-nova-${index}`}
                  style={styles.previewImg}
                />
                <IconButton
                  size="small"
                  sx={styles.deleteBtn}
                  onClick={() => removerImagemNova(index)}
                >
                  <DeleteIcon fontSize="small" sx={{ color: "#d32f2f" }} />
                </IconButton>
              </Box>
            ))}
            {imagensExistentes.map((img, index) => (
              <Box key={index} sx={styles.previewBox}>
                <img
                  src={img}
                  alt={`Imagem existente ${index + 1}`}
                  style={styles.previewImg}
                />
                <IconButton
                  size="small"
                  sx={styles.deleteBtn}
                  onClick={() => removerImagemExistente(index)}
                >
                  <DeleteIcon fontSize="small" sx={{ color: "#d32f2f" }} />
                </IconButton>
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
            value={form.titulo}
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
            value={form.descricao}
            onChange={handleChange}
            style={styles.textfield}
            sx={{
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "black" },
            }}
          />

          <Button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Atualizando..." : "Atualizar"}
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
    previewBox: {
      position: "relative",
      width: 120,
      height: 120,
      borderRadius: 2,
      overflow: "hidden",
      boxShadow: 1,
      border: "1px solid #ccc",
    },
    previewImg: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
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
