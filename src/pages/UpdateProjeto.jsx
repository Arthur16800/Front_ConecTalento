import { Box, Container, TextField, Typography, Snackbar, Alert } from "@mui/material";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../axios/axios";
import BottonUpgrade from "../Components/BottonUpgrade";

function UpdateProjeto() {
  const styles = Styles();
  const { ID_projeto } = useParams();
  const ID_user = localStorage.getItem("id_usuario");

  const [form, setForm] = useState({
    titulo: "",
    descricao: "",
  });
  const [imagens, setImagens] = useState([]);
  const [loading, setLoading] = useState(false);

  // Snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [userPlan, setUserPlan] = useState({
    plan: null,
    authenticated: null,
  });

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbar((s) => ({ ...s, open: false }));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImagens(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.updateProjeto(
        ID_projeto,
        {
          titulo: form.titulo,
          descricao: form.descricao,
          ID_user,
        },
        imagens
      );

      setSnackbar({
        open: true,
        message: response.data?.message || "Projeto atualizado com sucesso.",
        severity: "success",
      });
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.error || "Erro ao atualizar projeto";
      setSnackbar({ open: true, message: msg, severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  async function getUserById() {
    const authenticated = localStorage.getItem("authenticated");
    if (!authenticated) {
      setUserPlan(prev => ({ ...prev, authenticated: false }));
      return null;
    }
    const id_user = localStorage.getItem("id_usuario");
    try {
      const response = await api.getUserById(id_user);
      const plan = Boolean(response.data.profile.plano);
      setUserPlan(prev => ({ ...prev, plan, authenticated: true }));
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
      {userPlan.plan === false && userPlan.authenticated === true ? <BottonUpgrade /> : null}

      <Container maxWidth="sx">
        <form style={styles.box_principal} onSubmit={handleSubmit}>
          <Typography style={styles.font_Titulo}>Atualizar projeto</Typography>

          <Typography style={styles.label}>Adicionar novas imagens (opcional):</Typography>
          <Box>
            <input type="file" multiple accept="image/*" onChange={handleFileChange} />
          </Box>

          {/* lista de nomes das imagens selecionadas */}
          <Box mt={2}>
            {imagens.length > 0 && (
              <Box>
                {imagens.map((img, index) => (
                  <Typography key={index} variant="body2">
                    {index + 1}. {img.name}
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
    buttonFile: {
      backgroundColor: "#f0f0f0",
      color: "black",
      borderRadius: "5px",
      fontSize: "14px",
      textTransform: "none",
      padding: "10px 20px",
      borderColor: "black",
    },
  };
}

export default UpdateProjeto;
