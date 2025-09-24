import * as React from "react";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import background2 from "../assets/background2.png";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import ModalBase from "../Components/ModalBase";
import { Alert, Snackbar } from "@mui/material";
import api from "../axios/axios";

function PerfilUser() {
  const styles = Styles();

  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    username:"",
    email: "",
    bio: "",
  });

  const [alert, setAlert] = useState({
    open: false,
    severity: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const showAlert = (severity, message) => {
    setAlert({ open: true, severity, message });
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  const handleEditClick = () => {
    setEditing(true);
  };

  const handleSaveClick = () => {
    // keep editing state until update completes successfully
    updateUser();
  };

  async function updateUser() {
    setLoading(true);
    await api.updateUser(formData).then(
      (response) => {
        showAlert("success", response.data.message);
        setEditing(false);
        setLoading(false);
      },
      (error) => {
        showAlert("error", error.response?.data?.error || "Erro ao atualizar");
        setLoading(false);
      }
    );
  }

  return (
    <Box style={styles.container}>
      <Snackbar
        open={alert.open}
        autoHideDuration={3000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity={alert.severity}
          sx={{ width: "100%" }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
      <Box style={styles.leftCard}>
        <Box style={styles.box_IMG} />
        <Box style={styles.user_perfil}>
          <AccountCircleIcon style={styles.accountIcon} />
          <span style={styles.user_name}>Claudio Ramos</span>
          <KeyboardArrowDownIcon style={styles.arrowIcon} />
          <RemoveCircleIcon style={styles.removeIcon} />
        </Box>

        {!editing && (
          <Button style={styles.editBtn} onClick={handleEditClick}>
            Editar Perfil
          </Button>
        ) }
      </Box>

      <Box style={styles.formPanel}>
        <Typography style={styles.formTitle}>Perfil do Usuário</Typography>

        <TextField
          required
          fullWidth
          margin="normal"
          label="Nome"
          variant="outlined"
          name="name"
          value={formData.nome}
          onChange={handleInputChange}
          disabled={!editing}
          style={styles.camposForm}
        />

        <TextField
          required
          fullWidth
          margin="normal"
          label="Username"
          variant="outlined"
          name="username"
          value={formData.nome}
          onChange={handleInputChange}
          disabled={!editing}
          style={styles.camposForm}
        />

        <TextField
          required
          fullWidth
          margin="normal"
          label="E-mail"
          type="email"
          variant="outlined"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          disabled={!editing}
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
          name="bio"
          value={formData.bio}
          onChange={handleInputChange}
          disabled={!editing}
          style={styles.camposForm}
        />

        {editing && (
          <Button style={styles.saveBtn} onClick={handleSaveClick} disabled={loading}>
            {loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Salvar"
            )}
          </Button>
        )}
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
      flex: 2,
      width: "100%",
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
      color: "#CFCFCF",
      fontSize: 32,
    },
    arrowIcon: {
      marginLeft: -4,
    },
    removeIcon: {
      color: "#FF4B4B",
      cursor: "pointer",
    },
    user_name: {
      flexGrow: 1,
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
      width: "90%",
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