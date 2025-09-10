import React, { useState, useEffect } from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ModalBase from "./ModalBase"; // ajuste o caminho conforme seu projeto
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function formatNumber(num) {
  if (num < 1000) return num.toString();

  const units = [
    { value: 1e9, symbol: "B" },
    { value: 1e6, symbol: "M" },
    { value: 1e3, symbol: "K" },
  ];

  for (let i = 0; i < units.length; i++) {
    if (num >= units[i].value) {
      const formatted = (num / units[i].value).toFixed(1).replace(/\.0$/, "");
      return formatted + units[i].symbol;
    }
  }

  return num.toString();
}

export default function LikeButton({ initialLikes = 0 }) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikes);
  const [openModal, setOpenModal] = useState(false);

  const navigate = useNavigate();

  // Função para verificar se o usuário está logado (token presente)
  const isLoggedIn = Boolean(localStorage.getItem("token")); // ou sessionStorage, dependendo de onde o token está armazenado

  const toggleLike = () => {
    if (!isLoggedIn) {
      setOpenModal(true); // Exibe o modal caso não esteja logado
      return;
    }
    setLiked(!liked);
    setLikesCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  // Verificar e fechar o modal se o usuário já estiver logado
  useEffect(() => {
    if (isLoggedIn) {
      setOpenModal(false); // Fecha o modal se estiver logado
    }
  }, [isLoggedIn]); // Isso garante que, se o estado de login mudar, o modal será atualizado

  return (
    <>
      <div
        onClick={toggleLike}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        {liked ? (
          <FavoriteIcon style={{ color: "red" }} />
        ) : (
          <FavoriteBorderIcon style={{ color: "blue" }} />
        )}
        <span style={{ fontSize: "13px", marginTop: 2 }}>
          {formatNumber(likesCount)}
        </span>
      </div>

      {/* Exibe o modal apenas se o usuário não estiver logado */}
      <ModalBase open={openModal} onClose={() => setOpenModal(false)}>
        <h2 style={{ marginBottom: 8 }}>Você precisa estar logado</h2>
        <p style={{ marginBottom: 24 }}>Deseja fazer login ou se cadastrar?</p>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mb: 1 }}
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
      </ModalBase>
    </>
  );
}
