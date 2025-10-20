import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import conecTalento from "../assets/ConecTalento.png";
import { useNavigate, useLocation } from "react-router-dom";
import {
  InputBase,
  Menu,
  MenuItem,
  IconButton,
  Avatar,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import api from "../axios/axios";

const Header = ({ children, onSearch }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const styles = Styles();

  const [anchorEl, setAnchorEl] = useState(null);
  const [isLogged, setIsLogged] = useState(false);
  const [userData, setUserData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const open = Boolean(anchorEl);

  // 🔹 Busca os dados do usuário
  useEffect(() => {
    const token = localStorage.getItem("token");
    const id_usuario = localStorage.getItem("id_usuario");
    setIsLogged(!!token);

    if (token && id_usuario) {
      api
        .getUserById(id_usuario)
        .then((res) => {
          const data = res.data.profile;
          const isBase64 = data.imagem?.startsWith("data:image");
          const base64Src = data.imagem
            ? isBase64
              ? data.imagem
              : `data:image/jpeg;base64,${data.imagem}`
            : null;

          setUserData({
            ...data,
            imagem: base64Src,
          });
        })
        .catch((err) => console.error("Erro ao buscar dados do usuário:", err));
    }
  }, []);

  // 🔹 Oculta o header ao rolar
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

  // 🔹 Sincroniza searchQuery com o state da rota
  useEffect(() => {
    if (location.state?.search) {
      setSearchQuery(location.state.search);
    }
  }, [location.state]);

  // 🔹 Logout
  const handleLogout = () => {
    localStorage.clear();
    setIsLogged(false);
    setUserData(null);
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

  // 🔹 Lógica de pesquisa
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const trimmedQuery = searchQuery.trim();
    
    if (location.pathname === "/") {
      // Se já está na Home, executa a pesquisa diretamente
      if (onSearch) onSearch(trimmedQuery);
    } else {
      // Se está em outra página, navega para Home com o termo de pesquisa
      navigate("/", { state: { search: trimmedQuery } });
    }
  };

  return (
    <>
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
            {/* LOGO */}
            <img
              style={styles.logo}
              src={conecTalento}
              alt="Logo"
              onClick={() => navigate("/")}
            />

            {/* CAMPO DE PESQUISA */}
            <form onSubmit={handleSearchSubmit} style={styles.searchBox}>
              <InputBase
                placeholder="Pesquisar projetos..."
                sx={styles.inputBase}
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit(e)}
              />
              <IconButton type="submit" sx={styles.searchIcon}>
                <SearchIcon />
              </IconButton>
            </form>

            {/* PERFIL / LOGIN */}
            <Box
              sx={styles.userBox}
              onClick={() => {
                if (!isLogged) navigate("/login");
              }}
            >
              {isLogged && userData?.imagem ? (
                <Avatar
                  src={userData.imagem}
                  alt={userData.username}
                  sx={{ width: 32, height: 32 }}
                />
              ) : (
                <Avatar sx={{ bgcolor: "#888", width: 32, height: 32 }}>
                  {!isLogged ? "?" : userData?.username?.[0]?.toUpperCase() || "U"}
                </Avatar>
              )}

              <span style={{ cursor: "pointer", marginLeft: "8px" }}>
                {isLogged
                  ? userData?.username || userData?.name || "Login"
                  : "Login"}
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
                  Área do Usuário
                </MenuItem>
                <MenuItem
                  onClick={() =>
                    navigate("/" + userData?.username)
                  }
                >
                  Meu Portifólio
                </MenuItem>
                <MenuItem onClick={handleLogout}>Sair</MenuItem>
              </Menu>
            </Box>
          </Box>
        </Container>
      </Box>

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
      px: 2,
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
  };
}

export default Header;