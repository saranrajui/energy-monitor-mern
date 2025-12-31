import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { APP_CONFIG } from '../constants/appConfig';
import testBenchDetailData from '../assets/testBenchDetailDataLarge.json';
import AnimatedBackground from './AnimatedBackground';
import NetworkVisualizationMultiLayout from './NetworkVisualizationMultiLayout';
import TestBenchInsightsPanel from './TestBenchInsightsPanel';
import { generateDeviceInsights } from '../utils/aiInsightsGenerator';

const TestBenchDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [testBenchData, setTestBenchData] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [deviceInsights, setDeviceInsights] = useState(null);

  useEffect(() => {
    // Load test bench detail data
    const formattedId = `TB-${id.replace('TB', '').replace('-', '')}`;
    const data = testBenchDetailData[formattedId] || testBenchDetailData['TB-001'];
    setTestBenchData(data);
  }, [id]);

  const handleDeviceClick = (device) => {
    setSelectedDevice(device);

    // Generate AI insights for the selected device
    if (device) {
      // Map device properties to match AI rule engine expectations
      const mappedDevice = {
        ...device,
        consumers: device.activeConsumers || device.consumers || 0,
        isConnected: device.status !== 'dead' && device.status !== 'offline',
      };

      const insights = generateDeviceInsights(mappedDevice);

      // Format insights to match the expected structure
      const formattedInsights = {
        summary: {
          overallStatus: insights.scoreLabel.toLowerCase(),
          criticalIssues: insights.criticalIssues,
          warnings: insights.warnings,
          optimizationScore: insights.score,
          message: insights.summary
        },
        recommendations: insights.recommendations.map(rec => ({
          id: rec.id,
          title: rec.name,
          description: rec.reason,
          priority: rec.severity === 'critical' ? 'high' : rec.severity === 'warning' ? 'medium' : 'low',
          impact: rec.impact,
          actions: [rec.action],
          affectedDevices: [device.id]
        })),
        quickActions: []
      };

      setDeviceInsights(formattedInsights);
    } else {
      setDeviceInsights(null);
    }
  };

  if (!testBenchData) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: APP_CONFIG.THEME.BG_GRADIENT_MAIN,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography sx={{ color: APP_CONFIG.THEME.WHITE }}>Loading...</Typography>
      </Box>
    );
  }

  const stats = testBenchData.stats;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: APP_CONFIG.THEME.BG_GRADIENT_MAIN,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Main Content */}
      <Box sx={{ position: 'relative', zIndex: 1, px: 3, py: 1.5 }}>
        {/* Back Button - Positioned absolutely */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          style={{ position: 'absolute', top: '16px', left: '24px', zIndex: 10 }}
        >
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate('/')}
            sx={{
              borderColor: APP_CONFIG.THEME.PRIMARY_GREEN,
              color: APP_CONFIG.THEME.PRIMARY_GREEN,
              fontWeight: 600,
              backgroundColor: 'rgba(15, 20, 35, 0.7)',
              backdropFilter: 'blur(10px)',
              fontSize: '13px',
              py: 0.75,
              '&:hover': {
                borderColor: '#2eb049',
                backgroundColor: 'rgba(61, 205, 88, 0.15)',
              },
            }}
          >
            Back to Dashboard
          </Button>
        </motion.div>

        {/* Header - More compact */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ mb: 1, textAlign: 'center', pt: 0.5 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                color: APP_CONFIG.THEME.TEXT_PRIMARY,
                mb: 0.3,
                textTransform: 'uppercase',
                letterSpacing: 1.5,
                fontSize: '1.5rem',
              }}
            >
              {testBenchData.name} - Detailed View
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: APP_CONFIG.THEME.TEXT_TERTIARY,
                fontSize: '11px',
              }}
            >
              {testBenchData.lab} • {testBenchData.description}
            </Typography>
          </Box>
        </motion.div>

        {/* Stats Panel - Top Row with 6 Cards */}
        <Box sx={{ display: 'flex', gap: 1, mb: 1.5, px: 1 }}>  {/* Further reduced gap and margin */}
          {[
            {
              label: 'ACTIVE DEVICES',
              value: stats.activeDevices,
              subtitle: `of ${testBenchData.devices.length} total`,
              color: '#10b981',
              bgColor: 'rgba(16, 185, 129, 0.1)',
            },
            {
              label: 'IDLE DEVICES',
              value: stats.idleDevices,
              subtitle: 'consuming energy',
              color: '#ef4444',
              bgColor: 'rgba(239, 68, 68, 0.1)',
            },
            {
              label: 'TOTAL DATA FLOW',
              value: stats.totalDataFlow,
              subtitle: 'network throughput',
              color: '#818cf8',
              bgColor: 'rgba(129, 140, 248, 0.1)',
            },
            {
              label: 'ENERGY CONSUMPTION',
              value: stats.energyConsumption,
              subtitle: 'daily usage',
              color: '#fbbf24',
              bgColor: 'rgba(251, 191, 36, 0.1)',
            },
            {
              label: 'WASTED ENERGY',
              value: stats.wastedEnergy,
              subtitle: 'can be saved',
              color: '#ef4444',
              bgColor: 'rgba(239, 68, 68, 0.1)',
              pulse: true,
            },
            {
              label: 'POTENTIAL SAVINGS',
              value: stats.potentialSavings,
              subtitle: 'estimated',
              color: '#10b981',
              bgColor: 'rgba(16, 185, 129, 0.1)',
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              style={{ flex: 1 }}
            >
              <Box
                sx={{
                  p: 1,  // Further reduced padding from 1.5 to 1
                  background: 'rgba(15, 20, 35, 0.7)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 1.5,
                  border: `1.5px solid ${stat.color}40`,
                  minHeight: '60px',  // Further reduced from 75px to 60px
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  overflow: 'hidden',
                  ...(stat.pulse && {
                    animation: 'pulse-border 2s infinite',
                    '@keyframes pulse-border': {
                      '0%, 100%': { borderColor: `${stat.color}40` },
                      '50%': { borderColor: `${stat.color}80` },
                    },
                  }),
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontSize: '8px',  // Further reduced from 9px to 8px
                    fontWeight: 600,
                    letterSpacing: '0.3px',
                    mb: 0.3,  // Further reduced margin
                  }}
                >
                  {stat.label}
                </Typography>

                <Typography
                  variant="h6"  // Changed from h5 to h6 for even smaller size
                  sx={{
                    fontWeight: 700,
                    color: stat.color,
                    lineHeight: 1,
                    mb: 0.2,  // Further reduced margin
                    fontSize: '1.15rem',
                  }}
                >
                  {stat.value}
                </Typography>

                <Typography
                  variant="caption"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.5)',
                    fontSize: '9px',  // Reduced from 10px to 9px
                    fontWeight: 500,
                  }}
                >
                  {stat.subtitle}
                </Typography>
              </Box>
            </motion.div>
          ))}
        </Box>

        {/* 2-Column Layout: Animated Network | AI Insights */}
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            height: 'calc(100vh - 200px)',  // Further optimized from 230px to 200px (saving 30px more)
            minHeight: '600px',
          }}
        >
          {/* LEFT COLUMN - Animated Network Visualization (65%) */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{ width: '65%' }}
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
              <Box
                sx={{
                  mb: 2,
                  pb: 1.5,
                  borderBottom: `2px solid ${APP_CONFIG.THEME.PRIMARY_GREEN}30`,
                  background: `linear-gradient(90deg, ${APP_CONFIG.THEME.PRIMARY_GREEN}15 0%, transparent 100%)`,
                  px: 2,
                  py: 1.5,
                  mx: -2.5,
                  mt: -2.5,
                  borderRadius: '12px 12px 0 0',
                }}
              >
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
                  Live Device Network Topology
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: APP_CONFIG.THEME.TEXT_TERTIARY,
                    fontSize: '11px',
                  }}
                >
                  Real-time data flow visualization • Click device to view details
                </Typography>
              </Box>

              {/* Animated Network Visualization */}
              <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <NetworkVisualizationMultiLayout
                  devices={testBenchData.devices}
                  onDeviceClick={handleDeviceClick}
                  selectedDeviceId={selectedDevice?.id}
                />
              </Box>
            </Box>
          </motion.div>

          {/* RIGHT COLUMN - AI Insights & Device Details (35%) */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            style={{ width: '35%' }}
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
              {/* Insights Header */}
              <Box
                sx={{
                  mb: 2,
                  pb: 1.5,
                  borderBottom: `2px solid ${APP_CONFIG.THEME.PRIMARY_GREEN}30`,
                  background: `linear-gradient(90deg, ${APP_CONFIG.THEME.PRIMARY_GREEN}15 0%, transparent 100%)`,
                  px: 2,
                  py: 1.5,
                  mx: -2.5,
                  mt: -2.5,
                  borderRadius: '12px 12px 0 0',
                }}
              >
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
                  AI Insights & Actions
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: APP_CONFIG.THEME.TEXT_TERTIARY,
                    fontSize: '11px',
                  }}
                >
                  AI-powered recommendations for optimization
                </Typography>
              </Box>

              {/* Insights Panel */}
              <Box sx={{ flex: 1, overflow: 'hidden' }}>
                <TestBenchInsightsPanel
                  aiInsights={selectedDevice ? (deviceInsights || {}) : (testBenchData.aiInsights || {})}
                  selectedDevice={selectedDevice}
                  quickActions={selectedDevice ? [] : (testBenchData.aiInsights?.quickActions || [])}
                />
              </Box>
            </Box>
          </motion.div>
        </Box>
      </Box>
    </Box>
  );
};

export default TestBenchDetail;
