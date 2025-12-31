import React, { useState } from 'react';
import { Box, Typography, IconButton, Chip, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { APP_CONFIG } from '../constants/appConfig';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { Tooltip } from '@mui/material';

const DeviceNetworkGraph = ({ testBench, devices, onDeviceClick }) => {
  const [hoveredDevice, setHoveredDevice] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Calculate device status counts
  const statusCounts = {
    good: devices.good?.length || 0,
    critical: devices.critical?.length || 0,
    warning: 2, // Based on hardcoded warning devices
    dead: devices.dead?.length || 0,
  };
  const totalDevices = statusCounts.good + statusCounts.critical + statusCounts.warning + statusCounts.dead;
  const healthPercentage = Math.round((statusCounts.good / totalDevices) * 100);

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.2, 2));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.2, 0.5));
  const handleZoomReset = () => setZoomLevel(1);

  // Define specific device positions for better layout (matching SVG mockup)
  const devicePositions = [
    // Good devices (green)
    { x: -120, y: -100, device: devices.good[0], type: 'good' },
    { x: -80, y: 140, device: devices.good[1], type: 'good' },
    { x: -40, y: -160, device: devices.good[2], type: 'good', small: true },
    { x: 20, y: -170, device: devices.good[3], type: 'good', small: true },

    // Critical devices (red)
    { x: 130, y: -80, device: devices.critical[0], type: 'critical' },
    { x: 100, y: 130, device: devices.critical[1], type: 'critical' },
    { x: -170, y: 20, device: devices.critical[2], type: 'critical' },
    { x: 80, y: -150, device: devices.critical[3], type: 'critical', small: true },

    // Warning/low usage (yellow)
    { x: 160, y: 40, device: { id: '03', consumers: 1, status: 'warning' }, type: 'warning' },
    { x: -165, y: -60, device: { id: '07', consumers: 1, status: 'warning' }, type: 'warning', small: true },
    { x: -170, y: -80, device: { id: '071', consumers: 1, status: 'warning' }, type: 'warning', small: true },
    { x: -175, y: -100, device: { id: '072', consumers: 1, status: 'warning' }, type: 'warning', small: true },

    // Additional small nodes (naturally distributed between bigger nodes)
    { x: -180, y: 80, device: devices.dead[0], type: 'dead', small: true },
    { x: -140, y: 130, device: devices.dead[1], type: 'dead', small: true },
    { x: 180, y: 100, device: { id: '11', consumers: 2, status: 'good' }, type: 'good', small: true },
    { x: 200, y: -20, device: { id: '12', consumers: 0, status: 'critical' }, type: 'critical', small: true },

    // Small devices - Top area (between D-01 and critical devices)
    { x: -60, y: -130, device: { id: '13', consumers: 1, status: 'good' }, type: 'good', small: true },
    { x: 10, y: -140, device: { id: '14', consumers: 0, status: 'warning' }, type: 'warning', small: true },
    { x: 45, y: -120, device: { id: '15', consumers: 1, status: 'good' }, type: 'good', small: true },
    { x: -10, y: -105, device: { id: '16', consumers: 0, status: 'dead' }, type: 'dead', small: true },

    // Small devices - Right area (between D-03 and critical devices)
    { x: 140, y: 10, device: { id: '17', consumers: 2, status: 'good' }, type: 'good', small: true },
    { x: 155, y: -30, device: { id: '18', consumers: 0, status: 'critical' }, type: 'critical', small: true },
    { x: 175, y: 60, device: { id: '19', consumers: 1, status: 'warning' }, type: 'warning', small: true },
    { x: 190, y: 80, device: { id: '20', consumers: 1, status: 'good' }, type: 'good', small: true },
    { x: 165, y: -10, device: { id: '21', consumers: 0, status: 'dead' }, type: 'dead', small: true },

    // Small devices - Bottom area (between D-05, D-04 and center)
    { x: -50, y: 100, device: { id: '22', consumers: 2, status: 'good' }, type: 'good', small: true },
    { x: 20, y: 120, device: { id: '23', consumers: 0, status: 'warning' }, type: 'warning', small: true },
    { x: 60, y: 110, device: { id: '24', consumers: 1, status: 'critical' }, type: 'critical', small: true },
    { x: -20, y: 85, device: { id: '25', consumers: 1, status: 'good' }, type: 'good', small: true },

    // Small devices - Left area (around D-06 and D-05)
    { x: -195, y: 40, device: { id: '26', consumers: 0, status: 'dead' }, type: 'dead', small: true },
    { x: -155, y: -30, device: { id: '27', consumers: 1, status: 'warning' }, type: 'warning', small: true },
    { x: -190, y: -15, device: { id: '28', consumers: 1, status: 'good' }, type: 'good', small: true },
    { x: -150, y: 70, device: { id: '29', consumers: 0, status: 'critical' }, type: 'critical', small: true },
    { x: -120, y: 50, device: { id: '30', consumers: 2, status: 'good' }, type: 'good', small: true },

    // Small devices - Scattered in middle zones for natural look
    { x: -70, y: -50, device: { id: '31', consumers: 1, status: 'good' }, type: 'good', small: true },
    { x: 30, y: -70, device: { id: '32', consumers: 0, status: 'warning' }, type: 'warning', small: true },
    { x: 70, y: -35, device: { id: '33', consumers: 1, status: 'critical' }, type: 'critical', small: true },
    { x: -100, y: 10, device: { id: '34', consumers: 1, status: 'good' }, type: 'good', small: true },
    { x: 50, y: 40, device: { id: '35', consumers: 0, status: 'dead' }, type: 'dead', small: true },
    { x: -30, y: 50, device: { id: '36', consumers: 2, status: 'good' }, type: 'good', small: true },
    { x: 90, y: -10, device: { id: '37', consumers: 1, status: 'warning' }, type: 'warning', small: true },
    { x: -50, y: -25, device: { id: '38', consumers: 0, status: 'critical' }, type: 'critical', small: true },
  ];

  const getNodeColor = (type) => {
    switch (type) {
      case 'good':
        return '#22c55e';
      case 'critical':
        return '#f87171';
      case 'warning':
        return '#fcd34d';
      case 'dead':
        return '#9ca3af';
      default:
        return '#22c55e';
    }
  };

  const getLineStyle = (type) => {
    switch (type) {
      case 'good':
        return { stroke: '#22c55e', strokeWidth: 2.5, opacity: 0.7, strokeDasharray: 'none' };
      case 'critical':
        return { stroke: '#f87171', strokeWidth: 2.5, opacity: 0.5, strokeDasharray: '4,4' };
      case 'warning':
        return { stroke: '#fcd34d', strokeWidth: 2.5, opacity: 0.6, strokeDasharray: 'none' };
      case 'dead':
        return { stroke: '#9ca3af', strokeWidth: 2, opacity: 0.4, strokeDasharray: '2,2' };
      default:
        return { stroke: '#22c55e', strokeWidth: 2.5, opacity: 0.7, strokeDasharray: 'none' };
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      {/* Interactive Controls - Bottom Right */}
      <Paper
        elevation={3}
        sx={{
          position: 'absolute',
          bottom: 10,
          right: 10,
          zIndex: 10,
          background: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${APP_CONFIG.THEME.GLASS_BORDER}`,
          borderRadius: 2,
          p: 0.5,
          display: 'flex',
          flexDirection: 'column',
          gap: 0.5,
        }}
      >
        <Tooltip title="Zoom In" placement="left">
          <IconButton
            size="small"
            onClick={handleZoomIn}
            sx={{
              color: APP_CONFIG.THEME.TEXT_SECONDARY,
              '&:hover': {
                backgroundColor: 'rgba(61, 205, 88, 0.1)',
                color: APP_CONFIG.THEME.PRIMARY_GREEN,
              },
            }}
          >
            <ZoomInIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Zoom Out" placement="left">
          <IconButton
            size="small"
            onClick={handleZoomOut}
            sx={{
              color: APP_CONFIG.THEME.TEXT_SECONDARY,
              '&:hover': {
                backgroundColor: 'rgba(61, 205, 88, 0.1)',
                color: APP_CONFIG.THEME.PRIMARY_GREEN,
              },
            }}
          >
            <ZoomOutIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Reset View" placement="left">
          <IconButton
            size="small"
            onClick={handleZoomReset}
            sx={{
              color: APP_CONFIG.THEME.TEXT_SECONDARY,
              '&:hover': {
                backgroundColor: 'rgba(61, 205, 88, 0.1)',
                color: APP_CONFIG.THEME.PRIMARY_GREEN,
              },
            }}
          >
            <RestartAltIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Paper>

      {/* Network Graph SVG */}
      <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', position: 'relative', pt: 1 }}>
        {/* Lighter background gradient overlay */}


        <svg width="100%" height="98%" viewBox="-250 -200 500 450" preserveAspectRatio="xMidYMid meet">
          <defs>
            {/* Animated gradient for data flow */}
            <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="40%" stopColor="#3DCD58" stopOpacity="0.8">
                <animate attributeName="offset" values="0;1" dur="2s" repeatCount="indefinite" />
              </stop>
              <stop offset="60%" stopColor="#3DCD58" stopOpacity="1">
                <animate attributeName="offset" values="0;1" dur="2s" repeatCount="indefinite" />
              </stop>
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>

            {/* Radial gradient for flow particles */}
            <radialGradient id="particleGradient">
              <stop offset="0%" stopColor="#3DCD58" stopOpacity="1" />
              <stop offset="100%" stopColor="#3DCD58" stopOpacity="0" />
            </radialGradient>

            {/* Enhanced glow filters */}
            <filter id="glow-blue">
              <feGaussianBlur stdDeviation="6" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glow-green">
              <feGaussianBlur stdDeviation="5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glow-red">
              <feGaussianBlur stdDeviation="5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Main zoom group */}
          <g transform={`scale(${zoomLevel})`} style={{ transition: 'transform 0.3s ease' }}>
            {/* Central Hub - Enhanced */}
            <g transform="translate(0, 0)">
              {/* Pulsing outer circles */}
              <circle r="60" fill="none" stroke="#818cf8" strokeWidth="2.5" opacity="0">
                <animate attributeName="r" values="60;110;60" dur="3s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.9;0;0.9" dur="3s" repeatCount="indefinite" />
              </circle>

              {/* Rotating ring */}
              <circle r="75" fill="none" stroke="#6366f1" strokeWidth="2" opacity="0.4" strokeDasharray="12,6">
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 0 0"
                  to="360 0 0"
                  dur="20s"
                  repeatCount="indefinite"
                />
              </circle>

              {/* Main hub - larger and more prominent */}
              <circle r="62" fill="rgba(99,102,241,0.4)" stroke="#818cf8" strokeWidth="4" filter="url(#glow-blue)" />
              <circle r="56" fill="rgba(15,16,41,0.95)" />

              {/* Hub text */}
              <text
                y="8"
                textAnchor="middle"
                fill="#c7d2fe"
                fontSize="18"
                fontWeight="700"
                fontFamily="system-ui, sans-serif"
              >
                Bench B1
              </text>
            </g>

            {/* Connection lines and device nodes */}
            {devicePositions.map((pos, index) => {
              if (!pos.device) return null;

              const lineStyle = getLineStyle(pos.type);
              const color = getNodeColor(pos.type);
              const radius = pos.small ? 12 : 35;
              const isHovered = hoveredDevice === index;

              return (
                <motion.g
                  key={index}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  {/* Connection line */}
                  <line
                    x1="0"
                    y1="0"
                    x2={pos.x}
                    y2={pos.y}
                    stroke={lineStyle.stroke}
                    strokeWidth={isHovered ? lineStyle.strokeWidth * 1.5 : lineStyle.strokeWidth}
                    opacity={isHovered ? lineStyle.opacity * 1.3 : lineStyle.opacity}
                    strokeDasharray={lineStyle.strokeDasharray}
                    style={{ transition: 'all 0.3s ease' }}
                  >
                    {pos.type === 'critical' && (
                      <animate
                        attributeName="stroke-opacity"
                        values="0.5;0.9;0.5"
                        dur="1.5s"
                        repeatCount="indefinite"
                      />
                    )}
                  </line>

                  {/* Device node */}
                  <g
                    transform={`translate(${pos.x}, ${pos.y})`}
                    onMouseEnter={() => setHoveredDevice(index)}
                    onMouseLeave={() => setHoveredDevice(null)}
                  >
                    {/* Outer glow circle */}
                    {!pos.small && (
                      <circle
                        r={isHovered ? radius + 8 : radius + 4}
                        fill={`${color}33`}
                        stroke={color}
                        strokeWidth={isHovered ? 3 : 2}
                        style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                        filter={isHovered ? (pos.type === 'critical' ? 'url(#glow-red)' : 'url(#glow-green)') : 'none'}
                        onClick={() => onDeviceClick && onDeviceClick(pos.device)}
                      >
                        {pos.type === 'critical' && (
                          <animate
                            attributeName="stroke-opacity"
                            values="1;0.4;1"
                            dur="2s"
                            repeatCount="indefinite"
                          />
                        )}
                      </circle>
                    )}

                    {/* Main device circle */}
                    <circle
                      r={isHovered ? radius * 1.15 : radius}
                      fill={pos.small ? `${color}80` : color}
                      stroke={color}
                      strokeWidth={pos.small ? 2 : 0}
                      style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                      onClick={() => onDeviceClick && onDeviceClick(pos.device)}
                    />

                    {/* Device label with background */}
                    {!pos.small && (
                      <>
                        {/* Label background pill */}
                        <rect
                          x="-24"
                          y="-10"
                          width="48"
                          height="20"
                          rx="10"
                          fill="rgba(15, 23, 42, 0.9)"
                          stroke="rgba(255, 255, 255, 0.2)"
                          strokeWidth="1.5"
                        />

                        <text
                          y="5"
                          textAnchor="middle"
                          fill="#ffffff"
                          fontSize="13"
                          fontWeight="700"
                          fontFamily="system-ui, sans-serif"
                          style={{ cursor: 'pointer', userSelect: 'none' }}
                          onClick={() => onDeviceClick && onDeviceClick(pos.device)}
                        >
                          D-{pos.device.id}
                        </text>

                        {/* Consumer count with background */}
                        {pos.device.consumers !== undefined && (
                          <>
                            <rect
                              x="-50"
                              y="-56"
                              width="100"
                              height="22"
                              rx="11"
                              fill="rgba(15, 23, 42, 0.95)"
                              stroke={pos.type === 'critical' ? '#f87171' : 'rgba(255, 255, 255, 0.3)'}
                              strokeWidth="1.5"
                            />

                            <text
                              y="-40"
                              textAnchor="middle"
                              fill={pos.type === 'critical' ? '#fca5a5' : 'rgba(255, 255, 255, 0.8)'}
                              fontSize="11"
                              fontWeight="600"
                              fontFamily="system-ui, sans-serif"
                            >
                              {pos.device.consumers === 0 ? 'No consumers' : `${pos.device.consumers} consumer${pos.device.consumers > 1 ? 's' : ''}`}
                            </text>
                          </>
                        )}
                      </>
                    )}
                  </g>
                </motion.g>
              );
            })}

            {/* Animated data flow particles */}
            {devicePositions.map((pos, index) => {
              if (!pos.device || pos.type === 'dead') return null;

              return (
                <g key={`flow-${index}`}>
                  {/* Flow particle - moving from hub to device */}
                  <circle r="3" fill="url(#particleGradient)" opacity="0.9">
                    <animateMotion
                      dur={`${2 + (index % 3)}s`}
                      repeatCount="indefinite"
                      path={`M 0,0 L ${pos.x},${pos.y}`}
                      begin={`${index * 0.2}s`}
                    />
                  </circle>
                  {/* Return flow particle - moving from device to hub (for active devices) */}
                  {pos.type === 'good' && (
                    <circle r="2.5" fill="#06b6d4" opacity="0.7">
                      <animateMotion
                        dur={`${2.5 + (index % 3)}s`}
                        repeatCount="indefinite"
                        path={`M ${pos.x},${pos.y} L 0,0`}
                        begin={`${index * 0.25}s`}
                      />
                    </circle>
                  )}
                </g>
              );
            })}

          </g> {/* Close main zoom group */}

          {/* Legend - Enhanced with background (outside zoom group) */}
          <g transform="translate(-220, 210)">
            {/* Legend background - expanded width */}
            <rect
              x="-18"
              y="-22"
              width="476"
              height="44"
              rx="10"
              fill="rgba(15, 23, 42, 0.85)"
              stroke="rgba(255, 255, 255, 0.15)"
              strokeWidth="1.5"
            />

            {/* Active status */}
            <circle cx="10" cy="0" r="9" fill="#22c55e" stroke="#22c55e" strokeWidth="2.5" />
            <text
              x="28"
              y="6"
              fontFamily="system-ui, sans-serif"
              fontSize="13"
              fontWeight="600"
              fill="rgba(255, 255, 255, 0.9)"
            >
              Active
            </text>

            {/* Low usage status */}
            <circle cx="120" cy="0" r="9" fill="#fcd34d" stroke="#fcd34d" strokeWidth="2.5" />
            <text
              x="138"
              y="6"
              fontFamily="system-ui, sans-serif"
              fontSize="13"
              fontWeight="600"
              fill="rgba(255, 255, 255, 0.9)"
            >
              Low
            </text>

            {/* Idle status */}
            <circle cx="210" cy="0" r="9" fill="#f87171" stroke="#f87171" strokeWidth="2.5" />
            <text
              x="228"
              y="6"
              fontFamily="system-ui, sans-serif"
              fontSize="13"
              fontWeight="600"
              fill="rgba(255, 255, 255, 0.9)"
            >
              Idle
            </text>

            {/* Offline status */}
            <circle cx="300" cy="0" r="9" fill="#9ca3af" stroke="#6b7280" strokeWidth="2.5" />
            <text
              x="318"
              y="6"
              fontFamily="system-ui, sans-serif"
              fontSize="13"
              fontWeight="600"
              fill="rgba(255, 255, 255, 0.9)"
            >
              Offline
            </text>
          </g>
        </svg>
      </Box>
    </Box>
  );
};

export default DeviceNetworkGraph;
