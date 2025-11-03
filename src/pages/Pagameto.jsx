import * as React from "react";
import { useState, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
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
      localStorage.setItem(`pix:${formData.payment_id}`, JSON.stringify(formData));
    }
  }, [formData]);

  useEffect(() => {
    if (!formData || String(formData.payment_id) !== String(id)) return;
    if (formData.status === "approved") return;

    let isPollingCancelled = false;

    async function fetchPaymentStatus() {
      if (!formData?.payment_id) return;
      try {
        const response = await api.getPaymentPixStatus(id_user, formData.payment_id);
        const status = response?.data?.status;
        if (!isPollingCancelled && status && status !== formData.status) {
          setFormData((prev) => (prev ? { ...prev, status } : prev));
        }
      } catch (error) {
        console.error("Erro ao consultar status do pagamento:", error);
        alert(error?.response?.data?.error);
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

  const styles = Styles();

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
          >
            {copied ? "Copiado" : "Copiar"}
          </Button>
        </Box>
      )}
    </>
  );
}

function Styles() {
  return {
    container: {
      width: "100%",
      borderRadius: 12,
      padding: "32px 24px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 18,
      background: "#fff",
    },
    title: {
      fontWeight: 700,
      textDecoration: "underline",
      color: "#1a1a1a",
      textAlign: "center",
      marginBottom: 8,
    },
    qr: {
      width: 220,
      height: 220,
      imageRendering: "crisp-edges",
    },
    code: {
      maxWidth: 520,
      textAlign: "center",
      wordBreak: "break-all",
      fontFamily: "monospace",
      fontSize: 14,
      color: "#1a1a1a",
      marginTop: 8,
    },
    copyBtn: {
      marginTop: 6,
      background: "#7A2CF6",
      textTransform: "none",
      fontWeight: 700,
      borderRadius: 8,
      padding: "8px 28px",
    },
    modalWrapper: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
      gap: 18,
      paddingTop: 16,
    },
    modalTitle: {
      fontSize: 22,
      fontWeight: 700,
      color: "#1a1a1a",
    },
    modalList: {
      margin: 0,
      padding: 0,
      listStyle: "none",
      color: "#333",
      lineHeight: 1.8,
    },
    modalCta: {
      marginTop: 6,
      background: "#7A2CF6",
      textTransform: "none",
      fontWeight: 700,
      borderRadius: 9999,
      padding: "10px 18px",
    },
    successWrapper: {
      width: "100%",
      minHeight: "60vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginBottom:"40px",
      marginTop:"20px"
    },
    successCard: {
      background: "#fff",
      borderRadius: 20,
      padding: "48px 32px",
      maxWidth: 480,
      width: "30%",
      textAlign: "center",
      boxShadow: "0 12px 32px rgba(122, 44, 246, 0.2)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 7,
    },
        checkCircle: {
      width: 80,
      height: 80,
      borderRadius: "50%",
      background: "linear-gradient(to right, #7A2CF6, #9D4EDD)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      animation: "scaleUp 0.6s ease",
    },
    checkIcon: {
      fontSize: 40,
      color: "#fff",
      fontWeight: 700,
    },
    successTitle: {
      fontSize: 26,
      fontWeight: 700,
      fontFamily: "Montserrat, sans-serif",
      color: "#1a1a1a",
    },
    successSubtitle: {
      fontSize: 16,
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
      padding: "10px 24px",
      boxShadow: "0 4px 12px rgba(122, 44, 246, 0.3)",
      "&:hover": {
        background: "#6920e6",
      },
    },
  };
}

export default Pagamento;