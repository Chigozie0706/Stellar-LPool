import React from "react";
import { Container, Typography, Box } from "@mui/material";
import DeFiApp from "./components/DeFiApp";

function App() {
  return (
    <Container>
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Stellar Liquidity Pool
        </Typography>
        <DeFiApp />
      </Box>
    </Container>
  );
}
export default App;
