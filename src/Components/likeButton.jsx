import React, { useState, useEffect } from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Badge } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import LoginPromptModal from "./LoginPromptModal";
import sheets from "../axios/axios";

// Função para formatar números
function formatNumber(num) {
  if (num < 1000) return num.toString();
  const units = [
    { value: 1e9, symbol: "B" },
    { value: 1e6, symbol: "M" },
    { value: 1e3, symbol: "K" },
  ];
  for (let i = 0; i < units.length; i++) {
    if (num >= units[i].value) return (num / units[i].value).toFixed(1).replace(/\.0$/, "") + units[i].symbol;
  }
  return num.toString();
}

export default function LikeButton({ projectId, initialLikes = 0 }) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikes);
  const [openModal, setOpenModal] = useState(false);
  const [hearts, setHearts] = useState([]);

  const isLoggedIn = Boolean(localStorage.getItem("token"));
  const userId = localStorage.getItem("id_usuario");

  const triggerHeartAnimation = () => {
    const id = Date.now();
    setHearts((prev) => [...prev, id]);
    setTimeout(() => setHearts((prev) => prev.filter((h) => h !== id)), 1000);
  };

  const toggleLike = async () => {
    if (!isLoggedIn) {
      setOpenModal(true);
      return;
    }

    if (!id_usuario) {
      console.error("id do usuario não encontrado no localStorage");
      return;
    }

    try {
      const res = await sheets.likeProject(projectId, userId);
      console.log("Resposta do like:", res.data);

      if (res.data.curtido) {
        setLiked(true);
        setLikesCount((prev) => prev + 1);
        triggerHeartAnimation();
      } else {
        setLiked(false);
        setLikesCount((prev) => prev - 1);
      }
    } catch (err) {
      console.error("Erro ao curtir:", err);
    }
  };

  useEffect(() => {
    if (isLoggedIn) setOpenModal(false);
  }, [isLoggedIn]);

  return (
    <>
      <Badge badgeContent={formatNumber(likesCount)} color="secondary" overlap="circular" sx={styles.badgeWrapper}>
        <motion.div
          whileTap={{ scale: 0.7 }}
          animate={liked ? { scale: [1, 1.3, 1] } : {}}
          transition={{ duration: 0.3 }}
          onClick={toggleLike}
          style={styles.likeBox}
        >
          {liked ? <FavoriteIcon sx={{ color: "red" }} /> : <FavoriteBorderIcon sx={{ color: "purple" }} />}
          <AnimatePresence>
            {hearts.map((id) => (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 0, scale: 0.5 }}
                animate={{ opacity: 1, y: -60, scale: 1, x: Math.random() * 40 - 20 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                style={styles.floatingHeart}
              >
                ❤️
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </Badge>

      <LoginPromptModal open={openModal} onClose={() => setOpenModal(false)} />
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
    border: "2px solid #F7F7F7",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    userSelect: "none",
    position: "relative",
    overflow: "visible",
  },
  floatingHeart: {
    position: "absolute",
    fontSize: "1.2rem",
    pointerEvents: "none",
  },
};
