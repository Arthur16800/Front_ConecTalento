import * as React from "react";
import { useState } from "react";
import { Box, Typography, Snackbar, Alert, CircularProgress } from "@mui/material";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import api from "../axios/axios";
import { useNavigate } from "react-router-dom";

function BottonUpgrade() {
  const [hover, setHover] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ open: false, severity: "", message: "" });

  const navigate = useNavigate();
  const styles = Styles();
  const id_user = localStorage.getItem("id_usuario");
  const [formData, setFormData] = useState({
    email: "",
    qr_code: "",
    qr_code_base64: "",
    payment_id: "",
    status: "",
    amount: "",
  });

  const showAlert = (severity, message) => setAlert({ open: true, severity, message });
  const handleCloseAlert = () => setAlert((prev) => ({ ...prev, open: false }));

  async function CreatePix() {
    if (loading) return;
    setLoading(true);

    async function getUserById() {
      try {
        const response = await api.getUserById(id_user);
        const email = response.data.profile.email;
        setFormData((prev) => ({ ...prev, email }));
        return email;
      } catch (error) {
        console.error("Erro ao criar o pix:", error);
        showAlert("error", error?.response?.data?.error || "Erro ao criar o pix");
        setLoading(false);
        return null;
      }
    }

    const email = await getUserById();
    if (!email) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.paymentUserPix(id_user, email);

      const nextData = {
        email,
        qr_code: response.data.qr_code,
        qr_code_base64: response.data.qr_code_base64,
        payment_id: response.data.payment_id,
        status: response.data.status,
        amount: response.data.amount,
      };

      setFormData((prev) => ({ ...prev, ...nextData }));

      // persistir por payment_id
      localStorage.setItem(`pix:${nextData.payment_id}`, JSON.stringify(nextData));

      showAlert("success", "PIX gerado com sucesso!");
      setLoading(false);
      navigate(`/pagamento/${nextData.payment_id}`, { state: nextData });
    } catch (error) {
      console.error("Erro ao criar pix:", error);
      showAlert("error", error?.response?.data?.error || "Erro ao criar PIX");
      setLoading(false);
    }
  }

  return (
    <Box style={styles.mainBox}>
      <style>{`
        @media screen and (max-width: 400px) {
          .ct-upgrade-text { 
            display: none !important;
          }
          .ct-upgrade-chip {
            padding: 8px !important;
            gap: 0 !important;
            max-width: 48px !important;
          }
          .ct-upgrade-icon {
            font-size: 26px !important;
          }
        }
      `}</style>

      {/* Alerts bonitos (Snackbar + Alert) */}
      <Snackbar
        open={alert.open}
        autoHideDuration={3000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseAlert} severity={alert.severity} sx={{ width: "100%" }}>
          {alert.message}
        </Alert>
      </Snackbar>

      <Box
        style={hover ? { ...styles.container, ...styles.containerHover } : styles.container}
        onMouseOver={() => setHover(true)}
        onMouseOut={() => setHover(false)}
        onClick={loading ? undefined : CreatePix}
        className="ct-upgrade-chip"
        role="button"
        aria-busy={loading ? "true" : "false"}
        aria-label="Fazer upgrade"
      >
        <Typography style={styles.text} className="ct-upgrade-text">
          Faça um upgrade
        </Typography>

        {/* Loading substitui o ícone. 
            Em telas grandes, o texto permanece e só o ícone vira spinner.
            Em telas pequenas, como o texto some via CSS, o spinner ocupa o lugar do ícone. */}
        {loading ? (
          <CircularProgress size={26} color="inherit" className="ct-upgrade-icon" />
        ) : (
          <StarBorderIcon style={styles.starIcon} className="ct-upgrade-icon" />
        )}
      </Box>
    </Box>
  );
}

function Styles() {
  return {
    mainBox: {
      display: "flex",
      width: "100%",
      justifyContent: "flex-end",
      alignItems: "center",
    },
    container: {
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      padding: "10px 15px",
      borderRadius: 9999,
      background: "#7A2CF6",
      color: "#e0e0e0",
      cursor: "pointer",
      userSelect: "none",
      transition:
        "background-color 150ms ease, box-shadow 150ms ease, transform 150ms ease",
      textDecoration: "none",
      maxWidth: 180,
    },
    containerHover: {
      background: "#6A22F0",
      boxShadow: "0 6px 16px rgba(122, 44, 246, 0.35)",
      transform: "translateY(-1px)",
    },
    text: { fontWeight: 700, letterSpacing: 0.2 },
    starIcon: { fontSize: 30 },
  };
}

export default BottonUpgrade;
