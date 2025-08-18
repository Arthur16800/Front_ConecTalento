import { Box, Container, TextField, Typography } from "@mui/material";
import Button from "@mui/material/Button";

function CriarProjeto() {
  const styles = Styles();

  return (
    <>
      <Container maxWidth="sx">
        <Box style={styles.box_principal}>
          <Typography style={styles.font_Titulo}>Criar novo projeto</Typography>

          <Typography style={styles.label}>Adicionar imagens:</Typography>

          <Box>
            <Button variant="outlined" component="label">
              Files
              <input type="file" hidden multiple />
            </Button>
          </Box>

          <TextField
            required
            fullWidth
            margin="normal"
            label="Título"
            name="titulo"
            id="titulo"
            variant="outlined"
            style={styles.textfield}
            sx={{
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
            }}
          />

          <TextField
            required
            fullWidth
            margin="normal"
            label="Descrição"
            name="descricao"
            id="descricao"
            variant="outlined"
            style={styles.textfield}
            sx={{
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
            }}
          />

          <Button style={styles.button}>Criar</Button>
        </Box>
      </Container>
    </>
  );
}

function Styles() {
  return {
    box_principal: {
      marginTop: "10%",
      marginLeft: "3%",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
    },
    button: {
      backgroundColor: "#8500C2",
      color: "#fff",
      borderRadius: "5px",
      fontWeight: "bold",
      fontSize: "16px",
      textTransform: "none",
      marginTop: "20px",
      padding: "10px 30px",
    },
    font_Titulo: {
      fontWeight: "600",
      fontSize: "35px",
      marginBottom: "20px",
    },
    label: {
      fontWeight: "600",
      fontSize: "16px",
      marginBottom: "10px",
    },
    textfield: {
      width: "50%",
      backgroundColor: "#f0f0f0",
      borderRadius: 8,
      height: 55,
      paddingLeft: 15,
      paddingRight: 15,
    },
  };
}

export default CriarProjeto;
