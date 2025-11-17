import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ModalBase from "./ModalBase";

export default function LoginPromptModal({ open, onClose }) {
  const navigate = useNavigate();

  return (
    <ModalBase open={open} onClose={onClose}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: 2,
          paddingTop: 4,
        }}
      >
        <Typography variant="h6" fontWeight={700}>
          Você precisa estar logado
        </Typography>

        <Typography sx={{ marginBottom: 2 }}>
          Deseja fazer login ou se cadastrar?
        </Typography>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            background: "#7A2CF6",
            textTransform: "none",
            fontWeight: 700,
            borderRadius: "9999px",
          }}
          onClick={() => navigate("/login")}
        >
          Login
        </Button>

        <Button
          variant="outlined"
          color="primary"
          fullWidth
          sx={{
            borderColor: "#7A2CF6",
            color: "#7A2CF6",
            textTransform: "none",
            fontWeight: 700,
            borderRadius: "9999px",
          }}
          onClick={() => navigate("/cadastro")}
        >
          Cadastrar
        </Button>
      </Box>
    </ModalBase>
  );
}