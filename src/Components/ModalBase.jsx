import React from "react";
import { Modal, Box } from "@mui/material";
import logo from "../assets/logo_ct.png";
import { b } from "framer-motion/client";

function Styles() {
  return {
    modalStyle: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: 400,
      height: 300,
      bgcolor: "background.paper",
      borderRadius: 2,
      boxShadow: 24,
      p: 4,
      overflow: "hidden",
    },
    logo: {
      width: 45,
    },
    boxIMG: {
      width: "100%",
    }
  };
}

const ModalBase = ({ open, onClose, children }) => {
  const styles = Styles();
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={styles.modalStyle}>
        <Box sx={styles.boxIMG}>
          <img src={logo} alt="Logo" style={styles.logo} />
        </Box>
        {children}
      </Box>
    </Modal>
  );
};

export default ModalBase;
