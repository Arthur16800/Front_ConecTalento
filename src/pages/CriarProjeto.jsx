import { Box, Container, TextField, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { useState } from "react";
import api from "../axios/axios";

function CriarProjeto() {
  const styles = Styles();
  const ID_user = localStorage.getItem("id_usuario");

  const [form, setForm] = useState({
    titulo: "",
    descricao: "",
  });
  const [imagens, setImagens] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImagens(e.target.files); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.createProjeto(ID_user, form, imagens);
      alert(response.data.message);
      console.log(imagens)
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.error;
      alert(msg);
      console.log(imagens)
    }
  };

  return (
    <Container maxWidth="sx">
      <form style={styles.box_principal} onSubmit={handleSubmit}>
        <Typography style={styles.font_Titulo}>Criar novo projeto</Typography>

        <Typography style={styles.label}>Adicionar imagens:</Typography>

        <Box>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
            />
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
    </Container>
  );
}

function Styles() {
  return {
    box_principal: {
      marginTop: "10%",
      marginLeft: "3%",
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

export default CriarProjeto;
