import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import { APP_CONFIG } from '../constants/appConfig';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        background: '#FFFFFF !important',  // Pure white background - force override
        backgroundColor: '#FFFFFF !important',  // Ensure solid white
        backgroundImage: 'none !important',  // Remove any background images
        borderTop: `3px solid ${APP_CONFIG.THEME.SCHNEIDER_GREEN}`,  // Green top border
        py: 1.5,
        mt: 'auto',
        boxShadow: 'none !important',  // Remove all shadows
        zIndex: 10,  // Ensure footer is above background gradient
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(26, 26, 26, 0.6)',  // Dark gray text on white
              fontWeight: 500,
              fontSize: '12px',
            }}
          >
            © {new Date().getFullYear()} Schneider Electric. All rights reserved.
          </Typography>

          <Box sx={{ display: 'flex', gap: 3 }}>
            <Typography
              variant="body2"
              sx={{
                color: 'rgba(26, 26, 26, 0.7)',  // Dark text on white
                fontWeight: 600,
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'color 0.3s ease',
                '&:hover': {
                  color: APP_CONFIG.THEME.PRIMARY_GREEN,
                },
              }}
            >
              Privacy Policy
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'rgba(26, 26, 26, 0.7)',  // Dark text on white
                fontWeight: 600,
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'color 0.3s ease',
                '&:hover': {
                  color: APP_CONFIG.THEME.PRIMARY_GREEN,
                },
              }}
            >
              Terms of Service
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'rgba(26, 26, 26, 0.7)',  // Dark text on white
                fontWeight: 600,
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'color 0.3s ease',
                '&:hover': {
                  color: APP_CONFIG.THEME.PRIMARY_GREEN,
                },
              }}
            >
              Contact Us
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
