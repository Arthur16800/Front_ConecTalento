import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import InstagramIcon from "@mui/icons-material/Instagram";
import LogoBranca from "../assets/logo_branca.png";

const Membros = [
  { name: "Arthur", url: "https://instagram.com/arthur.caramori" },
  { name: "Negrijo", url: "https://instagram.com/negrij0" },
  { name: "Bonini", url: "https://instagram.com/boninipedro_" },
  { name: "Rhuan", url: "https://instagram.com/rhuan" },
  { name: "Evelyn", url: "https://instagram.com/everissio" },
  { name: "João Alexandre", url: "https://instagram.com/jotta.slv4" },
  { name: "Vidal", url: "https://instagram.com/vidal" },
];

const Footer = () => {
  return (
    <Box
      sx={{
        position: "relative",
        color: "#fff",
        overflow: "hidden",
        background:
          "linear-gradient(180deg, #6A00B6 0%, #56039A 55%, #35045F 100%)",
        mt: "auto",
        pt: 5,
        pb: 10, // Espaço extra para a logo não sobrepor o texto
      }}
    >
      {/* Radial Background Effect */}
      <Box
        sx={{
          position: "absolute",
          inset: "-20%",
          background:
            "radial-gradient(50% 50% at 50% 50%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 65%)",
          zIndex: 0,
        }}
      />

      {/* Conteúdo do Footer */}
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          maxWidth: 1200,
          mx: "auto",
          py: { xs: 5, md: 7 },
          px: { xs: 2.5, sm: 3.5, md: 4 },
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1.2fr 2fr" },
          gap: 5,
          alignItems: "start",
        }}
      >
        {/* Contatos */}
        <Box>
          <Typography sx={{ fontWeight: 800, mb: 1 }}>Contatos:</Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, minmax(0,1fr))",
              },
              gap: 1,
            }}
          >
            {Membros.map((m) => (
              <Link
                key={m.name}
                href={m.url}
                target="_blank"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.75,
                  px: 1.2,
                  py: 0.65,
                  borderRadius: 999,
                  fontSize: 14,
                  color: "#fff",
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.16)",
                  backdropFilter: "blur(6px)",
                  transition: "transform .18s ease, background .18s ease",
                  "&:hover": {
                    background: "rgba(255,255,255,0.16)",
                  },
                }}
              >
                <InstagramIcon sx={{ fontSize: 18 }} />
                {m.name}
              </Link>
            ))}
          </Box>
        </Box>

        {/* Quem somos */}
        <Box sx={{ textAlign: "justify" }}>
          <Typography sx={{ fontWeight: 800, mb: 1 }}>Quem somos?</Typography>
          <Typography
            sx={{
              maxWidth: 720,
              fontSize: 16,
            }}
          >
            O ConecTalento é um sistema que interliga empresas e terceiros a
            produtores e designers. Com base em projetos previamente
            desenvolvidos, esses profissionais podem ser contratados por
            produtoras, facilitando a entrada de novos talentos no mercado de
            trabalho.
          </Typography>
        </Box>
      </Box>

      {/* Logo no canto inferior direito */}
      <Box
        sx={{
          position: "absolute",
          bottom: 24,
          right: 28,
          zIndex: 2,
        }}
      >
        <Box
          component="img"
          src={LogoBranca}
          alt="Logo ConecTalento"
          sx={{
            width: 100,
            height: "auto",
          }}
        />
      </Box>

      {/* Copyright */}
      <Typography
        sx={{
          textAlign: "center",
          mt: 4,
          fontSize: 14,
          zIndex: 1,
          position: "relative",
        }}
      >
        © 2025 ConecTalento — Todos os direitos reservados.
      </Typography>
    </Box>
  );
};

export default Footer;
