import { Box, Container, TextField, Typography } from "@mui/material";
import React from "react";

function Cadastro() {
  return (
    <Container>
      <Typography>Cadastro</Typography>

      <TextField
        required
        fullWidth
        margin="normal"
        label="Digite seu E-mail"
        name="email"
        id="email"
        variant="standard"
      />
    </Container>
  );
}

export default Cadastro;
