// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import AppRouter from "./AppRouter";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1565c0" },
    secondary: { main: "#ff9800" },
    background: { default: "#f4f6f8" },
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', sans-serif",
    button: { textTransform: "none" },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppRouter />
    </ThemeProvider>
  </React.StrictMode>
);