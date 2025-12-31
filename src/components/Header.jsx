import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';
import { APP_CONFIG } from '../constants/appConfig';

const Header = () => {
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        background: '#FFFFFF !important',  // Pure white background - force override
        backgroundColor: '#FFFFFF !important',  // Ensure solid white
        backgroundImage: 'none !important',  // Remove any background images
        borderBottom: `3px solid ${APP_CONFIG.THEME.SCHNEIDER_GREEN}`,  // Green bottom border
        py: 1,
        boxShadow: 'none !important',  // Remove all shadows
        zIndex: 10,  // Ensure header is above background gradient
      }}
    >
      <Toolbar sx={{ minHeight: '48px !important', px: 4, justifyContent: 'space-between' }}>
        {/* Left side - Title and subtitle */}
        <Box>
          <Typography
            variant="h5"
            component="div"
            sx={{
              fontWeight: 700,
              color: '#1A1A1A',  // Dark text on white background
              letterSpacing: '0.5px',
              mb: 0.2,
              fontSize: '1.4rem',
            }}
          >
            Eco Bench
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(26, 26, 26, 0.6)',  // Dark gray text
              fontSize: '11px',
              fontWeight: 400,
            }}
          >
            Sustainable Test Bench Management | AI-powered insights
          </Typography>
        </Box>

        {/* Right side - LIVE indicator */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <motion.div
            animate={{
              opacity: [1, 0.4, 1],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: APP_CONFIG.THEME.SCHNEIDER_GREEN,  // Schneider green
                boxShadow: `0 0 10px ${APP_CONFIG.THEME.SCHNEIDER_GREEN}`,
              }}
            />
          </motion.div>
          <Typography
            variant="body2"
            sx={{
              color: APP_CONFIG.THEME.SCHNEIDER_GREEN,  // Schneider green
              fontWeight: 700,
              fontSize: '14px',
              letterSpacing: '1px',
            }}
          >
            LIVE
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
