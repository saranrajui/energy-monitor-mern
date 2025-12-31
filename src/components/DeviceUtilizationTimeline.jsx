import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { APP_CONFIG } from '../constants/appConfig';

const DeviceUtilizationTimeline = ({ data }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Paper
          elevation={6}
          sx={{
            p: 2,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            color: APP_CONFIG.THEME.WHITE,
            border: `2px solid ${APP_CONFIG.THEME.PRIMARY_GREEN}`,
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 700, mb: 1 }}>
            {label}
          </Typography>
          <Typography variant="body2" sx={{ color: APP_CONFIG.THEME.STATUS_GOOD }}>
            Active: {payload[0]?.value}%
          </Typography>
          <Typography variant="body2" sx={{ color: APP_CONFIG.THEME.STATUS_WARNING }}>
            Idle: {payload[1]?.value}%
          </Typography>
          <Typography variant="body2" sx={{ color: APP_CONFIG.THEME.STATUS_DEAD }}>
            Off: {payload[2]?.value}%
          </Typography>
        </Paper>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
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
          Device Utilization Timeline
        </Typography>
        <Typography variant="caption" sx={{ color: APP_CONFIG.THEME.TEXT_SECONDARY, mb: 3, display: 'block' }}>
          Activity distribution across 24-hour periods
        </Typography>

        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={APP_CONFIG.THEME.MEDIUM_GRAY} />
            <XAxis dataKey="hour" stroke={APP_CONFIG.THEME.TEXT_SECONDARY} style={{ fontSize: '11px' }} />
            <YAxis
              stroke={APP_CONFIG.THEME.TEXT_SECONDARY}
              style={{ fontSize: '12px' }}
              label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft', style: { fontSize: '12px' } }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar
              dataKey="active"
              name="Active"
              stackId="a"
              fill={APP_CONFIG.THEME.STATUS_GOOD}
              animationDuration={1000}
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="idle"
              name="Idle"
              stackId="a"
              fill={APP_CONFIG.THEME.STATUS_WARNING}
              animationDuration={1000}
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="off"
              name="Off"
              stackId="a"
              fill={APP_CONFIG.THEME.STATUS_DEAD}
              animationDuration={1000}
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>

        {/* Idle Warning Banner */}
        <motion.div
          animate={{
            backgroundColor: [
              `${APP_CONFIG.THEME.STATUS_WARNING}20`,
              `${APP_CONFIG.THEME.STATUS_WARNING}40`,
              `${APP_CONFIG.THEME.STATUS_WARNING}20`,
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Box
            sx={{
              mt: 2,
              p: 2,
              borderRadius: 2,
              border: `2px dashed ${APP_CONFIG.THEME.STATUS_WARNING}`,
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 700, color: APP_CONFIG.THEME.STATUS_WARNING }}>
              ⚠️ High Idle Time Detected
            </Typography>
            <Typography variant="caption" sx={{ color: APP_CONFIG.THEME.TEXT_SECONDARY }}>
              Devices are running idle during off-peak hours. Consider implementing power-saving schedules.
            </Typography>
          </Box>
        </motion.div>
      </Paper>
    </motion.div>
  );
};

export default DeviceUtilizationTimeline;
