import React from 'react';
import { Paper, Typography, Box, Chip, Alert, Button } from '@mui/material';
import { motion } from 'framer-motion';
import {
  Warning,
  Info,
  CheckCircle,
  Error,
  TipsAndUpdates,
  PowerSettingsNew,
  Build,
  Schedule,
} from '@mui/icons-material';
import { APP_CONFIG } from '../constants/appConfig';

const AlertsRecommendations = ({ alerts }) => {
  const getAlertIcon = (type) => {
    switch (type) {
      case 'critical':
        return <Error />;
      case 'warning':
        return <Warning />;
      case 'info':
        return <Info />;
      case 'success':
        return <CheckCircle />;
      default:
        return <Info />;
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'critical':
        return APP_CONFIG.THEME.STATUS_CRITICAL;
      case 'warning':
        return APP_CONFIG.THEME.STATUS_WARNING;
      case 'info':
        return APP_CONFIG.THEME.STATUS_AI_INSIGHT;
      case 'success':
        return APP_CONFIG.THEME.STATUS_GOOD;
      default:
        return APP_CONFIG.THEME.TEXT_SECONDARY;
    }
  };

  const getSeverityAnimation = (severity) => {
    if (severity === 'high') {
      return {
        opacity: [1, 0.7, 1],
        scale: [1, 1.02, 1],
      };
    }
    return {};
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 3,
          background: `linear-gradient(135deg, ${APP_CONFIG.THEME.WHITE} 0%, ${APP_CONFIG.THEME.LIGHT_GRAY} 100%)`,
          border: `2px solid ${APP_CONFIG.THEME.MEDIUM_GRAY}`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <TipsAndUpdates sx={{ color: APP_CONFIG.THEME.STATUS_WARNING, fontSize: 28 }} />
          </motion.div>
          <Typography variant="h6" sx={{ fontWeight: 700, color: APP_CONFIG.THEME.TEXT_PRIMARY }}>
            Alerts & Recommendations
          </Typography>
        </Box>
        <Typography variant="caption" sx={{ color: APP_CONFIG.THEME.TEXT_SECONDARY, mb: 3, display: 'block' }}>
          AI-powered insights and system alerts
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {alerts && alerts.length > 0 ? (
            alerts.map((alert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  ...getSeverityAnimation(alert.severity),
                }}
                transition={{
                  opacity: { duration: 0.5, delay: index * 0.1 },
                  x: { duration: 0.5, delay: index * 0.1 },
                  scale: { duration: 1.5, repeat: Infinity },
                }}
                whileHover={{ scale: 1.02, x: 5 }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    borderRadius: 2,
                    overflow: 'hidden',
                  }}
                >
                  {/* Colored Left Border (SVG mockup style) */}
                  <Box
                    sx={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: '6px',
                      backgroundColor: getAlertColor(alert.type),
                      zIndex: 1,
                    }}
                  />

                  <Alert
                    severity={alert.type === 'critical' ? 'error' : alert.type}
                    icon={getAlertIcon(alert.type)}
                    sx={{
                      borderRadius: 2,
                      border: `2px solid ${getAlertColor(alert.type)}`,
                      backgroundColor: `${getAlertColor(alert.type)}15`,
                      pl: 3,
                      '& .MuiAlert-icon': {
                        color: getAlertColor(alert.type),
                      },
                      boxShadow:
                        alert.severity === 'high'
                          ? `0 0 20px ${getAlertColor(alert.type)}40`
                          : 'none',
                    }}
                  >
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, mb: 0.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>
                            {alert.title}
                          </Typography>
                          {alert.severity === 'high' && (
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 1, repeat: Infinity }}
                            >
                              <Chip
                                label="URGENT"
                                size="small"
                                sx={{
                                  backgroundColor: APP_CONFIG.THEME.STATUS_CRITICAL,
                                  color: APP_CONFIG.THEME.WHITE,
                                  fontWeight: 800,
                                  fontSize: '10px',
                                }}
                              />
                            </motion.div>
                          )}
                        </Box>

                        {/* Action Button (SVG mockup style) */}
                        {alert.type === 'critical' && (
                          <Button
                            size="small"
                            variant="contained"
                            startIcon={<PowerSettingsNew />}
                            sx={{
                              backgroundColor: `${APP_CONFIG.THEME.STATUS_CRITICAL}30`,
                              color: APP_CONFIG.THEME.STATUS_CRITICAL,
                              border: `1px solid ${APP_CONFIG.THEME.STATUS_CRITICAL}`,
                              fontWeight: 700,
                              fontSize: '10px',
                              '&:hover': {
                                backgroundColor: APP_CONFIG.THEME.STATUS_CRITICAL,
                                color: APP_CONFIG.THEME.WHITE,
                              },
                            }}
                          >
                            Power Down
                          </Button>
                        )}
                        {alert.type === 'warning' && (
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<Build />}
                            sx={{
                              borderColor: APP_CONFIG.THEME.STATUS_WARNING,
                              color: APP_CONFIG.THEME.STATUS_WARNING,
                              fontWeight: 700,
                              fontSize: '10px',
                              '&:hover': {
                                backgroundColor: `${APP_CONFIG.THEME.STATUS_WARNING}20`,
                                borderColor: APP_CONFIG.THEME.STATUS_WARNING,
                              },
                            }}
                          >
                            Schedule
                          </Button>
                        )}
                        {alert.type === 'success' && (
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<Schedule />}
                            sx={{
                              borderColor: APP_CONFIG.THEME.STATUS_GOOD,
                              color: APP_CONFIG.THEME.STATUS_GOOD,
                              fontWeight: 700,
                              fontSize: '10px',
                              '&:hover': {
                                backgroundColor: `${APP_CONFIG.THEME.STATUS_GOOD}20`,
                                borderColor: APP_CONFIG.THEME.STATUS_GOOD,
                              },
                            }}
                          >
                            Apply
                          </Button>
                        )}
                      </Box>
                      <Typography variant="caption">{alert.message}</Typography>
                    </Box>
                  </Alert>
                </Box>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Alert
                severity="success"
                icon={<CheckCircle />}
                sx={{
                  borderRadius: 2,
                  backgroundColor: `${APP_CONFIG.THEME.STATUS_GOOD}10`,
                  border: `2px solid ${APP_CONFIG.THEME.STATUS_GOOD}`,
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  All Systems Operating Normally
                </Typography>
                <Typography variant="caption">No alerts or recommendations at this time.</Typography>
              </Alert>
            </motion.div>
          )}
        </Box>

        {/* AI Recommendation Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Box
            sx={{
              mt: 3,
              p: 2,
              borderRadius: 2,
              background: `linear-gradient(135deg, ${APP_CONFIG.THEME.STATUS_AI_INSIGHT} 0%, #1565C0 100%)`,
              color: APP_CONFIG.THEME.WHITE,
              border: `2px solid ${APP_CONFIG.THEME.STATUS_AI_INSIGHT}`,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <TipsAndUpdates sx={{ fontSize: 24 }} />
              </motion.div>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                AI Smart Suggestion
              </Typography>
            </Box>
            <Typography variant="caption">
              Based on historical data, consider scheduling non-critical devices to power down during
              00:00-06:00 hours to reduce energy consumption by up to 18%.
            </Typography>
          </Box>
        </motion.div>

        {/* Alert Summary Stats */}
        <Box
          sx={{
            mt: 3,
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 1,
          }}
        >
          <motion.div whileHover={{ scale: 1.1 }}>
            <Box
              sx={{
                p: 1,
                backgroundColor: APP_CONFIG.THEME.STATUS_CRITICAL,
                borderRadius: 1,
                textAlign: 'center',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 800, color: APP_CONFIG.THEME.WHITE }}>
                {alerts?.filter((a) => a.type === 'critical').length || 0}
              </Typography>
              <Typography variant="caption" sx={{ color: APP_CONFIG.THEME.WHITE, fontSize: '10px' }}>
                Critical
              </Typography>
            </Box>
          </motion.div>

          <motion.div whileHover={{ scale: 1.1 }}>
            <Box
              sx={{
                p: 1,
                backgroundColor: APP_CONFIG.THEME.STATUS_WARNING,
                borderRadius: 1,
                textAlign: 'center',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 800, color: APP_CONFIG.THEME.WHITE }}>
                {alerts?.filter((a) => a.type === 'warning').length || 0}
              </Typography>
              <Typography variant="caption" sx={{ color: APP_CONFIG.THEME.WHITE, fontSize: '10px' }}>
                Warning
              </Typography>
            </Box>
          </motion.div>

          <motion.div whileHover={{ scale: 1.1 }}>
            <Box
              sx={{
                p: 1,
                backgroundColor: APP_CONFIG.THEME.STATUS_AI_INSIGHT,
                borderRadius: 1,
                textAlign: 'center',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 800, color: APP_CONFIG.THEME.WHITE }}>
                {alerts?.filter((a) => a.type === 'info').length || 0}
              </Typography>
              <Typography variant="caption" sx={{ color: APP_CONFIG.THEME.WHITE, fontSize: '10px' }}>
                Info
              </Typography>
            </Box>
          </motion.div>

          <motion.div whileHover={{ scale: 1.1 }}>
            <Box
              sx={{
                p: 1,
                backgroundColor: APP_CONFIG.THEME.STATUS_GOOD,
                borderRadius: 1,
                textAlign: 'center',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 800, color: APP_CONFIG.THEME.WHITE }}>
                {alerts?.filter((a) => a.type === 'success').length || 0}
              </Typography>
              <Typography variant="caption" sx={{ color: APP_CONFIG.THEME.WHITE, fontSize: '10px' }}>
                Success
              </Typography>
            </Box>
          </motion.div>
        </Box>
      </Paper>
    </motion.div>
  );
};

export default AlertsRecommendations;
