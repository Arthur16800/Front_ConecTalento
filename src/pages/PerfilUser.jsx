import * as React from "react";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import background2 from "../assets/background2.png";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";

function PerfilUser() {
  const styles = Styles();

  return (
    <Box style={styles.container}>
      <Box style={styles.leftCard}>
        <Box style={styles.box_IMG} />
        <Box style={styles.user_perfil}>
          <AccountCircleIcon style={styles.accountIcon} />
          <span style={styles.user_name}>Claudio Ramos</span>
          <KeyboardArrowDownIcon style={styles.arrowIcon} />
          <RemoveCircleIcon style={styles.removeIcon} />
        </Box>

        <Button style={styles.editBtn}>Editar Perfil</Button>
      </Box>

      <Box style={styles.formPanel}>
        <Typography style={styles.formTitle}>Perfil do Usuário</Typography>

        <TextField
          required
          fullWidth
          margin="normal"
          label="Nome"
          variant="outlined"
          style={styles.camposForm}
        />

        <TextField
          required
          fullWidth
          margin="normal"
          label="E-mail"
          type="email"
          variant="outlined"
          style={styles.camposForm}
        />

        <TextField
          required
          fullWidth
          margin="normal"
          label="Senha"
          type="password"
          variant="outlined"
          style={styles.camposForm}
        />

        <TextField
          required
          fullWidth
          margin="normal"
          label="Confirme sua senha"
          type="password"
          variant="outlined"
          style={styles.camposForm}
        />

        <TextField
          required
          fullWidth
          margin="normal"
          label="Biografia"
          multiline
          rows={3}
          variant="outlined"
          style={styles.camposForm}
        />

        <Button style={styles.saveBtn}>Salvar</Button>
      </Box>
    </Box>
  );
}

function Styles() {
  return {
    container: {
      display: "flex",
      justifyContent: "space-between",
      gap: 30,
      padding: "24px 16px",
      maxWidth: "70%",
      margin: "0 auto",
    },
    leftCard: {
      maxWidth: 280,
      minWidth: 100,
      flex:2,
      width:"100%",
      height: "10%",
      backgroundColor: "#fff",
      border: "1px solid #E5E5E5",
      borderRadius: 16,
      display: "flex",
      flexDirection: "column",
      alignItems: "stretch",
    },
    box_IMG: {
      height: 50,
      borderRadius: "16px 16px 0px 0px",
      marginBottom: 16,
      backgroundImage: `url(${background2})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    },
    user_perfil: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "0 8px",
      fontFamily: "Arial, sans-serif",
      color: "#333",
      marginBottom: 12,
    },
    accountIcon: { 
        color: "#CFCFCF", fontSize: 32 
    },
    arrowIcon: { 
        marginLeft: -4 
    },
    removeIcon: { 
        color: "#FF4B4B", cursor: "pointer" 
    },
    user_name: { 
        flexGrow: 1 
    },
    editBtn: {
      margin: "auto",
      marginTop: 12,
      marginBottom: 12,
      borderRadius: 5,
      textTransform: "none",
      fontWeight: 700,
      padding: "10px 0",
      background: "linear-gradient(90deg, #7A2CF6 0%, #6D2AF0 100%)",
      color: "#fff",
      border: "none",
      width: "90%"
    },
    formPanel: {
      flex: 1,
      backgroundColor: "#fff",
      border: "1px solid #E5E5E5",
      borderRadius: 16,
      padding: 24,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      minWidth: 400,
      maxWidth: 800,
    },
    formTitle: {
      fontSize: 20,
      fontWeight: 600,
      marginBottom: 8,
      textAlign: "center",
      color: "#222",
    },
    camposForm: {
      width: "100%",
      maxWidth: 560,
    },
    input: {
      backgroundColor: "#EFEFEF",
      borderRadius: 5,
    },
    saveBtn: {
      width: "20%",
      maxWidth: 560,
      marginTop: 16,
      borderRadius: 5,
      textTransform: "none",
      fontWeight: 700,
      padding: "12px 0",
      background: "linear-gradient(90deg, #7A2CF6 0%, #6D2AF0 100%)",
      color: "#fff",
      border: "none",
    },
  };
}

export default PerfilUser;
