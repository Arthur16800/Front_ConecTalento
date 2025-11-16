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
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import api from "../axios/axios";
import BottonUpgrade from "../Components/BottonUpgrade";
import Cropper from "react-easy-crop";
import ModalBase from "../Components/ModalBase";

function UpdateProjeto() {
  const styles = Styles();
  const { ID_projeto } = useParams();
  const ID_user = localStorage.getItem("id_usuario");

  const [form, setForm] = useState({ titulo: "", descricao: "" });
  const [listaImagens, setListaImagens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [userPlan, setUserPlan] = useState({ plan: null, authenticated: null });

  // ---- corte de imagem ----
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [openCropModal, setOpenCropModal] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const fileInputRef = useRef(null);

  const getCroppedImg = (imageSrc, cropPixels) =>
    new Promise((resolve) => {
      const image = new Image();
      image.src = imageSrc;
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = cropPixels.width;
        canvas.height = cropPixels.height;
        ctx.drawImage(
          image,
          cropPixels.x,
          cropPixels.y,
          cropPixels.width,
          cropPixels.height,
          0,
          0,
          cropPixels.width,
          cropPixels.height
        );
        canvas.toBlob((blob) => {
          resolve({ blob, base64: canvas.toDataURL("image/jpeg") });
        }, "image/jpeg");
      };
    });

  const onCropComplete = (_, areaPixels) => setCroppedAreaPixels(areaPixels);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const urls = files.map((file) => URL.createObjectURL(file));
    setSelectedImages(urls);
    setCurrentIndex(0);
    setOpenCropModal(true);
    e.target.value = null;
  };

  const handleConfirmCrop = async () => {
    const currentImg = selectedImages[currentIndex];
    const { blob, base64 } = await getCroppedImg(currentImg, croppedAreaPixels);

    setListaImagens((prev) => [
      ...prev,
      {
        id: `nova-${Date.now()}-${currentIndex}-${Math.random()}`,
        tipo: "nova",
        src: base64,
        file: blob,
      },
    ]);

    if (currentIndex < selectedImages.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    } else {
      setOpenCropModal(false);
      setSelectedImages([]);
      setCurrentIndex(0);
    }
  };

  const handleCancelCrop = () => {
    setSelectedImages([]);
    setCurrentIndex(0);
    setOpenCropModal(false);
  };
  // ---- fim do corte ----

  const handleSnackbarClose = (_, reason) => {
    if (reason === "clickaway") return;
    setSnackbar((s) => ({ ...s, open: false }));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const removerImagem = (index) => {
    setListaImagens((prev) => prev.filter((_, i) => i !== index));
  };

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

          setListaImagens(
            (imgs || []).map((src, index) => ({
              id: `existente-${index}`,
              tipo: "existente",
              src,
            }))
          );
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
    if (draggingIndex === null || draggingIndex === index) return;

    setListaImagens((prev) => {
      const newList = [...prev];
      const [moved] = newList.splice(draggingIndex, 1);
      newList.splice(index, 0, moved);
      return newList;
    });

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

      const arquivosParaEnviar = listaImagens
        .map((item, idx) => {
          if (item.file) return item.file;
          if (typeof item.src === "string" && item.src.startsWith("data:"))
            return dataURLToFile(item.src, `imagem_${idx + 1}`);
          return null;
        })
        .filter(Boolean);

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
        message: error.response?.data?.error || "Erro ao atualizar projeto.",
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
            {listaImagens.map((item, index) => (
              <Box
                key={item.id || index}
                sx={{
                  ...styles.previewBox,
                  opacity: draggingIndex === index ? 0.4 : 1,
                }}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
              >
                <img
                  src={item.src}
                  alt={`img-${index}`}
                  style={styles.previewImg}
                />
                <IconButton
                  size="small"
                  sx={styles.deleteBtn}
                  onClick={() => removerImagem(index)}
                >
                  <DeleteIcon fontSize="small" sx={{ color: "#d32f2f" }} />
                </IconButton>
              </Box>
            ))}
          </Box>

          <Typography style={styles.label}>
            Adicione ou remova as imagens (resolução recomendada: 1920x1080):
          </Typography>
          <Box>
            <input
              ref={fileInputRef}
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
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Atualizar"
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

      {/* Modal de corte 16:9 */}
      <ModalBase open={openCropModal} onClose={handleCancelCrop}>
        {selectedImages.length > 0 && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              overflowY: "auto",
              p: 2,
            }}
          >
            <Typography fontWeight={600}>
              Cortar imagem {currentIndex + 1} de {selectedImages.length}
            </Typography>

            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: 260,
                borderRadius: 2,
                overflow: "hidden",
                mt: 2,
                mb: 2,
              }}
            >
              <Cropper
                image={selectedImages[currentIndex]}
                crop={crop}
                zoom={zoom}
                aspect={16 / 9}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                mt: 1,
              }}
            >
              <Button variant="outlined" onClick={handleCancelCrop}>
                Cancelar
              </Button>
              <Button
                variant="contained"
                onClick={handleConfirmCrop}
                sx={{
                  background:
                    "linear-gradient(90deg, #7A2CF6 0%, #6D2AF0 100%)",
                  color: "#fff",
                }}
              >
                Confirmar
              </Button>
            </Box>
          </Box>
        )}
      </ModalBase>
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
