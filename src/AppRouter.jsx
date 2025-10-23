// src/AppRouter.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box, Container } from "@mui/material";
import Dashboard from "./pages/Dashboard";
import App from "./App"; // Keep your main App dashboard for now

export default function AppRouter() {
  return (
    <BrowserRouter>
      <AppBar position="static" sx={{ backgroundColor: "#0d47a1" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Futures Portal
          </Typography>

          <Button color="inherit" component={Link} to="/">
            Overview
          </Button>
          <Button color="inherit" component={Link} to="/dashboard">
            Dashboard
          </Button>
          <Button color="inherit" component={Link} to="/signals">
            Signals
          </Button>
          <Button color="inherit" component={Link} to="/settings">
            Settings
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 5 }}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/signals"
            element={
              <Box textAlign="center">
                <Typography variant="h5" sx={{ mt: 5 }}>
                  Signals page coming soon...
                </Typography>
              </Box>
            }
          />
          <Route
            path="/settings"
            element={
              <Box textAlign="center">
                <Typography variant="h5" sx={{ mt: 5 }}>
                  Settings page coming soon...
                </Typography>
              </Box>
            }
          />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}