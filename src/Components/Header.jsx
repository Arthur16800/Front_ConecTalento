import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import conecTalento from "../assets/ConecTalento.png";
import { useNavigate, useLocation } from "react-router-dom";
import { InputBase, Menu, MenuItem, IconButton, Avatar, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import api from "../axios/axios";

const Header = ({ onSearch }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const styles = Styles();

  const [anchorEl, setAnchorEl] = useState(null);
  const [isLogged, setIsLogged] = useState(false);
  const [userData, setUserData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [userPlan, setUserPlan] = useState({ plan: null, authenticated: null });

  async function getUserById() {
    const authenticated = localStorage.getItem("authenticated");
    if (!authenticated) {
      setUserPlan((prev) => ({ ...prev, authenticated: false }));
      return null;
    }
    const id_user = localStorage.getItem("id_usuario");
    try {
      const response = await api.getUserById(id_user);
      const plan = Boolean(response.data.profile.plano);
      setUserPlan((prev) => ({ ...prev, plan, authenticated: true }));
      return plan;
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
    }
  }

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

          setUserData({ ...data, imagem: base64Src });
          getUserById();
        })
        .catch((err) => console.error("Erro ao buscar dados do usuário:", err));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // Sync input with URL query param (so when user navigates to /?search=... the input shows value)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("search") || "";
    setSearchQuery(q);
  }, [location.search]);

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

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const trimmedQuery = searchQuery.trim();

    // Always update the URL to include the search param.
    // navigate to "/" with query so Home can read it and apply filter immediately.
    const encoded = encodeURIComponent(trimmedQuery);
    // If already on "/", still update the URL so Home's effect can react (and keep history tidy)
    navigate(`/?search=${encoded}`, { replace: false });

    // If parent passed onSearch and we're on home, call it immediately to avoid waiting for nav re-render.
    // But do not rely only on this — Home will also react to location.search.
    if (location.pathname === "/" && typeof onSearch === "function") {
      onSearch(trimmedQuery);
    }
  };

  const open = Boolean(anchorEl);

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

            {/* PESQUISA */}
            <form onSubmit={handleSearchSubmit} style={styles.searchBox}>
              <InputBase
                placeholder="Pesquisar projetos..."
                sx={styles.inputBase}
                value={searchQuery}
                onChange={handleSearchChange}
                // onKeyDown not necessary because form handles Enter
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
              <Avatar
                src={isLogged && userData?.imagem ? userData.imagem : ""}
                alt={userData?.username}
                sx={{ width: 32, height: 32, bgcolor: "#888" }}
              >
                {!isLogged ? "?" : userData?.username?.[0]?.toUpperCase() || "U"}
              </Avatar>

              {/* Nome e Plano */}
              <Box sx={{ display: "flex", flexDirection: "column", ml: 1 }}>
                <Typography sx={{ fontSize: 14, lineHeight: 1 }}>
                  {isLogged ? userData?.username || userData?.name || "Usuário" : "Login"}
                </Typography>

                {isLogged && userPlan.authenticated && (
                  <Typography sx={{ fontSize: 11, opacity: 0.8, mt: 0.3 }}>
                    {userPlan.plan === false ? "Free" : "Premium"}
                  </Typography>
                )}
              </Box>

              {isLogged && (
                <IconButton onClick={handleMenuOpen} sx={{ color: "#ffffff", padding: 0 }}>
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
                <MenuItem onClick={() => navigate("/perfiluser")}>Área do Usuário</MenuItem>
                <MenuItem onClick={() => navigate("/" + userData?.username)}>Meu Portfólio</MenuItem>
                <MenuItem onClick={handleLogout}>Sair</MenuItem>
              </Menu>
            </Box>
          </Box>
        </Container>
      </Box>

      <Box sx={{ pt: "70px", pb: 2 }} />
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