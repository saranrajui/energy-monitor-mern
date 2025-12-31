import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Header from './components/Header';
import Footer from './components/Footer';
import Dashboard from './components/Dashboard';
import TestBenchDetail from './components/TestBenchDetail';
import { APP_CONFIG } from './constants/appConfig';

// Create custom dark theme based on Schneider Electric colors
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: APP_CONFIG.THEME.PRIMARY_GREEN,
      dark: APP_CONFIG.THEME.DARK_GREEN,
    },
    secondary: {
      main: APP_CONFIG.THEME.STATUS_AI_INSIGHT,
    },
    background: {
      default: APP_CONFIG.THEME.BG_DARK_PRIMARY,
      paper: APP_CONFIG.THEME.BG_DARK_SECONDARY,
    },
    text: {
      primary: APP_CONFIG.THEME.TEXT_PRIMARY,
      secondary: APP_CONFIG.THEME.TEXT_SECONDARY,
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            background: APP_CONFIG.THEME.BG_GRADIENT_MAIN,
          }}
        >
          <Header />

          <Box
            component="main"
            sx={{
              flexGrow: 1,
              py: 0,
            }}
          >
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/testbench/:id" element={<TestBenchDetail />} />
            </Routes>
          </Box>

          <Footer />
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
