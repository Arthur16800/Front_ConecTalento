import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import InstagramIcon from "@mui/icons-material/Instagram";
import LogoBranca from "../assets/logo_branca.png";

const teamMembers = [
  { name: "Arthur", url: "https://instagram.com/arthurcaramori_" },
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
      component="footer"
      sx={{
        position: "relative", // necessário para ancorar a logo absoluta
        color: "#fff",
        overflow: "hidden",
        background:
          "linear-gradient(180deg, #6A00B6 0%, #56039A 55%, #35045F 100%)",
      }}
    >
      {/* brilho radial suave */}
      <Box
        sx={{
          position: "absolute",
          inset: "-30% -20% auto -20%",
          height: 420,
          background:
            "radial-gradient(50% 50% at 50% 50%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 65%)",
          filter: "blur(40px)",
          pointerEvents: "none",
        }}
      />

      {/* conteúdo principal */}
      <Box
        sx={{
          maxWidth: 1200,
          mx: "auto",
          py: { xs: 5, md: 7 },
          px: { xs: 2.5, sm: 3.5, md: 4 },
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1.2fr 2fr" },
          gap: { xs: 4, md: 6 },
          alignItems: "start",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Contatos */}
        <Box>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 800, letterSpacing: 0.3, mb: 1.5 }}
          >
            Contatos:
          </Typography>

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
            {teamMembers.map((m) => (
              <Link
                key={m.name}
                href={m.url}
                target="_blank"
                rel="noopener noreferrer"
                underline="none"
                aria-label={`Instagram de ${m.name}`}
                sx={{
                  display: "inline-flex",
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
                    transform: "translateY(-1px)",
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
        <Box sx={{ textAlign: { xs: "left", md: "justify" } }}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 800, letterSpacing: 0.3, mb: 1.5 }}
          >
            Quem somos?
          </Typography>
          <Typography
            sx={{
              maxWidth: 720,
              lineHeight: 1.7,
              fontSize: 15.5,
              opacity: 0.95,
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

      {/* logo menor no canto inferior direito */}
      <Box
        sx={{
          position: "absolute",
          bottom: { xs: 20, md: 24 }, // ajuste o offset vertical
          right: { xs: 16, md: 28 }, // ajuste o offset horizontal
          zIndex: 2,
          pointerEvents: "none",
        }}
      >
        <Box
          component="img"
          src={LogoBranca}
          alt="Logo ConecTalento"
          sx={{
            width: { xs: 68, sm: 80, md: 96 }, // tamanho menor
            height: "auto",
            filter: "drop-shadow(0 6px 18px rgba(0,0,0,0.35))",
            opacity: 0.98,
          }}
        />
      </Box>

      {/* linha e crédito */}
      <Box
        sx={{
          mt: { xs: 3, md: 4 },
          height: 1,
          bgcolor: "rgba(255,255,255,0.22)",
          maxWidth: 1200,
          mx: "auto",
          opacity: 0.6,
        }}
      />
      <Typography
        sx={{
          textAlign: "center",
          py: 2.2,
          fontSize: 12.5,
          opacity: 0.9,
          letterSpacing: 0.2,
        }}
      >
        © {new Date().getFullYear()} ConecTalento — Todos os direitos
        reservados.
      </Typography>
    </Box>
  );
};

export default Footer;
