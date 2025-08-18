import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import Grid from "@mui/material/Grid2"; // <- Grid v2
import Button from "@mui/material/Button";

function Home() {
  return (
    <>
      <Grid container spacing={1} sx={{ mb: 5 }}>
        {Array.from({ length: 50 }).map((_, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card
              sx={{
                mt: 5,
                borderRadius: 2,
                mx: 5,
                bgcolor: "#D9D9D9",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  width: "80%",
                  height: 120,
                  bgcolor: "white",
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 2,
                  mt: 2,
                }}
              >
                imagem
              </Box>

              <CardContent>
                <Typography variant="h6" color="#000">
                  titulo
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
}

export default Home;