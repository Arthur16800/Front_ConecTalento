import * as React from "react";
import { useState } from "react";
// Importação dos componentes MUI
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import background2 from "../assets/background2.png";
import logo from "../assets/logo_ct.png";

// Importação dos componentes do Roteador
import { Link } from "react-router-dom";

function Login() {
  const styles = Styles();
  return (
    <Box style={styles.main}>
      <Container style={styles.container} disableGutters>
        <Box style={styles.box_IMG_02}>
          <Typography style={styles.style_Font}>
            Seja bem-vindo de volta!
          </Typography>
        </Box>
        <Box style={styles.box_Login}>
          <Box style={styles.box_logo_img}>
            <img style={styles.logo} src={logo} alt="logo site" />
          </Box>
          <Box style={styles.box_Formulario}>
            <Typography style={styles.font_Titulo}>Login</Typography>

            <Typography>Seja bem-vindo(a)!</Typography>
            <Typography>faça seu login na ConecTalento</Typography>

            <TextField
              required
              fullWidth
              margin="normal"
              label="Digite seu e-mail"
              name="email"
              id="email"
              variant="outlined"
              style={styles.camposFrom}
            />

            <TextField
              required
              fullWidth
              margin="normal"
              label="Digite sua senha"
              name="senha"
              id="password"
              variant="outlined"
              style={styles.camposFrom}
            />

            <Button style={styles.button}>Login</Button>

            <Box style={styles.textoCadastro}>
              <Typography>Não possui uma conta? </Typography>
              <Typography component={Link}> Cadastre-se</Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

function Styles() {
  return {
    main: {
      // backgroundImage: `url(${background})`,
      // backgroundSize: "cover",
      width: "100vw",
      height: "100vh"
    },
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
      borderRadius: "5px 0px 0px 5px",
    },
    style_Font: {
      width: "88%",
      fontSize: "35px",
      fontWeight: "900",
    },
    box_Login: {
      width: "60%",
      height: "100%",
      borderRadius: "0px 5px 5px 0px",
      display: "flex",
      flexDirection: "column",
    },
    box_logo_img: {
      width: "100%",
      display: "flex",
      justifyContent: "end",
    },
    logo: {
      margin: "10px",
      width: "45px",
    },
    font_Titulo: {
      fontWeight: "600",
      fontSize: "35px",
      marginBottom: "5px",
    },
    box_Formulario: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      alignContent: "center",
      justifyContent: "center",
    },
    textoCadastro: {
      display: "flex",
      gap: "5px",
    },
    camposFrom: {
      width: "80%",
      height: "20%",
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
      margin: "15px",
      cursor: "pointer",
    },
  };
}

export default Login;