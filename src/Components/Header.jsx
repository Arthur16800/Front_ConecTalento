import React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import conecTalento from "../assets/ConecTalento.png";
import { useNavigate, useLocation } from "react-router-dom";
import { InputBase } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Rotas onde a barra de pesquisa aparece
  const rotasComPesquisa = ["/"];
  const mostrarPesquisa = rotasComPesquisa.includes(location.pathname);

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "18%",
          width: "100%",
          height: "70px",
          backgroundColor: "#8500C2",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        {/* Logo */}
        <img
          style={{
            height: "40%",
            width: "20%",
            marginLeft: "1%",
          }}
          src={conecTalento}
          alt="Logo"
        />

        {mostrarPesquisa && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "white",
              borderRadius: "5px",
              width: "300px",
              height: "40px",
            }}
          >
            <InputBase
              placeholder="Pesquisar..."
              sx={{ flex: 1, fontSize: "14px", margin: "10px" }}
            />
            <SearchIcon sx={{ color: "#555" }} />
          </Box>
        )}

        {/* User */}
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            backgroundColor: "white",
            width: "40px",
            height: "40px",
            cursor: "pointer",
          }}
        >
          <AccountCircleIcon sx={{ color: "#c2c2c2ff", fontSize: 28 }} /> 
          User
        </Box>
      </Box>
    </Container>
  );
};

export default Header;
