import React from "react";
import { Box, Container, Typography, Button } from "@mui/material";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  return (
    <Container
      maxWidth="md"
      sx={{
        minHeight: "70vh",
        display: "grid",
        placeItems: "center",
        position: "relative",
        py: 8,
      }}
    >
      {/* Card central (mantém cores e estilo) */}
      <Box
        sx={{
          textAlign: "center",
          p: { xs: 3, sm: 4 },
          borderRadius: 4,
          border: "1px solid",
          borderColor: "divider",
          backdropFilter: "blur(6px)",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.06) 100%)",
        }}
      >
        {/* Ícone dentro de círculo */}
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 72,
            height: 72,
            borderRadius: "50%",
            mb: 2,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <SearchOffIcon sx={{ fontSize: 34 }} />
        </Box>

        {/* 404 com gradiente roxo */}
        <Typography
          sx={{
            fontWeight: 900,
            fontSize: { xs: 70, sm: 96 },
            lineHeight: 1,
            letterSpacing: -2,
            mb: 1,
            background: "linear-gradient(90deg, #6A00B6, #35045F)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          404
        </Typography>

        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
          Página não encontrada
        </Typography>

        <Typography sx={{ color: "text.secondary", maxWidth: 520, mx: "auto", mb: 3 }}>
          A página que você procura pode ter sido movida, removida ou o link está
          incorreto.
        </Typography>

        {/* Somente o botão Voltar (removido "Ir para a Home") */}
        <Button
          variant="contained"
          onClick={() => navigate(-1)}
          sx={{
            textTransform: "none",
            borderRadius: 2,
            px: 3,
            py: 1.2,
            bgcolor: "#8500C2",
            "&:hover": { bgcolor: "#6A00B6" },
          }}
        >
          Voltar
        </Button>
      </Box>
    </Container>
  );
}

export default NotFound;