import { Box, Container, TextField, Typography, Snackbar, Alert, IconButton } from "@mui/material";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import api from "../axios/axios";

function UpdateProjeto() {
  const styles = Styles();
  const { ID_projeto } = useParams();
  const ID_user = localStorage.getItem("id_usuario");

  const [form, setForm] = useState({
    titulo: "",
    descricao: "",
  });

  // 🔹 Estado separado para imagens existentes (dataURL/URL) e novas (File)
  const [imagensExistentes, setImagensExistentes] = useState([]);
  const [imagensNovas, setImagensNovas] = useState([]);

  const [loading, setLoading] = useState(false);

  // Snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbar((s) => ({ ...s, open: false }));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImagensNovas(Array.from(e.target.files));
  };

  // 🔹 Remover imagem existente (remove do preview; não “deleta” no back — o back não dá suporte)
  const removerImagemExistente = (index) => {
    setImagensExistentes((prev) => prev.filter((_, i) => i !== index));
  };

  // 🔧 ADIÇÃO: helper para converter dataURL/base64 em File (necessário para sempre enviar req.files)
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
      // File existe na maioria dos navegadores modernos; fallback para Blob caso necessário
      try {
        return new File([u8arr], `${filenameFallback}.${mime.split("/")[1] || "jpg"}`, { type: mime });
      } catch {
        const blob = new Blob([u8arr], { type: mime });
        blob.name = `${filenameFallback}.${mime.split("/")[1] || "jpg"}`;
        return blob; // Multer aceita Blob em FormData.append
      }
    } catch {
      return null;
    }
  }

  // 🔹 Pré-carregar dados do projeto
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

          // Transformar imagens existentes em URLs/base64 para preview
          const imgs = projeto.imagens
            ?.map((img) => {
              if (typeof img === "string") return img; // já é URL/dataURL
              if (img?.imagem)
                return `data:${img.tipo_imagem || "image/jpeg"};base64,${img.imagem}`;
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

      // 🔧 ADIÇÃO: “montar” a lista final de arquivos que irá em req.files ("imagens")
      // 1) Converter imagens existentes (dataURL) para File/Blob (para atender o back que exige req.files)
      const arquivosDeExistentes = imagensExistentes
        .map((src, idx) => {
          // só converte se for dataURL/base64; se for URL http/https, não temos fetch aqui
          if (typeof src === "string" && src.startsWith("data:")) {
            return dataURLToFile(src, `imagem_existente_${idx + 1}`);
          }
          // Se vier URL http(s), não conseguimos transformar sem fetch/CORS.
          // Ignoramos aqui para manter compatibilidade com seu back atual.
          return null;
        })
        .filter(Boolean);

      // 2) Concatenar com as imagens novas selecionadas pelo usuário
      const arquivosParaEnviar = [...arquivosDeExistentes, ...imagensNovas];

      // 3) Garantir que pelo menos uma imagem seja enviada (seu back exige `!imagens`)
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

      // 4) Preencher o FormData com a chave correta que o Multer espera: "imagens"
      arquivosParaEnviar.forEach((file) => formData.append("imagens", file));

      const response = await api.updateProjeto(ID_projeto, formData);

      setSnackbar({
        open: true,
        message: response.data?.message || "Projeto atualizado com sucesso!",
        severity: "success",
      });
    } catch (error) {
      console.error(error);
      setSnackbar({
        open: true,
        message: error.response?.data?.error || "Falha ao atualizar o projeto.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sx">
      <form style={styles.box_principal} onSubmit={handleSubmit}>
        <Typography style={styles.font_Titulo}>Atualizar projeto</Typography>

        <Typography style={styles.label}>Imagens existentes:</Typography>
        <Box display="flex" flexWrap="wrap" gap={2}>
          {imagensExistentes.map((img, index) => (
            <Box key={index} position="relative">
              <img
                src={img}
                alt={`Imagem existente ${index + 1}`}
                style={{ width: 100, height: 100, objectFit: "cover", borderRadius: 5 }}
              />
              <IconButton
                size="small"
                sx={{ position: "absolute", top: -10, right: -10, backgroundColor: "#fff" }}
                onClick={() => removerImagemExistente(index)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Box>

        <Typography style={styles.label} mt={2}>
          Adicionar novas imagens (opcional):
        </Typography>
        <Box>
          <input type="file" multiple accept="image/*" onChange={handleFileChange} />
        </Box>

        {/* lista de nomes das imagens novas */}
        <Box mt={2}>
          {imagensNovas.length > 0 && (
            <Box>
              {imagensNovas.map((img, index) => (
                <Typography key={index} variant="body2">
                  {img.name}
                </Typography>
              ))}
            </Box>
          )}
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
          sx={{ "& .MuiOutlinedInput-notchedOutline": { borderColor: "black" } }}
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
          sx={{ "& .MuiOutlinedInput-notchedOutline": { borderColor: "black" } }}
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
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
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
  };
}

export default UpdateProjeto;