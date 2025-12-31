import React from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  Warning,
  Cancel,
  Psychology,
  Devices,
} from '@mui/icons-material';
import { APP_CONFIG } from '../constants/appConfig';
import { useNavigate } from 'react-router-dom';

const TestBenchWidget = ({ testBench }) => {
  const navigate = useNavigate();
  const { deviceStatus, aiInsightsAvailable, aiInsightCount } = testBench;

  const handleClick = () => {
    navigate(`/testbench/${testBench.id}`);
  };

  return (
    <motion.div
      whileHover={{
        scale: APP_CONFIG.ANIMATION.HOVER_ZOOM ? 1.05 : 1,
        transition: { duration: 0.3 },
      }}
      whileTap={{ scale: 0.98 }}
    >
      <Card
        onClick={handleClick}
        sx={{
          cursor: 'pointer',
          height: '100%',
          background: `linear-gradient(135deg, ${APP_CONFIG.THEME.WHITE} 0%, ${APP_CONFIG.THEME.LIGHT_GRAY} 100%)`,
          border: `2px solid ${APP_CONFIG.THEME.MEDIUM_GRAY}`,
          borderRadius: 3,
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: APP_CONFIG.THEME.PRIMARY_GREEN,
            boxShadow: `0 12px 32px rgba(61, 205, 88, 0.3)`,
          },
        }}
      >
        <CardContent sx={{ p: 3 }}>
          {/* Header */}
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: APP_CONFIG.THEME.TEXT_PRIMARY,
                mb: 0.5,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Devices sx={{ color: APP_CONFIG.THEME.PRIMARY_GREEN }} />
              {testBench.name}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: APP_CONFIG.THEME.TEXT_SECONDARY }}
            >
              {testBench.location}
            </Typography>
          </Box>

          {/* Total Devices */}
          <Box
            sx={{
              mb: 2,
              p: 2,
              backgroundColor: APP_CONFIG.THEME.PRIMARY_GREEN,
              borderRadius: 2,
              textAlign: 'center',
            }}
          >
            <Typography
              variant="h3"
              sx={{ fontWeight: 800, color: APP_CONFIG.THEME.WHITE }}
            >
              {testBench.totalDevices}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: APP_CONFIG.THEME.WHITE, fontWeight: 600 }}
            >
              Total Devices
            </Typography>
          </Box>

          {/* Device Status Grid */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 1.5,
              mb: 2,
            }}
          >
            {/* Good */}
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <Box
                sx={{
                  p: 1.5,
                  backgroundColor: APP_CONFIG.THEME.STATUS_GOOD,
                  borderRadius: 2,
                  textAlign: 'center',
                }}
              >
                <CheckCircle sx={{ color: APP_CONFIG.THEME.WHITE, mb: 0.5 }} />
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, color: APP_CONFIG.THEME.WHITE }}
                >
                  {deviceStatus.good}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: APP_CONFIG.THEME.WHITE }}
                >
                  Good
                </Typography>
              </Box>
            </motion.div>

            {/* Critical - Blinking Animation */}
            <motion.div
              animate={
                APP_CONFIG.ANIMATION.BLINK_CRITICAL && deviceStatus.critical > 0
                  ? {
                      opacity: [1, 0.6, 1],
                      scale: [1, 1.1, 1],
                    }
                  : {}
              }
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <Box
                sx={{
                  p: 1.5,
                  backgroundColor: APP_CONFIG.THEME.STATUS_CRITICAL,
                  borderRadius: 2,
                  textAlign: 'center',
                  boxShadow:
                    deviceStatus.critical > 0
                      ? '0 0 20px rgba(244, 67, 54, 0.6)'
                      : 'none',
                }}
              >
                <Warning sx={{ color: APP_CONFIG.THEME.WHITE, mb: 0.5 }} />
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, color: APP_CONFIG.THEME.WHITE }}
                >
                  {deviceStatus.critical}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: APP_CONFIG.THEME.WHITE }}
                >
                  Critical
                </Typography>
              </Box>
            </motion.div>

            {/* Dead */}
            <Box
              sx={{
                p: 1.5,
                backgroundColor: APP_CONFIG.THEME.STATUS_DEAD,
                borderRadius: 2,
                textAlign: 'center',
              }}
            >
              <Cancel sx={{ color: APP_CONFIG.THEME.WHITE, mb: 0.5 }} />
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, color: APP_CONFIG.THEME.WHITE }}
              >
                {deviceStatus.dead}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: APP_CONFIG.THEME.WHITE }}
              >
                Dead
              </Typography>
            </Box>
          </Box>

          {/* AI Insights Badge */}
          {aiInsightsAvailable && (
            <motion.div
              animate={{
                boxShadow: [
                  '0 0 10px rgba(33, 150, 243, 0.3)',
                  '0 0 20px rgba(33, 150, 243, 0.6)',
                  '0 0 10px rgba(33, 150, 243, 0.3)',
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <Chip
                icon={<Psychology />}
                label={`${aiInsightCount} AI Insights Available`}
                sx={{
                  width: '100%',
                  backgroundColor: APP_CONFIG.THEME.STATUS_AI_INSIGHT,
                  color: APP_CONFIG.THEME.WHITE,
                  fontWeight: 700,
                  py: 2,
                  '& .MuiChip-icon': {
                    color: APP_CONFIG.THEME.WHITE,
                  },
                }}
              />
            </motion.div>
          )}

          {!aiInsightsAvailable && (
            <Chip
              label="No AI Insights"
              sx={{
                width: '100%',
                backgroundColor: APP_CONFIG.THEME.MEDIUM_GRAY,
                color: APP_CONFIG.THEME.TEXT_SECONDARY,
                fontWeight: 600,
                py: 2,
              }}
            />
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TestBenchWidget;
