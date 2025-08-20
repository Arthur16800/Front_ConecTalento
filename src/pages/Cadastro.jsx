import { Box, Container, TextField, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import background2 from "../assets/background2.png";
import logo from "../assets/logo_ct.png";
import background from "../assets/background.png";
import React from "react";
import { Link } from "react-router-dom";
import ModalBase from "../Components/ModalBase";
import { useState, useEffect } from "react";

function Cadastro() {
  const [openModal, setOpenModal] = useState(false);
  const styles = Styles();

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <>
      <Box style={styles.principal}>
        <Container style={styles.container}>
          <Box style={styles.box_Cadastro}>
            <Box style={styles.box_logo_img}>
              <img style={styles.logo} src={logo} alt="Logo site" />
            </Box>

            <Box style={styles.box_Formulario}>
              <Typography style={styles.font_Titulo}>Cadastro</Typography>

              <TextField
                required
                fullWidth
                margin="normal"
                label="Nome"
                name="email"
                id="email"
                variant="outlined"
                style={styles.camposForm}
              />

              <TextField
                required
                fullWidth
                margin="normal"
                label="Email"
                name="email"
                id="email"
                variant="outlined"
                style={styles.camposForm}
              />
              <TextField
                required
                fullWidth
                margin="normal"
                label="Senha"
                name="email"
                id="email"
                variant="outlined"
                style={styles.camposForm}
              />
              <TextField
                required
                fullWidth
                margin="normal"
                label="Confirme sua senha"
                name="email"
                id="email"
                variant="outlined"
                style={styles.camposForm}
              />

              <Button style={styles.button} onClick={() => handleOpenModal()}>
                Cadastrar
              </Button>

              <Box style={styles.textoLogin}>
                <Typography>Já possui uma conta?</Typography>
                <Typography component={Link}>Faça login</Typography>
              </Box>
            </Box>
          </Box>

          <Box style={styles.box_IMG_02}>
            <Typography style={styles.style_Font}>
              Seja bem-vindo ao ConecTalento!
            </Typography>
          </Box>
        </Container>
      </Box>

      <ModalBase open={openModal} onClose={handleCloseModal}>
        <Box sx={styles.content}>
          <Typography variant="h5" fontWeight="bold">
            Quase lá
          </Typography>
          <Typography>Digite o código que enviamos no seu email</Typography>
          <TextField
            variant="outlined"
            placeholder="XXX-XXX"
          />
          <Button variant="contained" sx={styles.button}>
            Continuar
          </Button>
        </Box>
      </ModalBase>
    </>
  );
}

function Styles() {
  return {
    container: {
      backgroundColor: "white",
      width: "55%",
      height: "500px",
      borderRadius: "5px",
      boxShadow: "3px 8px 24px rgba(0, 0, 0, 0.71)",
      display: "flex",
      alignItems: "center",
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      padding: 0,
    },
    box_IMG_02: {
      backgroundImage: `url(${background2})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      height: "100%",
      width: "40%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#fff",
      fontSize: "24px",
      fontWeight: "bold",
      borderRadius: "0px 5px 5px 0px",
    },
    box_Cadastro: {
      width: "60%",
      height: "100%",
      borderRadius: "5px 0px 0px 5px",
      display: "flex",
      flexDirection: "column",
    },
    style_Font: {
      width: "95%",
      fontSize: "33px",
      fontWeight: "900",
    },
    box_logo_img: {
      width: "100%",
      display: "flex",
      justifyContent: "start",
    },
    logo: {
      marginTop: "10px",
      marginLeft: "10px",
      width: "45px",
    },
    font_Titulo: {
      fontWeight: "600",
      fontSize: "35px",
    },
    box_Formulario: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      alignContent: "center",
      justifyContent: "center",
    },
    textoLogin: {
      display: "flex",
      gap: "5px",
    },
    camposForm: {
      width: "80%",
      margin: "7px",
    },
    button: {
      backgroundColor: "#8500C2",
      color: "#fff",
      borderRadius: "8px",
      width: "50%",
      height: "45px",
      fontWeight: "bold",
      fontSize: "16px",
      textTransform: "none",
      marginTop: "15px",
      marginBottom: "10px",
      cursor: "pointer",
    },
    content: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 1,
      marginTop: 5
    },
  };
}

export default Cadastro;
