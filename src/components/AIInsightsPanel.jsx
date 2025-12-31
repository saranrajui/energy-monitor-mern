import React, { useMemo } from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import {
  Psychology,
  TrendingUp,
  EmojiObjects,
  Speed,
  EnergySavingsLeaf,
  Warning,
  AutoFixHigh,
  Error,
  InfoOutlined,
} from '@mui/icons-material';
import { APP_CONFIG } from '../constants/appConfig';
import { generateDeviceInsights } from '../utils/aiInsightsGenerator';

const AIInsightsPanel = ({ device, insights }) => {
  // Generate AI insights from device data if device is provided
  const aiAnalysis = useMemo(() => {
    if (device) {
      return generateDeviceInsights(device);
    }
    return null;
  }, [device]);

  // Use AI-generated insights if available, otherwise fall back to prop insights
  const displayData = aiAnalysis || { hasInsights: false, recommendations: insights || [] };
  const getInsightIcon = (category, severity) => {
    // Map by category first
    if (category === 'energy_waste') return <EnergySavingsLeaf sx={{ fontSize: 20 }} />;
    if (category === 'performance') return <Speed sx={{ fontSize: 20 }} />;
    if (category === 'reliability') return <TrendingUp sx={{ fontSize: 20 }} />;
    if (category === 'optimization') return <AutoFixHigh sx={{ fontSize: 20 }} />;
    if (category === 'lifespan') return <Warning sx={{ fontSize: 20 }} />;
    if (category === 'electrical') return <Error sx={{ fontSize: 20 }} />;
    if (category === 'data_quality') return <InfoOutlined sx={{ fontSize: 20 }} />;

    // Map by severity as fallback
    if (severity === 'critical') return <Error sx={{ fontSize: 20 }} />;
    if (severity === 'warning') return <Warning sx={{ fontSize: 20 }} />;

    return <EmojiObjects sx={{ fontSize: 20 }} />;
  };

  const getInsightColor = (severity) => {
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

  const getSeverityLabel = (severity) => {
    switch (severity) {
      case 'critical':
        return 'URGENT';
      case 'warning':
        return 'ATTENTION';
      case 'info':
        return 'INFO';
      default:
        return '';
    }
  };

  return (
    <Box
      sx={{
        height: '100%',
        background: APP_CONFIG.THEME.GLASS_BG,
        backdropFilter: APP_CONFIG.THEME.GLASS_BLUR,
        borderRadius: 3,
        border: `1px solid ${APP_CONFIG.THEME.GLASS_BORDER}`,
        p: 2.5,
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
          '&:hover': {
            background: APP_CONFIG.THEME.DARK_GREEN,
          },
        },
      }}
    >
      {/* Panel Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Psychology sx={{ fontSize: 28, color: APP_CONFIG.THEME.PRIMARY_GREEN }} />
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
            AI Insights
          </Typography>
        </Box>
        <Typography
          variant="caption"
          sx={{
            color: APP_CONFIG.THEME.TEXT_TERTIARY,
            display: 'block',
            fontSize: '11px',
          }}
        >
          Real-time AI-powered recommendations
        </Typography>
      </Box>

      {/* AI Analysis Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          sx={{
            p: 2,
            background: displayData.hasInsights
              ? `linear-gradient(135deg, ${displayData.scoreColor || APP_CONFIG.THEME.PRIMARY_GREEN}15 0%, ${displayData.scoreColor || APP_CONFIG.THEME.PRIMARY_GREEN}05 100%)`
              : `linear-gradient(135deg, rgba(61, 205, 88, 0.15) 0%, rgba(0, 151, 66, 0.05) 100%)`,
            borderRadius: 2,
            border: `1px solid ${displayData.scoreColor || APP_CONFIG.THEME.PRIMARY_GREEN}40`,
            mb: 3,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <motion.div
              animate={{
                boxShadow: [
                  `0 0 10px ${displayData.scoreColor || APP_CONFIG.THEME.ACCENT_GREEN_GLOW}`,
                  `0 0 20px ${displayData.scoreColor || APP_CONFIG.THEME.ACCENT_GREEN_GLOW}`,
                  `0 0 10px ${displayData.scoreColor || APP_CONFIG.THEME.ACCENT_GREEN_GLOW}`,
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <AutoFixHigh sx={{ fontSize: 24, color: displayData.scoreColor || APP_CONFIG.THEME.PRIMARY_GREEN }} />
            </motion.div>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 700,
                color: displayData.scoreColor || APP_CONFIG.THEME.PRIMARY_GREEN,
              }}
            >
              AI Analysis Summary
            </Typography>
          </Box>

          {displayData.hasInsights ? (
            <>
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 1 }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 800,
                    color: displayData.scoreColor || APP_CONFIG.THEME.PRIMARY_GREEN,
                  }}
                >
                  Score: {displayData.score}%
                </Typography>
                <Chip
                  label={displayData.scoreLabel}
                  size="small"
                  sx={{
                    backgroundColor: `${displayData.scoreColor}30`,
                    color: displayData.scoreColor,
                    fontWeight: 700,
                    fontSize: '10px',
                    height: 20,
                  }}
                />
              </Box>
              <Typography
                variant="caption"
                sx={{
                  color: APP_CONFIG.THEME.TEXT_SECONDARY,
                  fontSize: '11px',
                  display: 'block',
                  mb: 1.5,
                }}
              >
                {displayData.summary}
              </Typography>

              {/* Issue Counts */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                {displayData.criticalIssues > 0 && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: APP_CONFIG.THEME.TEXT_TERTIARY,
                        fontSize: '10px',
                      }}
                    >
                      Critical Issues
                    </Typography>
                    <Chip
                      label={displayData.criticalIssues}
                      size="small"
                      sx={{
                        backgroundColor: APP_CONFIG.THEME.STATUS_CRITICAL,
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: '10px',
                        height: 18,
                        minWidth: 24,
                      }}
                    />
                  </Box>
                )}
                {displayData.warnings > 0 && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: APP_CONFIG.THEME.TEXT_TERTIARY,
                        fontSize: '10px',
                      }}
                    >
                      Warnings
                    </Typography>
                    <Chip
                      label={displayData.warnings}
                      size="small"
                      sx={{
                        backgroundColor: APP_CONFIG.THEME.STATUS_WARNING,
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: '10px',
                        height: 18,
                        minWidth: 24,
                      }}
                    />
                  </Box>
                )}
              </Box>
            </>
          ) : (
            <>
              <Typography
                variant="body2"
                sx={{
                  color: APP_CONFIG.THEME.TEXT_SECONDARY,
                  mb: 0.5,
                }}
              >
                No AI insights available for this test bench
              </Typography>
            </>
          )}
        </Box>
      </motion.div>

      {/* AI Recommendations Header */}
      {displayData.recommendations && displayData.recommendations.length > 0 && (
        <Typography
          variant="body2"
          sx={{
            fontWeight: 700,
            color: APP_CONFIG.THEME.TEXT_PRIMARY,
            mb: 2,
            textTransform: 'uppercase',
            fontSize: '11px',
            letterSpacing: 0.5,
          }}
        >
          AI Recommendations ({displayData.recommendations.length})
        </Typography>
      )}

      {/* Recommendations List */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {displayData.recommendations && displayData.recommendations.map((recommendation, index) => (
          <motion.div
            key={recommendation.id || index}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ scale: 1.02, x: -4 }}
          >
            <Box
              sx={{
                p: 2,
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: 2,
                borderLeft: `4px solid ${getInsightColor(recommendation.severity)}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderLeftColor: APP_CONFIG.THEME.PRIMARY_GREEN,
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                <Box
                  sx={{
                    p: 1,
                    backgroundColor: `${getInsightColor(recommendation.severity)}20`,
                    borderRadius: 1.5,
                    color: getInsightColor(recommendation.severity),
                  }}
                >
                  {getInsightIcon(recommendation.category, recommendation.severity)}
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 700,
                        color: APP_CONFIG.THEME.TEXT_PRIMARY,
                        flex: 1,
                      }}
                    >
                      {recommendation.name || recommendation.action}
                    </Typography>
                    {recommendation.severity === 'critical' && (
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <Chip
                          label={getSeverityLabel(recommendation.severity)}
                          size="small"
                          sx={{
                            backgroundColor: APP_CONFIG.THEME.STATUS_CRITICAL,
                            color: APP_CONFIG.THEME.WHITE,
                            fontWeight: 800,
                            fontSize: '9px',
                            height: 18,
                          }}
                        />
                      </motion.div>
                    )}
                    {recommendation.severity === 'warning' && (
                      <Chip
                        label={getSeverityLabel(recommendation.severity)}
                        size="small"
                        sx={{
                          backgroundColor: APP_CONFIG.THEME.STATUS_WARNING,
                          color: APP_CONFIG.THEME.WHITE,
                          fontWeight: 800,
                          fontSize: '9px',
                          height: 18,
                        }}
                      />
                    )}
                  </Box>

                  {/* Action */}
                  <Typography
                    variant="caption"
                    sx={{
                      color: APP_CONFIG.THEME.TEXT_PRIMARY,
                      display: 'block',
                      mb: 0.5,
                      fontSize: '11px',
                      fontWeight: 600,
                      lineHeight: 1.4,
                    }}
                  >
                    {recommendation.action}
                  </Typography>

                  {/* Reason */}
                  <Typography
                    variant="caption"
                    sx={{
                      color: APP_CONFIG.THEME.TEXT_SECONDARY,
                      display: 'block',
                      mb: 1,
                      fontSize: '10px',
                      lineHeight: 1.4,
                    }}
                  >
                    {recommendation.reason}
                  </Typography>

                  {/* Impact and Savings */}
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {recommendation.impact && (
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
                          {recommendation.impact}
                        </Typography>
                      </Box>
                    )}
                    {recommendation.savings && recommendation.savings.amount && (
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
                          ${recommendation.savings.amount.toFixed(2)} {recommendation.savings.unit}
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

      {/* AI Learning Banner */}
      {displayData.hasInsights && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Box
            sx={{
              mt: 3,
              p: 2,
              background: `linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)`,
              borderRadius: 2,
              border: `1px solid rgba(59, 130, 246, 0.3)`,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              >
                <Psychology sx={{ fontSize: 20, color: APP_CONFIG.THEME.ACCENT_BLUE }} />
              </motion.div>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 700,
                  color: APP_CONFIG.THEME.ACCENT_BLUE,
                  fontSize: '11px',
                }}
              >
                AI-Powered Analysis
              </Typography>
            </Box>
            <Typography
              variant="caption"
              sx={{
                color: APP_CONFIG.THEME.TEXT_TERTIARY,
                fontSize: '10px',
                display: 'block',
              }}
            >
              Analysis based on {device ? '7' : '11'} key factors: energy usage, data flow, device connectivity, CPU load, restart frequency, voltage stability, and consumer patterns.
            </Typography>
          </Box>
        </motion.div>
      )}
    </Box>
  );
};

export default AIInsightsPanel;
