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
import InstagramIcon from "@mui/icons-material/Instagram";
import EmailIcon from "@mui/icons-material/Email";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

function Portfolio() {
  const styles = Styles();
  const projects = [
    { id: 1, title: "design sapato" },
    { id: 2, title: "design sapato" },
    { id: 3, title: "design sapato" },
  ];

  return (
    <Box style={styles.container}>
      <Box style={styles.box_user}>
        <AccountCircleIcon sx={styles.accountIcon} />
        <Typography style={styles.userName}>TESTE NAME USER</Typography>

        <Typography style={styles.bio}>
          Biografia: Lorem Ipsum is simply dummy text of the printing and
          typesetting industry. Lorem Ipsum has been the industry's standard
          dummy text ever since the 1500s, when an unknown printer took a galley
          of type and scrambled it to make a type specimen book. It has survived
          not only five centuries, but also the leap into electronic
          typesetting, remaining essentially unchanged. It was popularised in
          the 1960s with the release of Letraset sheets containing Lorem Ipsum
          passages, and more recently with desktop publishing software like
          Aldus PageMaker including versions of Lorem Ipsum.
        </Typography>

        <Box style={styles.box_contatos}>
          <Box style={styles.contato}>
            <InstagramIcon />
            <Typography>teste</Typography>
          </Box>
          <Box style={styles.contato}>
            <EmailIcon />
            <Typography>teste02</Typography>
          </Box>
        </Box>
      </Box>

      <Box style={styles.divider} />

      <Box style={styles.box_projeto}>
        <Box style={styles.grid}>
          {projects.map((p) => (
            <Box key={p.id} style={styles.card}>
              <Box
                style={{
                  ...styles.preview,
                  backgroundImage: `url(${background2})`,
                }}
              >
                <Box style={styles.likeBtn}>
                  <FavoriteBorderIcon fontSize="small" />
                </Box>
              </Box>
              <Typography style={styles.caption}>{p.title}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

function Styles() {
  return {
    container: {
      display: "flex",
      justifyContent: "space-between",
      gap: 32,
      padding: "24px 16px",
      width: "90%",
      margin: "0 auto",
      alignItems: "flex-start",

    },
    accountIcon: {
      color: "#E5E5E5",
      fontSize: 250,
    },
    box_user: {
      padding: 10,
      maxWidth: 500,
      minWidth: 100,
      flex: 1,
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 10,
    },
    userName: {
      fontWeight: 600,
      fontSize: 18,
      marginTop: 8,
    },
    bio: {
      maxWidth: 560,
      lineHeight: 1.6,
      fontSize: 16,
      textAlign: "left",
      marginTop: 8,
    },
    box_contatos: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      gap: 6,
      marginTop: 8,
    },
    contato: {
      display: "flex",
      alignItems: "center",
      gap: 8,
    },
    divider: {
      width: 1,
      background: "#D9D9D9",
      height: 560,
      alignSelf: "center",
    },
    box_projeto: {
      flex: 1,
      width: "100%",
      padding: "0 0 24px 0",
      display: "flex",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(2, minmax(280px, 1fr))",
      gap: 24,
      width: "100%",
      justifyItems: "center",
    },
    card: {
      width: "100%",
      maxWidth: 360,
      background: "#F0F0F0",
      borderRadius: 8,
      padding: 0,
      overflow: "hidden",
    },
    preview: {
      position: "relative",
      width: "100%",
      paddingTop: "56.25%", // 16:9
      backgroundSize: "cover",
      backgroundPosition: "center",
    },
    likeBtn: {
      position: "absolute",
      top: 8,
      right: 8,
      width: 36,
      height: 36,
      borderRadius: "50%",
      background: "#FFF",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 1px 6px rgba(0,0,0,0.15)",
    },
    caption: {
      textAlign: "center",
      padding: "10px 12px 14px",
      fontSize: 14,
    },
  };
}

export default Portfolio;
