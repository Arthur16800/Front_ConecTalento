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

function Portfolio() {
  const styles = Styles();
  return (
    <Box style={styles.container}>
      <Typography>teste</Typography>
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
      backgroundColor: "black",
    },
  };
}

export default Portfolio;
