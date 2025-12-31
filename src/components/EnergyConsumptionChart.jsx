import React, { useState } from 'react';
import { Paper, Typography, Box, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { ShowChart, BarChart as BarChartIcon } from '@mui/icons-material';
import { APP_CONFIG } from '../constants/appConfig';

const EnergyConsumptionChart = ({ data }) => {
  const [chartType, setChartType] = useState('area');

  const handleChartTypeChange = (event, newType) => {
    if (newType !== null) {
      setChartType(newType);
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
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
            <Typography variant="body2" sx={{ color: APP_CONFIG.THEME.PRIMARY_GREEN }}>
              Energy: {payload[0].value.toFixed(1)} kWh
            </Typography>
            <Typography variant="body2" sx={{ color: APP_CONFIG.THEME.STATUS_AI_INSIGHT }}>
              Active Devices: {payload[0].payload.devices}
            </Typography>
          </Paper>
        </motion.div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 3,
          background: `linear-gradient(135deg, ${APP_CONFIG.THEME.WHITE} 0%, ${APP_CONFIG.THEME.LIGHT_GRAY} 100%)`,
          border: `2px solid ${APP_CONFIG.THEME.MEDIUM_GRAY}`,
          height: '100%',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: APP_CONFIG.THEME.TEXT_PRIMARY }}>
              Energy Consumption - Last 24 Hours
            </Typography>
            <Typography variant="caption" sx={{ color: APP_CONFIG.THEME.TEXT_SECONDARY }}>
              Real-time monitoring with device activity
            </Typography>
          </Box>

          <ToggleButtonGroup
            value={chartType}
            exclusive
            onChange={handleChartTypeChange}
            size="small"
            sx={{
              '& .MuiToggleButton-root': {
                color: APP_CONFIG.THEME.TEXT_SECONDARY,
                '&.Mui-selected': {
                  backgroundColor: APP_CONFIG.THEME.PRIMARY_GREEN,
                  color: APP_CONFIG.THEME.WHITE,
                  '&:hover': {
                    backgroundColor: APP_CONFIG.THEME.DARK_GREEN,
                  },
                },
              },
            }}
          >
            <ToggleButton value="area">
              <BarChartIcon sx={{ mr: 0.5 }} fontSize="small" />
              Area
            </ToggleButton>
            <ToggleButton value="line">
              <ShowChart sx={{ mr: 0.5 }} fontSize="small" />
              Line
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <ResponsiveContainer width="100%" height={300}>
          {chartType === 'area' ? (
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={APP_CONFIG.THEME.PRIMARY_GREEN} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={APP_CONFIG.THEME.PRIMARY_GREEN} stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={APP_CONFIG.THEME.MEDIUM_GRAY} />
              <XAxis
                dataKey="time"
                stroke={APP_CONFIG.THEME.TEXT_SECONDARY}
                style={{ fontSize: '12px' }}
              />
              <YAxis
                stroke={APP_CONFIG.THEME.TEXT_SECONDARY}
                style={{ fontSize: '12px' }}
                label={{ value: 'kWh', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="value"
                name="Energy (kWh)"
                stroke={APP_CONFIG.THEME.PRIMARY_GREEN}
                strokeWidth={3}
                fill="url(#colorEnergy)"
                animationDuration={1500}
                animationBegin={0}
              />
            </AreaChart>
          ) : (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke={APP_CONFIG.THEME.MEDIUM_GRAY} />
              <XAxis
                dataKey="time"
                stroke={APP_CONFIG.THEME.TEXT_SECONDARY}
                style={{ fontSize: '12px' }}
              />
              <YAxis
                stroke={APP_CONFIG.THEME.TEXT_SECONDARY}
                style={{ fontSize: '12px' }}
                label={{ value: 'kWh', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                name="Energy (kWh)"
                stroke={APP_CONFIG.THEME.PRIMARY_GREEN}
                strokeWidth={3}
                dot={{ fill: APP_CONFIG.THEME.PRIMARY_GREEN, r: 4 }}
                activeDot={{ r: 8, fill: APP_CONFIG.THEME.DARK_GREEN }}
                animationDuration={1500}
                animationBegin={0}
              />
            </LineChart>
          )}
        </ResponsiveContainer>

        {/* Summary Stats Below Chart */}
        <Box
          sx={{
            mt: 3,
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 2,
          }}
        >
          <motion.div whileHover={{ scale: 1.05 }}>
            <Box
              sx={{
                p: 1.5,
                backgroundColor: APP_CONFIG.THEME.PRIMARY_GREEN,
                borderRadius: 2,
                textAlign: 'center',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 800, color: APP_CONFIG.THEME.WHITE }}>
                {Math.max(...data.map((d) => d.value)).toFixed(1)}
              </Typography>
              <Typography variant="caption" sx={{ color: APP_CONFIG.THEME.WHITE }}>
                Peak (kWh)
              </Typography>
            </Box>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }}>
            <Box
              sx={{
                p: 1.5,
                backgroundColor: APP_CONFIG.THEME.STATUS_AI_INSIGHT,
                borderRadius: 2,
                textAlign: 'center',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 800, color: APP_CONFIG.THEME.WHITE }}>
                {(data.reduce((sum, d) => sum + d.value, 0) / data.length).toFixed(1)}
              </Typography>
              <Typography variant="caption" sx={{ color: APP_CONFIG.THEME.WHITE }}>
                Average (kWh)
              </Typography>
            </Box>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }}>
            <Box
              sx={{
                p: 1.5,
                backgroundColor: APP_CONFIG.THEME.STATUS_WARNING,
                borderRadius: 2,
                textAlign: 'center',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 800, color: APP_CONFIG.THEME.WHITE }}>
                {Math.min(...data.map((d) => d.value)).toFixed(1)}
              </Typography>
              <Typography variant="caption" sx={{ color: APP_CONFIG.THEME.WHITE }}>
                Minimum (kWh)
              </Typography>
            </Box>
          </motion.div>
        </Box>
      </Paper>
    </motion.div>
  );
};

export default EnergyConsumptionChart;
