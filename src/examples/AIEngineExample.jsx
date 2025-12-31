/**
 * AI Engine Integration Example
 * Demonstrates how to use the AI Rules Engine in your components
 */

import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import AIInsightsPanel from '../components/AIInsightsPanel';
import { generateSampleDevices } from '../utils/mockDataGenerator';
import { generateDeviceInsights, generateFleetInsights } from '../utils/aiInsightsGenerator';

const AIEngineExample = () => {
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [devices, setDevices] = useState([]);
  const [fleetAnalysis, setFleetAnalysis] = useState(null);

  useEffect(() => {
    // Generate sample devices with all required AI properties
    const sampleDevices = generateSampleDevices();
    setDevices(sampleDevices);
    setSelectedDevice(sampleDevices[1]); // Select device with critical issues

    // Generate fleet-level insights
    const fleetInsights = generateFleetInsights(sampleDevices);
    setFleetAnalysis(fleetInsights);
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        AI Rules Engine - Example Integration
      </Typography>

      <Typography variant="body1" sx={{ mb: 3 }}>
        This example demonstrates how to integrate the AI Rules Engine into your components.
      </Typography>

      {/* Fleet Summary */}
      {fleetAnalysis && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6">Fleet Analysis Summary</Typography>
          <Typography>Total Devices: {fleetAnalysis.totalDevices}</Typography>
          <Typography>Average Health Score: {fleetAnalysis.averageHealthScore}%</Typography>
          <Typography>Critical Issues: {fleetAnalysis.criticalIssues}</Typography>
          <Typography>Warnings: {fleetAnalysis.warnings}</Typography>
          <Typography>Total Recommendations: {fleetAnalysis.totalRecommendations}</Typography>
        </Paper>
      )}

      {/* Device Selector */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Select a Device:
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {devices.map((device) => (
            <Button
              key={device.id}
              variant={selectedDevice?.id === device.id ? 'contained' : 'outlined'}
              onClick={() => setSelectedDevice(device)}
              color={
                device.status === 'active' ? 'success' :
                device.status === 'critical' ? 'error' :
                device.status === 'warning' ? 'warning' : 'default'
              }
            >
              {device.name}
            </Button>
          ))}
        </Box>
      </Box>

      {/* AI Insights Panel */}
      {selectedDevice && (
        <Box sx={{ maxWidth: 600 }}>
          <Typography variant="h6" gutterBottom>
            AI Insights for: {selectedDevice.name}
          </Typography>
          <Box sx={{ height: 600 }}>
            <AIInsightsPanel device={selectedDevice} />
          </Box>
        </Box>
      )}

      {/* Code Example */}
      <Paper sx={{ p: 2, mt: 3, backgroundColor: '#1e1e1e' }}>
        <Typography variant="h6" sx={{ color: '#fff', mb: 2 }}>
          Integration Code Example:
        </Typography>
        <pre style={{ color: '#d4d4d4', overflow: 'auto' }}>
{`// 1. Import the AI insights generator
import { generateDeviceInsights } from '../utils/aiInsightsGenerator';
import { generateEnhancedDevice } from '../utils/mockDataGenerator';

// 2. Ensure your device has all required AI properties
const enhancedDevice = generateEnhancedDevice(yourDevice);

// 3. Pass the device to AIInsightsPanel
<AIInsightsPanel device={enhancedDevice} />

// Required device properties:
// - id, name, type, status
// - consumers: number
// - dataFlow: number (MB/s)
// - energyUsage: number (kWh/day)
// - temperature: number (°C)
// - uptime: number (percentage)
// - restartFrequency: number (per week)
// - voltageSpikes: number (per day)
// - cpuUsage: number (0-100)
// - isConnected: boolean
// - lastDataEmission: timestamp (milliseconds)
`}
        </pre>
      </Paper>
    </Box>
  );
};

export default AIEngineExample;
