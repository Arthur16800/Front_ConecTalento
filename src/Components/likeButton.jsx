import React, { useState } from "react";
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

export default function LikeButton({ initialLikes = 0, isLoggedIn = false }) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikes);
  const [openModal, setOpenModal] = useState(false);

  const navigate = useNavigate();

  const toggleLike = () => {
    if (!isLoggedIn) {
      setOpenModal(true);
      return;
    }
    setLiked(!liked);
    setLikesCount((prev) => (liked ? prev - 1 : prev + 1));
  };

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
