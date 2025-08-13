import { Box, Container, TextField, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import background2 from "../assets/background2.png";
import React from "react";
import { Link } from "react-router-dom";

function Cadastro() {
  const styles = Styles();
  return (
    <Container style={styles.container}>
      <Box style={styles.box_Cadastro}>
        <Typography>Cadastro</Typography>

        <TextField
          required
          fullWidth
          margin="normal"
          label="Nome"
          name="email"
          id="email"
          variant="standard"
        />

        <TextField
          required
          fullWidth
          margin="normal"
          label="Email"
          name="email"
          id="email"
          variant="standard"
        />
        <TextField
          required
          fullWidth
          margin="normal"
          label="Senha"
          name="email"
          id="email"
          variant="standard"
        />
        <TextField
          required
          fullWidth
          margin="normal"
          label="Confirme sua senha"
          name="email"
          id="email"
          variant="standard"
        />
        <Button>Cadastrar</Button>

        <Typography component={Link}>
          Já possui uma conta? Faça login
        </Typography>
      </Box>

      <Box style={styles.box_IMG_02}>
        <Typography style={styles.style_Font}>
          Seja bem-vindo ao ConecTalento!
        </Typography>
      </Box>
    </Container>
  );
}

function Styles() {
  return {
    container: {
      backgroundColor: "rgb(255, 255, 255)",
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
      borderRadius: "5px",
    },
    box_Cadastro: {
      width: "60%",
      height: "100%",
      borderRadius: "5px",
    },
    style_Font: {
      width: "95%",
      fontSize: "33px",
      fontWeight:"900",
    },
  };
}

export default Cadastro;
