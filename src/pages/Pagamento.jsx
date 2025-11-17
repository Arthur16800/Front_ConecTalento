import * as React from "react";
import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
  Snackbar,
  Alert,
} from "@mui/material";
import { useLocation, useParams } from "react-router-dom";
import NotFound from "./NotFound";
import ModalBase from "../Components/ModalBase";
import api from "../axios/axios";

function Pagamento() {
  const { id } = useParams();
  const { state } = useLocation();
  const [copied, setCopied] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const id_user = localStorage.getItem("id_usuario");
  const [tick, setTick] = useState(0);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  const handleCloseSnackbar = (_, reason) => {
    if (reason === "clickaway") return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const [formData, setFormData] = useState(() => {
    if (state) return state;
    try {
      const cached = localStorage.getItem(`pix:${id}`);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });

  const removeAllPixCache = () => {
    const keysToDelete = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("pix:")) {
        keysToDelete.push(key);
      }
    }
    keysToDelete.forEach((k) => localStorage.removeItem(k));
  };

  useEffect(() => {
    if (state) return;
    try {
      const cached = localStorage.getItem(`pix:${id}`);
      setFormData(cached ? JSON.parse(cached) : null);
    } catch {
      setFormData(null);
    }
  }, [id, state]);

  useEffect(() => {
    setOpenModal(true);
  }, [id]);

  useEffect(() => {
    if (formData?.payment_id) {
      localStorage.setItem(
        `pix:${formData.payment_id}`,
        JSON.stringify(formData)
      );
    }
  }, [formData]);

  useEffect(() => {
    if (!formData || String(formData.payment_id) !== String(id)) return;
    if (formData.status === "approved") return;

    let isPollingCancelled = false;

    async function fetchPaymentStatus() {
      if (!formData?.payment_id) return;
      try {
        const response = await api.getPaymentPixStatus(
          id_user,
          formData.payment_id
        );
        const status = response?.data?.status;
        if (!isPollingCancelled && status && status !== formData.status) {
          setFormData((prev) => (prev ? { ...prev, status } : prev));
        }
      } catch (error) {
        console.error("Erro ao consultar status do pagamento:", error);
        setSnackbar({
          open: true,
          message:
            error?.response?.data?.error ||
            "Erro ao consultar status do pagamento.",
          severity: "error",
        });
      }
    }

    fetchPaymentStatus();
    const pollingTimerId = setInterval(() => {
      setTick((t) => t + 1);
      fetchPaymentStatus();
    }, 3000);

    return () => {
      isPollingCancelled = true;
      clearInterval(pollingTimerId);
    };
  }, [id, formData?.payment_id, formData?.status, id_user]);

  useEffect(() => {
    if (formData?.status !== "approved") return;
    removeAllPixCache();
  }, [formData?.status]);

  if (!formData || String(formData.payment_id) !== String(id)) {
    return <NotFound />;
  }

  const theme = useTheme();
  const downSm = useMediaQuery(theme.breakpoints.down("sm"));
  const downMd = useMediaQuery(theme.breakpoints.down("md"));
  const upMd = useMediaQuery(theme.breakpoints.up("md"));

  const styles = Styles({ downSm, downMd, upMd });

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(formData.qr_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  return (
    <>
      <ModalBase open={openModal} onClose={() => setOpenModal(false)}>
        <Box style={styles.modalWrapper}>
          <Typography style={styles.modalTitle}>Plano Premium</Typography>
          <ul style={styles.modalList}>
            <li>• Crie até 20 projetos sem se preocupar com limites.</li>
            <li>• Amplie o uso de imagens em cada um de seus projetos</li>
            <li>• Mais liberdade para testar, errar e evoluir suas ideias.</li>
            <li>• Um único investimento para uso vitalício</li>
          </ul>
          <Button
            variant="contained"
            onClick={() => setOpenModal(false)}
            style={styles.modalCta}
            disableElevation
            fullWidth={downSm}
          >
            Quero fazer parte
          </Button>
        </Box>
      </ModalBase>

      {formData.status === "approved" ? (
        <Box sx={styles.successWrapper}>
          <Box sx={styles.successCard}>
            <Box sx={styles.checkCircle}>
              <Typography sx={styles.checkIcon}>✓</Typography>
            </Box>
            <Typography sx={styles.successTitle}>
              Pagamento aprovado
            </Typography>
            <Typography sx={styles.successSubtitle}>
              Seu plano <strong>Premium</strong> está ativo. <br />
              Obrigado por apoiar o <strong>Conectalento</strong>!
            </Typography>
            <Button
              variant="contained"
              sx={styles.successBtn}
              onClick={() => (window.location.href = "/")}
              fullWidth={downSm}
            >
              Ir para o início
            </Button>
          </Box>
        </Box>
      ) : (
        <Box style={styles.container}>
          <Typography style={styles.title}>
            Realize o pagamento via QR CODE ou copie a chave pix
          </Typography>

          {formData.qr_code_base64 && (
            <img
              style={styles.qr}
              src={`data:image/png;base64,${formData.qr_code_base64}`}
              alt="QR Code PIX"
            />
          )}

          {formData.amount && (
            <Typography style={styles.code}>Valor: {formData.amount}</Typography>
          )}

          {formData.qr_code && (
            <Typography style={styles.code}>{formData.qr_code}</Typography>
          )}

          <Button
            variant="contained"
            onClick={handleCopy}
            style={styles.copyBtn}
            disableElevation
            fullWidth={downSm}
          >
            {copied ? "Copiado" : "Copiar"}
          </Button>
        </Box>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

function Styles({ downSm, downMd, upMd }) {
  return {
    container: {
      width: "100%",
      maxWidth: "min(92vw, 680px)",
      margin: "0 auto",
      borderRadius: 12,
      padding: "clamp(16px, 4vw, 32px) clamp(12px, 3vw, 24px)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "clamp(12px, 2.5vw, 18px)",
      background: "#fff",
      boxSizing: "border-box",
    },
    title: {
      fontWeight: 700,
      textDecoration: "underline",
      color: "#1a1a1a",
      textAlign: "center",
      marginBottom: 8,
      fontSize: "clamp(18px, 2.6vw, 22px)",
      lineHeight: 1.25,
    },
    qr: {
      width: "clamp(160px, 36vw, 260px)",
      height: "clamp(160px, 36vw, 260px)",
      imageRendering: "crisp-edges",
    },
    code: {
      maxWidth: "min(92vw, 520px)",
      textAlign: "center",
      wordBreak: "break-word",
      overflowWrap: "anywhere",
      fontFamily: "monospace",
      fontSize: "clamp(12px, 1.6vw, 14px)",
      color: "#1a1a1a",
      marginTop: 8,
    },
    copyBtn: {
      marginTop: 6,
      background: "#7A2CF6",
      textTransform: "none",
      fontWeight: 700,
      borderRadius: 8,
      padding: "clamp(10px, 1.2vw, 12px) clamp(16px, 3vw, 28px)",
      width: "min(92vw, 380px)",
    },
    modalWrapper: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      gap: "clamp(12px, 2.2vw, 18px)",
      width: "100%",
      maxWidth: "100%",
      boxSizing: "border-box",
      paddingTop: 8,
      paddingBottom: 8,
      overflowY: "auto",
    },
    modalTitle: {
      fontSize: "clamp(20px, 2.8vw, 22px)",
      fontWeight: 700,
      color: "#1a1a1a",
    },
    modalList: {
      margin: 0,
      padding: 0,
      listStyle: "none",
      color: "#333",
      lineHeight: 1.7,
      fontSize: "clamp(14px, 1.8vw, 16px)",
      textAlign: "left",
      width: "100%",
    },
    modalCta: {
      marginTop: 6,
      background: "#7A2CF6",
      textTransform: "none",
      fontWeight: 700,
      borderRadius: 9999,
      padding: "clamp(10px, 1.2vw, 12px) clamp(16px, 2.4vw, 18px)",
      width: downSm ? "100%" : "min(92vw, 360px)",
    },
    successWrapper: {
      width: "80%",
      minHeight: "60vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      margin: "clamp(12px, 3vh, 20px) auto clamp(24px, 4vh, 40px)",
      paddingLeft: "max(env(safe-area-inset-left), 12px)",
      paddingRight: "max(env(safe-area-inset-right), 12px)",
    },
    successCard: {
      background: "#fff",
      borderRadius: 20,
      padding: "clamp(28px, 5vw, 48px) clamp(20px, 4vw, 32px)",
      width: "min(80vw, 520px)",
      textAlign: "center",
      boxShadow: "0 12px 32px rgba(122, 44, 246, 0.2)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "clamp(6px, 1.2vw, 10px)",
    },
    checkCircle: {
      width: "clamp(64px, 9vw, 80px)",
      height: "clamp(64px, 9vw, 80px)",
      borderRadius: "50%",
      background: "linear-gradient(to right, #7A2CF6, #9D4EDD)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    checkIcon: {
      fontSize: "clamp(32px, 5vw, 40px)",
      color: "#fff",
      fontWeight: 700,
    },
    successTitle: {
      fontSize: "clamp(22px, 3vw, 26px)",
      fontWeight: 700,
      fontFamily: "Montserrat, sans-serif",
      color: "#1a1a1a",
    },
    successSubtitle: {
      fontSize: "clamp(14px, 2vw, 16px)",
      lineHeight: 1.6,
      color: "#555",
      fontFamily: "Montserrat, sans-serif",
    },
    successBtn: {
      background: "#7A2CF6",
      color: "#fff",
      fontWeight: 600,
      textTransform: "none",
      borderRadius: 8,
      padding: "clamp(10px, 1.2vw, 12px) clamp(20px, 2vw, 24px)",
      boxShadow: "0 4px 12px rgba(122, 44, 246, 0.3)",
      width: "min(75vw, 420px)",
    },
  };
}

export default Pagamento;
