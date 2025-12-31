import React from 'react';
import { Paper, Typography, Box, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Schedule,
  HourglassEmpty,
  AttachMoney,
  DevicesOther,
  AccessTime,
} from '@mui/icons-material';
import { APP_CONFIG } from '../constants/appConfig';

const QuickStatsCards = ({ stats }) => {
  const statsData = [
    {
      icon: <TrendingUp sx={{ fontSize: 32 }} />,
      value: `${stats.avgDailyUsage.toFixed(1)} kWh`,
      label: 'Avg Daily Usage',
      color: APP_CONFIG.THEME.PRIMARY_GREEN,
      bgColor: `${APP_CONFIG.THEME.PRIMARY_GREEN}15`,
    },
    {
      icon: <Schedule sx={{ fontSize: 32 }} />,
      value: stats.peakTime,
      label: 'Peak Usage Time',
      color: APP_CONFIG.THEME.STATUS_WARNING,
      bgColor: `${APP_CONFIG.THEME.STATUS_WARNING}15`,
    },
    {
      icon: <HourglassEmpty sx={{ fontSize: 32 }} />,
      value: `${stats.idleTimePercent}%`,
      label: 'Idle Time',
      color: APP_CONFIG.THEME.STATUS_CRITICAL,
      bgColor: `${APP_CONFIG.THEME.STATUS_CRITICAL}15`,
    },
    {
      icon: <AttachMoney sx={{ fontSize: 32 }} />,
      value: `$${stats.costEstimate.toFixed(2)}`,
      label: 'Daily Cost Est.',
      color: APP_CONFIG.THEME.STATUS_AI_INSIGHT,
      bgColor: `${APP_CONFIG.THEME.STATUS_AI_INSIGHT}15`,
    },
    {
      icon: <AccessTime sx={{ fontSize: 32 }} />,
      value: `${stats.idleHours} hrs`,
      label: 'Idle Hours',
      color: APP_CONFIG.THEME.STATUS_WARNING,
      bgColor: `${APP_CONFIG.THEME.STATUS_WARNING}15`,
    },
    {
      icon: <DevicesOther sx={{ fontSize: 32 }} />,
      value: stats.unusedDevices,
      label: 'Unused Devices',
      color: APP_CONFIG.THEME.STATUS_DEAD,
      bgColor: `${APP_CONFIG.THEME.STATUS_DEAD}15`,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
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
        <Typography variant="h6" sx={{ fontWeight: 700, color: APP_CONFIG.THEME.TEXT_PRIMARY, mb: 1 }}>
          Quick Statistics
        </Typography>
        <Typography variant="caption" sx={{ color: APP_CONFIG.THEME.TEXT_SECONDARY, mb: 3, display: 'block' }}>
          Key performance indicators at a glance
        </Typography>

        <Grid container spacing={2}>
          {statsData.map((stat, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.2 }}
                animate={
                  stat.label === 'Idle Time' || stat.label === 'Unused Devices'
                    ? {
                        boxShadow: [
                          `0 0 10px ${stat.color}30`,
                          `0 0 20px ${stat.color}60`,
                          `0 0 10px ${stat.color}30`,
                        ],
                      }
                    : {}
                }
                style={{
                  animationDuration: stat.label === 'Idle Time' || stat.label === 'Unused Devices' ? '2s' : '0s',
                  animationIterationCount: 'infinite',
                }}
              >
                <Paper
                  elevation={2}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: stat.bgColor,
                    border: `2px solid ${stat.color}`,
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      borderColor: stat.color,
                      backgroundColor: `${stat.color}25`,
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        p: 1.5,
                        backgroundColor: stat.color,
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: APP_CONFIG.THEME.WHITE,
                      }}
                    >
                      {stat.icon}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 800,
                          color: stat.color,
                          lineHeight: 1.2,
                        }}
                      >
                        {stat.value}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: APP_CONFIG.THEME.TEXT_SECONDARY,
                          fontWeight: 600,
                        }}
                      >
                        {stat.label}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Energy Savings Tip */}
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
              background: `linear-gradient(135deg, ${APP_CONFIG.THEME.PRIMARY_GREEN} 0%, ${APP_CONFIG.THEME.DARK_GREEN} 100%)`,
              color: APP_CONFIG.THEME.WHITE,
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.5 }}>
              💡 Energy Savings Opportunity
            </Typography>
            <Typography variant="caption">
              By optimizing idle device usage, you could save up to ${(stats.costEstimate * 0.15).toFixed(2)}/day
              (~${((stats.costEstimate * 0.15) * 30).toFixed(2)}/month)
            </Typography>
          </Box>
        </motion.div>
      </Paper>
    </motion.div>
  );
};

export default QuickStatsCards;
