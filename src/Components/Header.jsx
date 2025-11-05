import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { useNavigate, useLocation } from "react-router-dom";
import {
  InputBase,
  Menu,
  MenuItem,
  IconButton,
  Avatar,
  Typography,
} from "@mui/material";
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

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const trimmedQuery = searchQuery.trim();
    const encoded = encodeURIComponent(trimmedQuery);
    navigate(`/?search=${encoded}`, { replace: false });

    if (location.pathname === "/" && typeof onSearch === "function") {
      onSearch(trimmedQuery);
    }
  };

  const open = Boolean(anchorEl);

  return (
    <Box
      sx={{ ...styles.container, height: "100%" }}
      className="header-container"
    >
      <style>{`
        @media screen and (max-width: 600px) {
          .header-container{
            padding-bottom: 5px;
            widht: 100vw
          }
          .box-logo-pesquisa {
            width: 100% !important;
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 8px !important;
          }
          .logo-text {
            font-size: 28px !important;
            margin-left: 8px !important;
            margin-right: 0 !important;
          }
          .search-box {
            min-width: 200px;
            width: 60% !important;
            margin-left: 8px !important;
            height: 40px !important;
          }
          /* mostrar apenas o avatar do usuário */
          .user-meta,
          .arrow-icon {
            display: none !important;
          }
          .user-box {
            padding: 0 !important;
            background: transparent !important;
            margin-right: 20px !important;
          }
        }
      `}</style>

      {/* MENU */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        disableScrollLock
      >
        <MenuItem onClick={() => navigate("/perfiluser")}>
          Área do Usuário
        </MenuItem>
        <MenuItem onClick={() => navigate("/" + userData?.username)}>
          Meu Portifólio
        </MenuItem>
        <MenuItem onClick={handleLogout}>Sair</MenuItem>
      </Menu>

      <Box sx={styles.box_logo_pesquisa} className="box-logo-pesquisa">
        {/* LOGO TEXTO */}
        <Typography
          onClick={() => navigate("/")}
          sx={styles.logoText}
          className="logo-text"
        >
          ConecTalento
        </Typography>

        {/* PESQUISA */}
        <form
          onSubmit={handleSearchSubmit}
          style={styles.searchBox}
          className="search-box"
        >
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
      </Box>

      {/* PERFIL / LOGIN */}
      <Box sx={styles.box_perfil_menu} className="profile-area">
        <Box
          sx={styles.userBox}
          className="user-box"
          onClick={(event) => {
            if (!isLogged) {
              navigate("/login");
            } else {
              setAnchorEl(event.currentTarget);
            }
          }}
        >
          <Avatar
            src={isLogged && userData?.imagem ? userData.imagem : ""}
            alt={userData?.username}
            sx={{ width: 32, height: 32, bgcolor: "#888" }}
          >
            {!isLogged ? "?" : userData?.username?.[0]?.toUpperCase() || "U"}
          </Avatar>

          {/* infos do usuário — serão ocultadas no mobile */}
          <Box
            sx={{ display: "flex", flexDirection: "column", ml: 1 }}
            className="user-meta"
          >
            <Typography sx={{ fontSize: 14, lineHeight: 1 }}>
              {isLogged
                ? userData?.username || userData?.name || "Usuário"
                : "Login"}
            </Typography>

            {isLogged && userPlan.authenticated && (
              <Typography sx={{ fontSize: 11, opacity: 0.8, mt: 0.3 }}>
                {userPlan.plan === false ? "Free" : "Premium"}
              </Typography>
            )}
          </Box>

          {isLogged && (
            <KeyboardArrowDownIcon
              className="arrow-icon"
              sx={{
                ...styles.arrowIcon,
                transform: open ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.3s ease",
              }}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

function Styles() {
  return {
    container: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      backgroundColor: "#64058fff",
      mb: 1,
    },
    logoText: {
      fontFamily: "Montserrat, sans-serif",
      fontWeight: 800,
      fontSize: "40px",
      color: "white",
      cursor: "pointer",
      userSelect: "none",
      marginLeft: 2,
      marginRight: 1,
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
    box_perfil_menu: {
      marginRight: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    },
    box_logo_pesquisa: {
      width: "68%",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
  };
}

export default Header;
