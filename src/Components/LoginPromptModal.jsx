import React from "react";
import { Modal, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function LoginPromptModal({ open, onClose }) {
  const navigate = useNavigate();

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          p: 4,
          borderRadius: 2,
          width: 300,
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: 8 }}>Você precisa estar logado</h2>
        <p style={{ marginBottom: 24 }}>Deseja fazer login ou se cadastrar?</p>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          style={{ marginBottom: 8 }}
          onClick={() => navigate("/login")}
        >
          Login
        </Button>

        <Button
          variant="outlined"
          color="primary"
          fullWidth
          onClick={() => navigate("/cadastro")}
        >
          Cadastrar
        </Button>
      </Box>
    </Modal>
  );
}