import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import conecTalento from "../assets/ConecTalento.png";
import { useNavigate } from "react-router-dom";
import { InputBase, Menu, MenuItem, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const Header = ({ children }) => {
  const navigate = useNavigate();
  const styles = Styles();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const [isLogged, setIsLogged] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");
    setIsLogged(!!token);
    if (token && storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setIsLogged(false);
    setUsername("");
    navigate("/login");
  };

  const handleMenuOpen = (event) => {
    if (!isLogged) {
      navigate("/login");
      return;
    }
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Container maxWidth="xs">
        <Box sx={styles.container}>
          <img
            style={styles.logo}
            src={conecTalento}
            alt="Logo"
            onClick={() => navigate("/")}
          />

          <Box sx={styles.searchBox}>
            <InputBase placeholder="Pesquisar..." sx={styles.inputBase} />
            <SearchIcon sx={styles.searchIcon} />
          </Box>
          
          <Box
            sx={styles.userBox}
            onClick={() => {
              if (!isLogged) navigate("/login");
            }}
          >
            <AccountCircleIcon sx={styles.accountIcon} />
            <span style={{ cursor: "pointer" }}>
              {isLogged ? username : "Login"}
            </span>

            {isLogged && (
              <IconButton
                onClick={handleMenuOpen}
                sx={{ color: "#ffffff", padding: 0 }}
              >
                <KeyboardArrowDownIcon sx={styles.arrowIcon} />
              </IconButton>
            )}

            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <MenuItem onClick={() => navigate("/perfiluser")}>
                User Area
              </MenuItem>
              <MenuItem onClick={() => navigate("/portifoliouser")}>
                My portfolio
              </MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        </Box>
      </Container>
      <Box sx={{ marginTop: "70px" }}>{children}</Box>
    </>
  );
};

function Styles() {
  return {
    container: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      height: "70px",
      backgroundColor: "#64058fff",
      position: "absolute",
      top: 0,
      left: 0,
    },
    logo: {
      height: "40%",
      width: "20%",
      marginLeft: "2%",
      cursor: "pointer",
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
