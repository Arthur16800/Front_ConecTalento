import React from "react";
import { Modal, Box } from "@mui/material";
import logo from "../assets/logo_ct.png";

function Styles() {
  return {
    modalStyle: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      maxWidth: 400,
      maxHeight: 300,
      minWidth: 200,
      bgcolor: "background.paper",
      borderRadius: 2,
      boxShadow: 24,
      p: 4,
      overflow: "hidden",
    },
    logo: {
      position: "absolute",
      top: 8,
      left: 8,
      width: 45,
    },
  };
}

const ModalBase = ({ open, onClose, children }) => {
  const styles = Styles();
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={styles.modalStyle}>
        <img src={logo} alt="Logo" style={styles.logo} />
        {children}
      </Box>
    </Modal>
  );
};

export default ModalBase;