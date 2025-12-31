import React from 'react';
import { Paper, Typography, Box, Grid, Chip } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AccessTime,
  BoltOutlined,
  DataUsage,
  People,
  HealthAndSafety,
  Psychology,
} from '@mui/icons-material';
import { APP_CONFIG } from '../constants/appConfig';

const DeviceDetailPanel = ({ device, onClose }) => {
  if (!device) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'good':
        return APP_CONFIG.THEME.STATUS_GOOD;
      case 'critical':
        return APP_CONFIG.THEME.STATUS_CRITICAL;
      case 'dead':
        return APP_CONFIG.THEME.STATUS_DEAD;
      default:
        return APP_CONFIG.THEME.TEXT_SECONDARY;
    }
  };

  // Generate mini trend data
  const generateTrendData = () => {
    const points = [];
    for (let i = 0; i < 24; i++) {
      const randomValue = 15 + Math.random() * 15;
      points.push(`${i * 25 + 50},${30 - randomValue}`);
    }
    return points.join(' ');
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.4, type: 'spring', damping: 25 }}
      >
        <Paper
          elevation={8}
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1300,
            backgroundColor: 'rgba(15, 16, 41, 0.95)',
            backdropFilter: 'blur(10px)',
            borderTop: `3px solid ${getStatusColor(device.status)}`,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            p: 3,
            maxHeight: '30vh',
            overflowY: 'auto',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: APP_CONFIG.THEME.WHITE }}>
                Selected Device: D-{device.id}
              </Typography>
              <Chip
                label={device.status.toUpperCase()}
                size="small"
                sx={{
                  backgroundColor: getStatusColor(device.status),
                  color: APP_CONFIG.THEME.WHITE,
                  fontWeight: 800,
                }}
              />
              {device.status === 'critical' && device.consumers === 0 && (
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <Chip
                    label="NO CONSUMERS"
                    size="small"
                    sx={{
                      backgroundColor: APP_CONFIG.THEME.STATUS_CRITICAL,
                      color: APP_CONFIG.THEME.WHITE,
                      fontWeight: 800,
                    }}
                  />
                </motion.div>
              )}
            </Box>

            <Box
              onClick={onClose}
              sx={{
                cursor: 'pointer',
                color: APP_CONFIG.THEME.WHITE,
                '&:hover': { color: APP_CONFIG.THEME.STATUS_CRITICAL },
              }}
            >
              <Typography variant="button" sx={{ fontWeight: 700 }}>
                ✕ Close
              </Typography>
            </Box>
          </Box>

          <Grid container spacing={2}>
            {/* Runtime */}
            <Grid item xs={12} sm={6} md={2}>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Box
                  sx={{
                    p: 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: 2,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <AccessTime sx={{ color: APP_CONFIG.THEME.WHITE, fontSize: 18 }} />
                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                      RUNTIME
                    </Typography>
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: APP_CONFIG.THEME.WHITE }}>
                    {device.runtime || '2,847'} hrs
                  </Typography>
                </Box>
              </motion.div>
            </Grid>

            {/* Energy Consumed */}
            <Grid item xs={12} sm={6} md={2}>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Box
                  sx={{
                    p: 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: 2,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <BoltOutlined sx={{ color: APP_CONFIG.THEME.STATUS_WARNING, fontSize: 18 }} />
                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                      ENERGY CONSUMED
                    </Typography>
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 800,
                      color: device.status === 'critical' ? APP_CONFIG.THEME.STATUS_CRITICAL : APP_CONFIG.THEME.WHITE,
                    }}
                  >
                    {device.energyConsumed || '1.2'} kWh/day
                  </Typography>
                </Box>
              </motion.div>
            </Grid>

            {/* Data Publishing */}
            <Grid item xs={12} sm={6} md={2}>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Box
                  sx={{
                    p: 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: 2,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <DataUsage sx={{ color: APP_CONFIG.THEME.STATUS_AI_INSIGHT, fontSize: 18 }} />
                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                      DATA PUBLISHING
                    </Typography>
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: APP_CONFIG.THEME.WHITE }}>
                    {device.dataRate || '45'} KB/s
                  </Typography>
                </Box>
              </motion.div>
            </Grid>

            {/* Consumers */}
            <Grid item xs={12} sm={6} md={2}>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Box
                  sx={{
                    p: 2,
                    backgroundColor:
                      device.consumers === 0
                        ? 'rgba(239, 68, 68, 0.1)'
                        : 'rgba(255, 255, 255, 0.05)',
                    borderRadius: 2,
                    border: device.consumers === 0 ? `1px solid ${APP_CONFIG.THEME.STATUS_CRITICAL}` : 'none',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <People
                      sx={{
                        color: device.consumers === 0 ? APP_CONFIG.THEME.STATUS_CRITICAL : APP_CONFIG.THEME.WHITE,
                        fontSize: 18,
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        color: device.consumers === 0 ? '#fca5a5' : 'rgba(255, 255, 255, 0.6)',
                      }}
                    >
                      CONSUMERS
                    </Typography>
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 800,
                      color: device.consumers === 0 ? APP_CONFIG.THEME.STATUS_CRITICAL : APP_CONFIG.THEME.WHITE,
                    }}
                  >
                    {device.consumers} active
                  </Typography>
                </Box>
              </motion.div>
            </Grid>

            {/* Health Status */}
            <Grid item xs={12} sm={6} md={2}>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Box
                  sx={{
                    p: 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: 2,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <HealthAndSafety sx={{ color: getStatusColor(device.status), fontSize: 18 }} />
                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                      HEALTH STATUS
                    </Typography>
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: getStatusColor(device.status) }}>
                    {device.status === 'good' ? 'Good' : device.status === 'critical' ? 'Critical' : 'Dead'}
                  </Typography>
                </Box>
              </motion.div>
            </Grid>

            {/* AI Recommendation */}
            <Grid item xs={12} sm={12} md={2}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                animate={{
                  boxShadow: [
                    '0 0 10px rgba(139, 92, 246, 0.3)',
                    '0 0 20px rgba(139, 92, 246, 0.6)',
                    '0 0 10px rgba(139, 92, 246, 0.3)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Box
                  sx={{
                    p: 2,
                    backgroundColor: 'rgba(139, 92, 246, 0.2)',
                    borderRadius: 2,
                    border: '1px solid rgba(139, 92, 246, 0.4)',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Psychology sx={{ color: '#c4b5fd', fontSize: 18 }} />
                    <Typography variant="caption" sx={{ color: '#c4b5fd' }}>
                      AI RECOMMENDATION
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: APP_CONFIG.THEME.WHITE, mb: 0.5 }}>
                    {device.consumers === 0
                      ? 'Power down immediately'
                      : device.status === 'critical'
                      ? 'Schedule maintenance'
                      : 'Operating normally'}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '9px' }}>
                    {device.consumers === 0 ? 'No consumers for 14 days' : 'Monitor performance'}
                  </Typography>
                </Box>
              </motion.div>
            </Grid>
          </Grid>

          {/* 24h Energy Trend Chart */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 1, display: 'block' }}>
              24h Energy Trend
            </Typography>
            <svg width="100%" height="60" viewBox="0 0 650 40">
              <defs>
                <linearGradient id="trendGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: APP_CONFIG.THEME.PRIMARY_GREEN, stopOpacity: 0.6 }} />
                  <stop offset="100%" style={{ stopColor: APP_CONFIG.THEME.PRIMARY_GREEN, stopOpacity: 0.1 }} />
                </linearGradient>
              </defs>

              {/* Trend area */}
              <path
                d={`M 50,30 ${generateTrendData()} L 650,30 Z`}
                fill="url(#trendGradient)"
                opacity="0.6"
              />

              {/* Trend line */}
              <polyline
                points={generateTrendData()}
                fill="none"
                stroke={APP_CONFIG.THEME.PRIMARY_GREEN}
                strokeWidth="2"
                opacity="0.9"
              />

              {/* Current point */}
              <circle cx="625" cy="20" r="4" fill={APP_CONFIG.THEME.PRIMARY_GREEN}>
                <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" />
              </circle>
            </svg>
          </Box>
        </Paper>
      </motion.div>
    </AnimatePresence>
  );
};

export default DeviceDetailPanel;
