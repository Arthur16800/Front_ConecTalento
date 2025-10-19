import * as React from "react";
import { useState, useEffect } from "react";
import { Box, Typography, Button, GlobalStyles } from "@mui/material";
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

  // Remove TODAS as chaves pix do localStorage
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

  // Se a rota mudar e não vier state, recarrega do localStorage do novo id
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

  // Polling do status do pagamento
  useEffect(() => {
    // Só inicia se houver formData válido e o payment_id corresponder à rota
    if (!formData || String(formData.payment_id) !== String(id)) return;
    // Se já está aprovado, não precisa pollar
    if (formData.status === "approved") return;

    let isPollingCancelled = false;

    async function fetchPaymentStatus() {
      // Guarda adicional, evita chamadas desnecessárias
      if (!formData?.payment_id) return;
      try {
        const response = await api.getPaymentPixStatus(id_user, formData.payment_id);
        const status = response?.data?.status;
        if (!isPollingCancelled && status && status !== formData.status) {
          // Evita espalhar null
          setFormData((prev) => (prev ? { ...prev, status } : prev));
        }
      } catch (error) {
        console.error("Erro ao consultar status do pagamento:", error);
        alert(error?.response?.data?.error);
      }
    }

    // Dispara imediatamente uma vez
    fetchPaymentStatus();

    // E mantém o polling a cada 3s
    const pollingTimerId = setInterval(() => {
      setTick((t) => t + 1);
      fetchPaymentStatus();
    }, 3000);

    // Cleanup
    return () => {
      isPollingCancelled = true;
      clearInterval(pollingTimerId);
    };
  }, [id, formData?.payment_id, formData?.status, id_user]);

  // Quando aprovar, remove TODAS as chaves pix:* do localStorage
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
      await navigator.clipboard.writeText(formData.qr_code || "");
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
        <Box>
          <Typography style={styles.title}>
            Pagamento aprovado! Obrigado por apoiar o Conectalento.
          </Typography>
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

          {formData.amount && <Typography style={styles.code}>Valor: {formData.amount}</Typography>}



          {formData.qr_code && <Typography style={styles.code}>{formData.qr_code}</Typography>}

          <Button variant="contained" onClick={handleCopy} style={styles.copyBtn} disableElevation>
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
  };
}

export default Pagamento;
