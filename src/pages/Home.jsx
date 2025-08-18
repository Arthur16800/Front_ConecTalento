import React from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import Button from "@mui/material/Button";

function Home() {
  return (
    <>
      <Grid container spacing={1} mb={5}>
        {Array.from({ length: 50 }).map((_, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                marginTop: 5,
                borderRadius: 2,
                marginLeft: 5,
                marginRight: 5,
                backgroundColor: "#D9D9D9",
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
                  backgroundColor: "white",
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center", 
                  justifyContent: "center",
                  mb: 2, 
                  mt: 2
                }}
              >
                imagem
              </Box>

              <CardContent>
                <Typography variant="h6" color="#000000">
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
