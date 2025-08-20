import React from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  Button,
} from "@mui/material";
import background from "../assets/background2.png";
import Grid from "@mui/material/Grid2";

function DetalhesProjeto() {
  const styles = Styles();

  return (
    <Container style={styles.container}>
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Typography style={styles.titulo}>Título do portifólio</Typography>

          <Card style={styles.cardPrincipal}>
            <Box style={styles.imagemPrincipal}>Imagem Principal</Box>
          </Card>

          <Grid container spacing={2} style={styles.gridMiniaturas}>
            {Array.from({ length: 4 }).map((_, index) => (
              <Grid key={index} size={{ xs: 6, sm: 3 }}>
                <Card style={styles.cardMini}>
                  <Box style={styles.boxMini}>Mini {index + 1}</Box>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Typography style={styles.tituloDesc}>Descrição:</Typography>
          <Typography style={styles.descricao}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Pellentesque vitae mollis velit. Phasellus imperdiet ex sed quam
            vestibulum, sed dignissim magna ornare. Curabitur maximus consequat
            aliquet. In mollis tellus sapien, ac ultricies neque euismod at.
            Suspendisse sagittis turpis eget facilisis pellentesque. In posuere
            lorem vel purus porttitor gravida. Orci varius natoque penatibus et
            magnis dis parturient montes, nascetur ridiculus mus. Vestibulum
            sodales facilisis nulla, ac rhoncus odio. Praesent condimentum augue
            velit, ut posuere sem tristique in. Nam ut blandit ante. Nam eget
            magna erat. Class aptent taciti sociosqu ad litora torquent per
            conubia nostra, per inceptos himenaeos. Curabitur aliquet interdum
            orci a venenatis. Vivamus id libero tempor, gravida metus in,
            iaculis lacus. Curabitur est est, rutrum non vestibulum nec,
            imperdiet non ligula. Vestibulum et sem a mauris fringilla luctus ac
            id eros. Ut volutpat rutrum odio, ac posuere leo malesuada
            convallis. Aenean suscipit felis neque, id mattis lacus scelerisque
            eu. Aenean sed commodo odio, sed molestie lorem. Curabitur non enim
            odio. Suspendisse potenti. Nam condimentum aliquam sem at pharetra.
            Quisque ultricies massa ligula, vel facilisis odio tempus quis.
            Proin quis orci in odio pretium varius. Aliquam erat volutpat.
            Mauris condimentum dolor a massa molestie, nec commodo nisi commodo.
            Mauris accumsan fermentum ultricies. Morbi tempor, turpis eu aliquet
            imperdiet, sapien nunc tristique nisi, quis lacinia sapien dolor sed
            nulla. Aenean sem turpis, sagittis non neque eget, aliquet egestas
            arcu.
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card style={styles.cardPerfil}>
            <Box style={styles.imgPerfil}></Box>
            <Avatar style={styles.avatar} />
            <CardContent>
              <Typography variant="h6" style={styles.nome}>
                Carlos
              </Typography>
              <Button variant="contained" style={styles.button}>
                Visualizar perfil
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

function Styles() {
  return {
    container: {
      marginTop: "80px",
    },
    titulo: {
      fontSize: "30px",
      fontWeight: "bold",
      marginBottom: "20px",
      marginTop: "20px",
    },
    tituloDesc: {
      marginTop: "40px",
      fontSize: "18px",
      fontWeight: "bold",
    },
    cardPrincipal: {
      height: "300px",
      marginTop: "20px",
      padding: "16px",
      display: "flex",
      justifyContent: "center",
    },
    imagemPrincipal: {
      width: "100%",
      height: "250px",
      borderRadius: "8px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    gridMiniaturas: {
      marginTop: "16px",
      marginBottom: "40px",
    },
    cardMini: {
      padding: "8px",
      display: "flex",
      justifyContent: "center",
    },
    boxMini: {
      width: "100%",
      height: "80px",
      borderRadius: "4px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    cardPerfil: {
      textAlign: "center",
      padding: "16px",
      marginTop: "85px",
    },
    imgPerfil: {
      width: "100%",
      height: "100px",
      backgroundColor: "#dcdcdc",
      backgroundImage: `url(${background})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      borderRadius: "8px",
      marginBottom: "-48px",
    },
    avatar: {
      width: "80px",
      height: "80px",
      margin: "0 auto",
      border: "3px solid white",
    },
    nome: {
      marginTop: "12px",
      fontWeight: "bold",
    },
    button: {
      marginTop: "16px",
      borderRadius: "20px",
      textTransform: "none",
    },
    descricao: {
      marginBottom: "30px",
    },
  };
}

export default DetalhesProjeto;
