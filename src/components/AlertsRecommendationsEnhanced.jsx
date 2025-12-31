/**
 * Enhanced Alerts & Recommendations Component
 * Shows AI-generated recommendations with clear device context
 */

import React, { useMemo } from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import {
  Warning,
  Error,
  TrendingUp,
  EnergySavingsLeaf,
  Speed,
  AutoFixHigh,
  InfoOutlined,
} from '@mui/icons-material';
import { APP_CONFIG } from '../constants/appConfig';
import { generateFleetInsights } from '../utils/aiInsightsGenerator';

const AlertsRecommendationsEnhanced = ({ devices, maxRecommendations = 5 }) => {
  // Generate fleet-level AI insights
  const fleetAnalysis = useMemo(() => {
    if (!devices || devices.length === 0) {
      return { hasInsights: false, recommendations: [] };
    }
    return generateFleetInsights(devices);
  }, [devices]);

  const getIconByCategory = (category) => {
    switch (category) {
      case 'energy_waste':
        return <EnergySavingsLeaf sx={{ fontSize: 18 }} />;
      case 'performance':
        return <Speed sx={{ fontSize: 18 }} />;
      case 'electrical':
        return <Error sx={{ fontSize: 18 }} />;
      case 'lifespan':
        return <Warning sx={{ fontSize: 18 }} />;
      default:
        return <AutoFixHigh sx={{ fontSize: 18 }} />;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return APP_CONFIG.THEME.STATUS_CRITICAL;
      case 'warning':
        return APP_CONFIG.THEME.STATUS_WARNING;
      case 'info':
        return APP_CONFIG.THEME.PRIMARY_GREEN;
      default:
        return APP_CONFIG.THEME.TEXT_SECONDARY;
    }
  };

  // Get top recommendations (critical first, then by priority)
  const topRecommendations = useMemo(() => {
    if (!fleetAnalysis.recommendations) return [];

    return fleetAnalysis.recommendations
      .slice(0, maxRecommendations);
  }, [fleetAnalysis, maxRecommendations]);

  if (!fleetAnalysis.hasInsights || topRecommendations.length === 0) {
    return (
      <Box
        sx={{
          background: APP_CONFIG.THEME.GLASS_BG,
          backdropFilter: APP_CONFIG.THEME.GLASS_BLUR,
          borderRadius: 3,
          border: `1px solid ${APP_CONFIG.THEME.GLASS_BORDER}`,
          p: 3,
        }}
      >
        <Typography
          sx={{
            color: APP_CONFIG.THEME.TEXT_SECONDARY,
            fontSize: '14px',
            textAlign: 'center',
          }}
        >
          No AI recommendations available
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        background: APP_CONFIG.THEME.GLASS_BG,
        backdropFilter: APP_CONFIG.THEME.GLASS_BLUR,
        borderRadius: 3,
        border: `1px solid ${APP_CONFIG.THEME.GLASS_BORDER}`,
        p: 3,
        height: '100%',
        overflow: 'auto',
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '3px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: APP_CONFIG.THEME.PRIMARY_GREEN,
          borderRadius: '3px',
        },
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <AutoFixHigh sx={{ fontSize: 26, color: APP_CONFIG.THEME.PRIMARY_GREEN }} />
          </motion.div>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: APP_CONFIG.THEME.TEXT_PRIMARY,
              textTransform: 'uppercase',
              letterSpacing: 1,
            }}
          >
            AI Recommendations
          </Typography>
          <Chip
            label={topRecommendations.length}
            size="small"
            sx={{
              backgroundColor: APP_CONFIG.THEME.PRIMARY_GREEN,
              color: '#fff',
              fontWeight: 700,
              fontSize: '11px',
              height: 22,
              minWidth: 22,
            }}
          />
        </Box>
        <Typography
          variant="caption"
          sx={{
            color: APP_CONFIG.THEME.TEXT_TERTIARY,
            display: 'block',
            fontSize: '11px',
          }}
        >
          Top {maxRecommendations} priority actions across {fleetAnalysis.totalDevices} devices
        </Typography>
      </Box>

      {/* Recommendations List */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {topRecommendations.map((rec, index) => (
          <motion.div
            key={`${rec.deviceId}-${rec.id}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ scale: 1.02, x: 4 }}
          >
            <Box
              sx={{
                p: 2,
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: 2,
                borderLeft: `4px solid ${getSeverityColor(rec.severity)}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.06)',
                  borderLeftColor: APP_CONFIG.THEME.PRIMARY_GREEN,
                },
              }}
            >
              {/* Device Context - NEW! */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Chip
                  label={rec.deviceName || `Device ${rec.deviceId}`}
                  size="small"
                  sx={{
                    backgroundColor: `${getSeverityColor(rec.severity)}20`,
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '12px',
                    height: 24,
                  }}
                />
                {rec.severity === 'critical' && (
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <Chip
                      label="URGENT"
                      size="small"
                      sx={{
                        backgroundColor: APP_CONFIG.THEME.STATUS_CRITICAL,
                        color: '#fff',
                        fontWeight: 800,
                        fontSize: '9px',
                        height: 18,
                      }}
                    />
                  </motion.div>
                )}
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                {/* Icon */}
                <Box
                  sx={{
                    p: 1,
                    backgroundColor: `${getSeverityColor(rec.severity)}20`,
                    borderRadius: 1.5,
                    color: getSeverityColor(rec.severity),
                    minWidth: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {getIconByCategory(rec.category)}
                </Box>

                <Box sx={{ flex: 1 }}>
                  {/* Action - Clear and concise */}
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 700,
                      color: APP_CONFIG.THEME.TEXT_PRIMARY,
                      mb: 0.5,
                      fontSize: '13px',
                      lineHeight: 1.4,
                    }}
                  >
                    {rec.action}
                  </Typography>

                  {/* Reason - Why this matters */}
                  <Typography
                    variant="caption"
                    sx={{
                      color: APP_CONFIG.THEME.TEXT_SECONDARY,
                      display: 'block',
                      mb: 1,
                      fontSize: '11px',
                      lineHeight: 1.5,
                    }}
                  >
                    {rec.reason}
                  </Typography>

                  {/* Impact and Savings */}
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                    {rec.impact && (
                      <Box
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 0.5,
                          px: 1,
                          py: 0.5,
                          backgroundColor: `${APP_CONFIG.THEME.PRIMARY_GREEN}15`,
                          borderRadius: 1,
                        }}
                      >
                        <TrendingUp
                          sx={{
                            fontSize: 12,
                            color: APP_CONFIG.THEME.PRIMARY_GREEN,
                          }}
                        />
                        <Typography
                          variant="caption"
                          sx={{
                            color: APP_CONFIG.THEME.PRIMARY_GREEN,
                            fontWeight: 700,
                            fontSize: '10px',
                          }}
                        >
                          {rec.impact}
                        </Typography>
                      </Box>
                    )}
                    {rec.savings && rec.savings.amount && (
                      <Box
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 0.5,
                          px: 1,
                          py: 0.5,
                          backgroundColor: `${APP_CONFIG.THEME.ACCENT_BLUE}15`,
                          borderRadius: 1,
                        }}
                      >
                        <EnergySavingsLeaf
                          sx={{
                            fontSize: 12,
                            color: APP_CONFIG.THEME.ACCENT_BLUE,
                          }}
                        />
                        <Typography
                          variant="caption"
                          sx={{
                            color: APP_CONFIG.THEME.ACCENT_BLUE,
                            fontWeight: 700,
                            fontSize: '10px',
                          }}
                        >
                          Save ${rec.savings.amount.toFixed(2)}{rec.savings.unit}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>
          </motion.div>
        ))}
      </Box>

      {/* Footer Summary */}
      {fleetAnalysis.totalRecommendations > maxRecommendations && (
        <Box
          sx={{
            mt: 3,
            p: 2,
            background: `linear-gradient(135deg, rgba(61, 205, 88, 0.1) 0%, rgba(0, 151, 66, 0.05) 100%)`,
            borderRadius: 2,
            border: `1px solid ${APP_CONFIG.THEME.PRIMARY_GREEN}40`,
            textAlign: 'center',
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: APP_CONFIG.THEME.TEXT_SECONDARY,
              fontSize: '11px',
            }}
          >
            +{fleetAnalysis.totalRecommendations - maxRecommendations} more recommendations available
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default AlertsRecommendationsEnhanced;
