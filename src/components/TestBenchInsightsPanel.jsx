import React from 'react';
import { Box, Typography, Button, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import { APP_CONFIG } from '../constants/appConfig';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import ScheduleIcon from '@mui/icons-material/Schedule';
import DownloadIcon from '@mui/icons-material/Download';
import TuneIcon from '@mui/icons-material/Tune';

const TestBenchInsightsPanel = ({ aiInsights = {}, selectedDevice, quickActions = [] }) => {
  // Set default values if aiInsights is missing properties
  const summary = aiInsights.summary || {
    overallStatus: 'optimal',
    criticalIssues: 0,
    warnings: 0,
    optimizationScore: 100,
    message: 'Device is operating normally. No action required.'
  };
  const recommendations = aiInsights.recommendations || [];

  // Generate a meaningful message based on device health
  const getAnalysisMessage = () => {
    if (summary.message && summary.message !== 'No AI insights available for this test bench.') {
      return summary.message;
    }

    // If no message, generate one based on device status
    if (summary.criticalIssues > 0) {
      return `Device requires immediate attention. ${summary.criticalIssues} critical ${summary.criticalIssues === 1 ? 'issue' : 'issues'} detected that may impact performance or reliability.`;
    } else if (summary.warnings > 0) {
      return `Device is operational with ${summary.warnings} ${summary.warnings === 1 ? 'warning' : 'warnings'}. Consider reviewing recommendations for optimization.`;
    } else if (summary.optimizationScore >= 90) {
      return 'Device is operating optimally. All systems functioning within normal parameters. No action required.';
    } else if (summary.optimizationScore >= 70) {
      return 'Device is performing well. Minor optimization opportunities available for improved efficiency.';
    } else {
      return 'Device performance can be improved. Review recommendations to enhance efficiency and reliability.';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return '#ef4444';
      case 'medium':
        return '#fbbf24';
      case 'low':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const getPriorityBgColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'rgba(239, 68, 68, 0.1)';
      case 'medium':
        return 'rgba(251, 191, 36, 0.1)';
      case 'low':
        return 'rgba(16, 185, 129, 0.1)';
      default:
        return 'rgba(107, 114, 128, 0.1)';
    }
  };

  const getActionIcon = (iconType) => {
    switch (iconType) {
      case 'power':
        return <PowerSettingsNewIcon sx={{ fontSize: 18 }} />;
      case 'schedule':
        return <ScheduleIcon sx={{ fontSize: 18 }} />;
      case 'download':
        return <DownloadIcon sx={{ fontSize: 18 }} />;
      case 'tune':
        return <TuneIcon sx={{ fontSize: 18 }} />;
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        overflowY: 'auto',
        pr: 1,
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '10px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: APP_CONFIG.THEME.PRIMARY_GREEN,
          borderRadius: '10px',
          '&:hover': {
            background: '#2eb049',
          },
        },
      }}
    >
      {/* AI Summary - MOVED TO TOP */}
      <Box
        sx={{
          p: 2.5,
          background: APP_CONFIG.THEME.GLASS_BG,
          backdropFilter: APP_CONFIG.THEME.GLASS_BLUR,
          borderRadius: 2,
          border: `2px solid ${summary.overallStatus === 'critical' ? '#ef4444' : APP_CONFIG.THEME.GLASS_BORDER}`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: APP_CONFIG.THEME.TEXT_PRIMARY,
              fontSize: '16px',
            }}
          >
            AI Analysis Summary
          </Typography>
          <Chip
            label={`Score: ${summary.optimizationScore}%`}
            sx={{
              backgroundColor: summary.optimizationScore < 70 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
              color: summary.optimizationScore < 70 ? '#fca5a5' : '#6ee7b7',
              fontWeight: 700,
              fontSize: '13px',
            }}
          />
        </Box>

        <Typography
          variant="body2"
          sx={{
            color: APP_CONFIG.THEME.TEXT_SECONDARY,
            fontSize: '13px',
            lineHeight: 1.6,
            mb: 1.5,
          }}
        >
          {getAnalysisMessage()}
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Box>
            <Typography variant="caption" sx={{ color: APP_CONFIG.THEME.TEXT_TERTIARY, fontSize: '10px' }}>
              Critical Issues
            </Typography>
            <Typography variant="h6" sx={{ color: '#ef4444', fontWeight: 700, fontSize: '18px' }}>
              {summary.criticalIssues}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: APP_CONFIG.THEME.TEXT_TERTIARY, fontSize: '10px' }}>
              Warnings
            </Typography>
            <Typography variant="h6" sx={{ color: '#fbbf24', fontWeight: 700, fontSize: '18px' }}>
              {summary.warnings}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Device Details Section (shown when device is selected) */}
      {selectedDevice && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Box
            sx={{
              p: 2.5,
              background: 'rgba(61, 205, 88, 0.08)',
              backdropFilter: 'blur(10px)',
              borderRadius: 2,
              border: '2px solid rgba(61, 205, 88, 0.4)',
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: APP_CONFIG.THEME.PRIMARY_GREEN,
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: 1,
                mb: 1,
                display: 'block',
              }}
            >
              SELECTED DEVICE
            </Typography>

            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: APP_CONFIG.THEME.WHITE,
                mb: 1.5,
              }}
            >
              {selectedDevice.name}
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ color: APP_CONFIG.THEME.TEXT_TERTIARY, fontSize: '12px' }}>
                  Device ID:
                </Typography>
                <Typography variant="body2" sx={{ color: APP_CONFIG.THEME.WHITE, fontWeight: 600, fontSize: '12px' }}>
                  D-{selectedDevice.id}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ color: APP_CONFIG.THEME.TEXT_TERTIARY, fontSize: '12px' }}>
                  Type:
                </Typography>
                <Typography variant="body2" sx={{ color: APP_CONFIG.THEME.WHITE, fontWeight: 600, fontSize: '12px', textTransform: 'capitalize' }}>
                  {selectedDevice.type === 'load_bank' ? 'Load Bank' : selectedDevice.type.replace('_', ' ')}
                </Typography>
              </Box>

              {/* Load Bank specific metrics */}
              {selectedDevice.type === 'load_bank' && (
                <>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: APP_CONFIG.THEME.TEXT_TERTIARY, fontSize: '12px' }}>
                      Capacity:
                    </Typography>
                    <Typography variant="body2" sx={{ color: APP_CONFIG.THEME.WHITE, fontWeight: 600, fontSize: '12px' }}>
                      {selectedDevice.powerCapacity} kW
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: APP_CONFIG.THEME.TEXT_TERTIARY, fontSize: '12px' }}>
                      Current Load:
                    </Typography>
                    <Typography variant="body2" sx={{ color: APP_CONFIG.THEME.WHITE, fontWeight: 600, fontSize: '12px' }}>
                      {selectedDevice.currentLoad} kW ({selectedDevice.loadPercentage}%)
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: APP_CONFIG.THEME.TEXT_TERTIARY, fontSize: '12px' }}>
                      Efficiency:
                    </Typography>
                    <Typography variant="body2" sx={{
                      color: selectedDevice.efficiency >= 90 ? '#10b981' : '#fbbf24',
                      fontWeight: 600,
                      fontSize: '12px'
                    }}>
                      {selectedDevice.efficiency}%
                    </Typography>
                  </Box>
                </>
              )}
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ color: APP_CONFIG.THEME.TEXT_TERTIARY, fontSize: '12px' }}>
                  Status:
                </Typography>
                <Chip
                  label={selectedDevice.status.toUpperCase()}
                  size="small"
                  sx={{
                    backgroundColor: getPriorityBgColor(selectedDevice.status === 'critical' ? 'high' : selectedDevice.status === 'warning' ? 'medium' : 'low'),
                    color: getDeviceColor(selectedDevice.status),
                    fontWeight: 700,
                    fontSize: '10px',
                    height: '20px',
                  }}
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ color: APP_CONFIG.THEME.TEXT_TERTIARY, fontSize: '12px' }}>
                  Consumers:
                </Typography>
                <Typography variant="body2" sx={{ color: APP_CONFIG.THEME.WHITE, fontWeight: 600, fontSize: '12px' }}>
                  {selectedDevice.consumers || selectedDevice.activeConsumers || 0}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ color: APP_CONFIG.THEME.TEXT_TERTIARY, fontSize: '12px' }}>
                  Energy Usage:
                </Typography>
                <Typography variant="body2" sx={{ color: APP_CONFIG.THEME.WHITE, fontWeight: 600, fontSize: '12px' }}>
                  {selectedDevice.energyUsage} kWh/day
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ color: APP_CONFIG.THEME.TEXT_TERTIARY, fontSize: '12px' }}>
                  Data Flow:
                </Typography>
                <Typography variant="body2" sx={{ color: APP_CONFIG.THEME.WHITE, fontWeight: 600, fontSize: '12px' }}>
                  {selectedDevice.dataFlow} MB/s
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ color: APP_CONFIG.THEME.TEXT_TERTIARY, fontSize: '12px' }}>
                  Temperature:
                </Typography>
                <Typography variant="body2" sx={{ color: APP_CONFIG.THEME.WHITE, fontWeight: 600, fontSize: '12px' }}>
                  {selectedDevice.temperature}°C
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ color: APP_CONFIG.THEME.TEXT_TERTIARY, fontSize: '12px' }}>
                  Uptime:
                </Typography>
                <Typography variant="body2" sx={{ color: APP_CONFIG.THEME.WHITE, fontWeight: 600, fontSize: '12px' }}>
                  {selectedDevice.uptime}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ color: APP_CONFIG.THEME.TEXT_TERTIARY, fontSize: '12px' }}>
                  Last Active:
                </Typography>
                <Typography variant="body2" sx={{ color: APP_CONFIG.THEME.WHITE, fontWeight: 600, fontSize: '12px' }}>
                  {selectedDevice.lastActive}
                </Typography>
              </Box>

              {selectedDevice.alert && (
                <Box sx={{ mt: 1, p: 1.5, background: 'rgba(239, 68, 68, 0.15)', borderRadius: 1, border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                  <Typography variant="caption" sx={{ color: '#fca5a5', fontSize: '11px', fontWeight: 600 }}>
                    ⚠ {selectedDevice.alert}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </motion.div>
      )}

      {/* Quick Actions */}
      {quickActions && quickActions.length > 0 && (
        <Box
          sx={{
            p: 2.5,
            background: APP_CONFIG.THEME.GLASS_BG,
            backdropFilter: APP_CONFIG.THEME.GLASS_BLUR,
            borderRadius: 2,
            border: `1px solid ${APP_CONFIG.THEME.GLASS_BORDER}`,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: APP_CONFIG.THEME.TEXT_PRIMARY,
              fontSize: '14px',
              mb: 2,
            }}
          >
            Quick Actions
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {quickActions.map((action, index) => (
              <Button
                key={action.id}
                variant={action.type === 'primary' ? 'contained' : 'outlined'}
                fullWidth
                startIcon={getActionIcon(action.icon)}
                sx={{
                  py: 1.2,
                  justifyContent: 'flex-start',
                  backgroundColor: action.type === 'primary' ? APP_CONFIG.THEME.PRIMARY_GREEN : 'transparent',
                  color: action.type === 'primary' ? APP_CONFIG.THEME.BG_DARK_PRIMARY : APP_CONFIG.THEME.WHITE,
                  borderColor: action.type === 'primary' ? APP_CONFIG.THEME.PRIMARY_GREEN : APP_CONFIG.THEME.GLASS_BORDER,
                  fontSize: '12px',
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: action.type === 'primary' ? '#2eb049' : 'rgba(61, 205, 88, 0.1)',
                    borderColor: APP_CONFIG.THEME.PRIMARY_GREEN,
                  },
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 1 }}>
                  <Typography sx={{ fontSize: '12px', fontWeight: 600 }}>{action.label}</Typography>
                  <Typography sx={{ fontSize: '10px', opacity: 0.8 }}>{action.estimatedImpact}</Typography>
                </Box>
              </Button>
            ))}
          </Box>
        </Box>
      )}

      {/* AI Recommendations */}
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          color: APP_CONFIG.THEME.TEXT_PRIMARY,
          fontSize: '14px',
          mb: 1,
          mt: 1,
        }}
      >
        AI Recommendations ({recommendations.length})
      </Typography>

      {recommendations.map((rec, index) => (
        <motion.div
          key={rec.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <Box
            sx={{
              p: 2,
              background: getPriorityBgColor(rec.priority),
              backdropFilter: 'blur(10px)',
              borderRadius: 2,
              border: `2px solid ${getPriorityColor(rec.priority)}`,
              position: 'relative',
            }}
          >
            {/* Priority badge */}
            <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
              <Chip
                label={rec.priority.toUpperCase()}
                size="small"
                sx={{
                  backgroundColor: getPriorityColor(rec.priority),
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '9px',
                  height: '18px',
                  animation: rec.priority === 'high' ? 'blink 2s infinite' : 'none',
                  '@keyframes blink': {
                    '0%, 100%': { opacity: 1 },
                    '50%': { opacity: 0.5 },
                  },
                }}
              />
            </Box>

            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 700,
                color: APP_CONFIG.THEME.WHITE,
                fontSize: '13px',
                mb: 1,
                pr: 5,
              }}
            >
              {rec.title}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: APP_CONFIG.THEME.TEXT_SECONDARY,
                fontSize: '12px',
                lineHeight: 1.5,
                mb: 1.5,
              }}
            >
              {rec.description}
            </Typography>

            {/* Impact */}
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                px: 1.5,
                py: 0.5,
                background: 'rgba(61, 205, 88, 0.2)',
                borderRadius: 1,
                mb: 1.5,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: '#6ee7b7',
                  fontSize: '11px',
                  fontWeight: 700,
                }}
              >
                💡 {rec.impact}
              </Typography>
            </Box>

            {/* Actions list */}
            {rec.actions && rec.actions.length > 0 && (
              <Box sx={{ mt: 1.5 }}>
                <Typography
                  variant="caption"
                  sx={{
                    color: APP_CONFIG.THEME.TEXT_TERTIARY,
                    fontSize: '10px',
                    fontWeight: 700,
                    mb: 0.5,
                    display: 'block',
                  }}
                >
                  RECOMMENDED ACTIONS:
                </Typography>
                {rec.actions.map((action, actionIndex) => (
                  <Typography
                    key={actionIndex}
                    variant="caption"
                    sx={{
                      color: APP_CONFIG.THEME.TEXT_SECONDARY,
                      fontSize: '11px',
                      display: 'block',
                      mb: 0.5,
                      pl: 1.5,
                      position: 'relative',
                      '&::before': {
                        content: '"•"',
                        position: 'absolute',
                        left: 0,
                        color: getPriorityColor(rec.priority),
                      },
                    }}
                  >
                    {action}
                  </Typography>
                ))}
              </Box>
            )}

            {/* Affected devices */}
            {rec.affectedDevices && rec.affectedDevices.length > 0 && (
              <Box sx={{ mt: 1.5, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                <Typography
                  variant="caption"
                  sx={{
                    color: APP_CONFIG.THEME.TEXT_TERTIARY,
                    fontSize: '10px',
                    mr: 0.5,
                  }}
                >
                  Devices:
                </Typography>
                {rec.affectedDevices.map((deviceId) => (
                  <Chip
                    key={deviceId}
                    label={`D-${deviceId}`}
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      color: APP_CONFIG.THEME.WHITE,
                      fontSize: '9px',
                      height: '18px',
                      fontWeight: 600,
                    }}
                  />
                ))}
              </Box>
            )}
          </Box>
        </motion.div>
      ))}
    </Box>
  );
};

// Helper function for device color
const getDeviceColor = (status) => {
  switch (status) {
    case 'active':
      return '#10b981';
    case 'critical':
      return '#ef4444';
    case 'warning':
      return '#fbbf24';
    case 'dead':
      return '#6b7280';
    default:
      return '#10b981';
  }
};

export default TestBenchInsightsPanel;
