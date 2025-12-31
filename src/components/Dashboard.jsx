import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { APP_CONFIG } from '../constants/appConfig';
import mockData from '../assets/mockData.json';
import labHierarchyData from '../assets/labHierarchyData.json';
import deviceNetworkData from '../assets/deviceNetworkData.json';
import testBenchDetailDataEnhanced from '../assets/testBenchDetailDataEnhanced.json';
import AnimatedBackground from './AnimatedBackground';
import LabHierarchyPanel from './LabHierarchyPanel';
import DeviceNetworkGraph from './DeviceNetworkGraph';
import AlertsRecommendationsEnhanced from './AlertsRecommendationsEnhanced';

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [selectedTestBench, setSelectedTestBench] = useState(null);
  const [enhancedDevices, setEnhancedDevices] = useState([]);

  useEffect(() => {
    // Load mock data
    setSummary(mockData.summary);
    // Set first test bench as default for network visualization
    setSelectedTestBench(mockData.testBenches[0]);

    // Load enhanced devices with AI properties for recommendations
    const testBenchData = testBenchDetailDataEnhanced['TB-001'];
    if (testBenchData && testBenchData.devices) {
      setEnhancedDevices(testBenchData.devices);
    }
  }, []);

  const topStats = summary
    ? [
        {
          label: 'TOTAL LABS',
          value: '3',
          subtitle: 'Active',
          subtitleColor: '#00ff88',
          borderColor: 'rgba(255, 255, 255, 0.1)',
        },
        {
          label: 'TEST BENCHES',
          value: '12',
          subtitle: 'across labs',
          subtitleColor: 'rgba(255, 255, 255, 0.5)',
          borderColor: 'rgba(255, 255, 255, 0.1)',
        },
        {
          label: 'TOTAL DEVICES',
          value: '847',
          subtitle: '32% idle',
          subtitleColor: '#ffa726',
          borderColor: 'rgba(255, 255, 255, 0.1)',
        },
        {
          label: 'ENERGY TODAY',
          value: '2.4',
          unit: 'MWh',
          subtitle: '+12%',
          subtitleColor: '#ef5350',
          borderColor: 'rgba(255, 255, 255, 0.1)',
        },
        {
          label: 'ENERGY WASTE',
          value: '847',
          unit: 'kWh/day',
          subtitle: '',
          borderColor: '#ef5350',
          isHighlight: true,
        },
        {
          label: 'SAVINGS',
          value: '$12K',
          unit: '/month',
          subtitle: '',
          borderColor: '#26c6da',
          isHighlight: true,
        },
      ]
    : [];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: APP_CONFIG.THEME.BG_GRADIENT_MAIN,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated Background with Particles and Grid */}
      <AnimatedBackground />

      {/* Main Content */}
      <Box sx={{ position: 'relative', zIndex: 1, px: 3, py: 3 }}>
        {/* Dashboard Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
        </motion.div>

        {/* Top Stats Row - 6 Horizontal Cards */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, px: 2 }}>
          {topStats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              style={{ flex: 1 }}
            >
              <Box
                sx={{
                  p: 2.5,
                  background: 'rgba(15, 20, 35, 0.7)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 2,
                  border: stat.isHighlight ? `2px solid ${stat.borderColor}` : `1px solid ${stat.borderColor}`,
                  minHeight: '110px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                {/* Label */}
                <Typography
                  variant="caption"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontSize: '11px',
                    fontWeight: 600,
                    letterSpacing: '0.5px',
                    mb: 1.5,
                  }}
                >
                  {stat.label}
                </Typography>

                {/* Value with unit */}
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 700,
                      color: stat.isHighlight
                        ? (stat.label === 'ENERGY WASTE' ? '#ef5350' : '#26c6da')
                        : APP_CONFIG.THEME.WHITE,
                      lineHeight: 1,
                    }}
                  >
                    {stat.value}
                  </Typography>
                  {stat.unit && (
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '14px',
                        fontWeight: 500,
                      }}
                    >
                      {stat.unit}
                    </Typography>
                  )}
                </Box>

                {/* Subtitle */}
                {stat.subtitle && (
                  <Typography
                    variant="caption"
                    sx={{
                      color: stat.subtitleColor,
                      fontSize: '13px',
                      fontWeight: 500,
                      mt: 0.5,
                    }}
                  >
                    {stat.subtitle}
                  </Typography>
                )}
              </Box>
            </motion.div>
          ))}
        </Box>

        {/* 3-Column Layout: Lab Hierarchy | Device Network | AI Insights */}
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            height: 'calc(100vh - 280px)',
            minHeight: '600px',
          }}
        >
          {/* LEFT PANEL - Lab Hierarchy (26%) */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{ width: APP_CONFIG.LAYOUT.LEFT_PANEL_WIDTH }}
          >
            <LabHierarchyPanel labData={labHierarchyData} />
          </motion.div>

          {/* CENTER PANEL - Device Network Graph (40%) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            style={{ width: APP_CONFIG.LAYOUT.CENTER_PANEL_WIDTH }}
          >
            <Box
              sx={{
                height: '100%',
                background: APP_CONFIG.THEME.GLASS_BG,
                backdropFilter: APP_CONFIG.THEME.GLASS_BLUR,
                borderRadius: 3,
                border: `1px solid ${APP_CONFIG.THEME.GLASS_BORDER}`,
                p: 2.5,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Network Graph Header */}
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: APP_CONFIG.THEME.TEXT_PRIMARY,
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                    mb: 0.5,
                  }}
                >
                  Device Network Topology
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: APP_CONFIG.THEME.TEXT_TERTIARY,
                    fontSize: '11px',
                  }}
                >
                  {selectedTestBench?.name} • {selectedTestBench?.totalDevices} Devices
                </Typography>
              </Box>

              {/* Network Graph Visualization */}
              {selectedTestBench && deviceNetworkData[selectedTestBench.id] && (
                <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <DeviceNetworkGraph
                    testBench={selectedTestBench}
                    devices={deviceNetworkData[selectedTestBench.id]}
                    onDeviceClick={(device) => console.log('Device clicked:', device)}
                  />
                </Box>
              )}
            </Box>
          </motion.div>

          {/* RIGHT PANEL - AI Recommendations (28%) */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            style={{ width: APP_CONFIG.LAYOUT.RIGHT_PANEL_WIDTH }}
          >
            <AlertsRecommendationsEnhanced devices={enhancedDevices} maxRecommendations={6} />
          </motion.div>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
