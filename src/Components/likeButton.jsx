import React, { useState, useEffect } from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ModalBase from "./ModalBase";
import { Button, Box, Badge } from "@mui/material";
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
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  const toggleLike = () => {
    if (!isLoggedIn) {
      setOpenModal(true);
      return;
    }
    setLiked(!liked);
    setLikesCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  useEffect(() => {
    if (isLoggedIn) {
      setOpenModal(false);
    }
  }, [isLoggedIn]);

  return (
    <>
      <Badge
        badgeContent={formatNumber(likesCount)}
        color="secondary"
        overlap="circular"
        style={styles.badgeWrapper}
      >
        <Box onClick={toggleLike} style={styles.likeBox}>
          {liked ? (
            <FavoriteIcon sx={{ color: "red" }} />
          ) : (
            <FavoriteBorderIcon sx={{ color: "purple" }} />
          )}
        </Box>
      </Badge>

      <ModalBase open={openModal} onClose={() => setOpenModal(false)}>
        <h2 style={{ marginBottom: 8 }}>Você precisa estar logado</h2>
        <p style={{ marginBottom: 24 }}>Deseja fazer login ou se cadastrar?</p>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          style={styles.modalButton}
          onClick={() => navigate("/login")}
        >
          Login
        </Button>

        <Button
          variant="outlined"
          color="primary"
          fullWidth
          style={styles.modalButton}
          onClick={() => navigate("/cadastro")}
        >
          Cadastrar
        </Button>
      </ModalBase>
    </>
  );
}

const styles = {
  badgeWrapper: {
    position: "absolute",
    bottom: -15,
    transform: "translateX(-35%)",
    "& .MuiBadge-badge": {
      backgroundColor: "purple",
      color: "white",
      fontSize: "0.7rem",
      height: 18,
      minWidth: 18,
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
  },
  likeBox: {
    width: 50,
    height: 50,
    borderRadius: "50%",
    backgroundColor: "white",
    border: "2px solid #FFFCFC",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    userSelect: "none",
  },
  modalButton: {
    marginBottom: 8,
  },
};
