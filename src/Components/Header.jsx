import React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import conecTalento from "../assets/ConecTalento.png";
import { useNavigate, useLocation } from "react-router-dom";
import { InputBase } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const rotasComPesquisa = ["/"];
  const mostrarPesquisa = rotasComPesquisa.includes(location.pathname);

  const Styles = Style();

  return (
    <Container maxWidth="xs">
      <Box sx={Styles.container}>
        <img style={Styles.logo} src={conecTalento} alt="Logo" />

        {mostrarPesquisa && (
          <Box sx={Styles.searchBox}>
            <InputBase placeholder="Pesquisar..." sx={Styles.inputBase} />
            <SearchIcon sx={Styles.searchIcon} />
          </Box>
        )}

        <Box sx={Styles.userBox}>
          <AccountCircleIcon sx={Styles.accountIcon} />
          User
          <KeyboardArrowDownIcon sx={Styles.arrowIcon} />
        </Box>
      </Box>
    </Container>
  );
};

function Style() {
  return {
    container: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      height: "70px",
      backgroundColor: "#8500C2",
      position: "absolute",
      top: 0,
      left: 0,
    },
    logo: {
      height: "40%",
      width: "20%",
      marginLeft: "2%",
    },
    searchBox: {
      display: "flex",
      alignItems: "center",
      backgroundColor: "white",
      borderRadius: "5px",
      width: "300px",
      height: "40px",
      marginRight: "10%",
    },
    inputBase: {
      flex: 1,
      fontSize: "15px",
      margin: "10px",
    },
    userBox: {
      display: "flex",
      alignItems: "center",
      fontFamily: "Arial",
      backgroundColor: "transparent",
      padding: "6px 12px",
      borderRadius: "5px",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
      "&:hover": {
        backgroundColor: "rgba(255, 255, 255, 0.15)",
      },
      marginRight: "2%",
      color: "white",
      gap: "4px",
    },
    arrowIcon: {
      marginLeft: -0.5,
    },
    searchIcon: {
      color: "#555",
    },
    accountIcon: {
      color: "#E5E5E5",
      fontSize: 28,
    },
  };
}
export default Header;
