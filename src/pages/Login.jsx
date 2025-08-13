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
import { Link, useNavigate } from "react-router-dom";
import {
  display,
  fontFamily,
  fontSize,
  fontStyle,
  height,
  padding,
  width,
} from "@mui/system";

function Login() {
  const styles = Styles();
  return (
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
        <Box>
          <Typography>Login</Typography>

          <Typography>
            Seja bem-vindo(a)! faça seu login na ConecTalento
          </Typography>

          <TextField
            required
            fullWidth
            margin="normal"
            label="Digite seu CPF"
            name="cpf"
            id="cpf"
            variant="outlined"
          />

          <TextField
            required
            fullWidth
            margin="normal"
            label="Digite sua senha"
            name="senha"
            id="password"
            variant="outlined"
          />

          <Button>
            Login
          </Button>

          <Box>
            <Typography>Não possui uma conta?</Typography>
            <Typography component={Link}> Cadastre-se</Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

export default Login;

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
      width: "55px",
    },
  };
}
