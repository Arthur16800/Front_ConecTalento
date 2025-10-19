import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import conecTalento from "../assets/ConecTalento.png";
import { useNavigate } from "react-router-dom";
import { InputBase, Menu, MenuItem, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const Header = ({ children, onSearch }) => {
  const navigate = useNavigate();
  const styles = Styles();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [isLogged, setIsLogged] = useState(false);
  const [username, setUsername] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Estado para mostrar/ocultar header
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");
    setIsLogged(!!token);
    if (token && storedUsername) setUsername(storedUsername);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleLogout = () => {
    localStorage.clear();  
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

  const handleMenuClose = () => setAnchorEl(null);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchQuery(value);
    if (onSearch) onSearch(value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (onSearch) onSearch(searchQuery.trim());
  };

  return (
    <>
      {/* Header fixo */}
      <Box
        sx={{
          position: "fixed",
          top: showHeader ? 0 : -70,
          left: 0,
          width: "100%",
          height: "70px",
          transition: "top 0.3s ease",
          zIndex: 1000,
        }}
      >
        <Container maxWidth={false} disableGutters sx={{ height: "100%" }}>
          <Box sx={{ ...styles.container, height: "100%" }}>
            <img
              style={styles.logo}
              src={conecTalento}
              alt="Logo"
              onClick={() => navigate("/")}
            />

            {/* Barra de pesquisa */}
            <form onSubmit={handleSearchSubmit} style={styles.searchBox}>
              <InputBase
                placeholder="Pesquisar projetos..."
                sx={styles.inputBase}
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <IconButton type="submit" sx={styles.searchIcon}>
                <SearchIcon />
              </IconButton>
            </form>

            {/* Login / usuário */}
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
      </Box>

      {/* Espaço para o conteúdo não ficar atrás do header */}
      <Box sx={{ pt: "70px", pb: 2 }}>{children}</Box>
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
      height: "100%",
      backgroundColor: "#64058fff",
      px: 2, // padding horizontal leve para o conteúdo não encostar nas bordas
    },
    logo: {
      height: "40%",
      width: "20%",
      cursor: "pointer",
    },
    searchBox: {
      display: "flex",
      alignItems: "center",
      backgroundColor: "white",
      borderRadius: "5px",
      width: "300px",
      height: "40px",
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
      marginRight: "2%", // <- aqui você controla a distância da borda direita
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
