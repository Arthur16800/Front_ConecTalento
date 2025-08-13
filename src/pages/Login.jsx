import * as React from "react";
import { useState } from "react";
// Importação dos componentes MUI
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

// Importação dos componentes do Roteador
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const styles = Styles();
  return (
    <Container style={styles.container}>
      <Box>

      </Box>
      <Box>
        <Box></Box>
        <Box></Box>
      </Box>
    </Container>
  );
}

export default Login;

function Styles() {
  return {
    container: {
      backgroundColor: " rgb(255, 255, 255)",
      width: "55%",
      height: "500px",
      borderRadius: "5px",
      boxShadow: "3px 8px 24px rgba(0, 0, 0, 0.71)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    },
  };
}
