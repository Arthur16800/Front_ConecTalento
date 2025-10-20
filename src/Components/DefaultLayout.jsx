import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import Box from "@mui/material/Box";

const DefaultLayout = ({ children }) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100px"}}>
      <Header />

    
        {children}

      <Footer />
    </Box>
  );
};

export default DefaultLayout;