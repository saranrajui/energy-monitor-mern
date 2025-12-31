import React, { useState } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { APP_CONFIG } from '../constants/appConfig';

const AnimatedNetworkVisualization = ({ devices, onDeviceClick, selectedDeviceId }) => {
  const [hoveredDevice, setHoveredDevice] = useState(null);

  const getDeviceColor = (status) => {
    switch (status) {
      case 'active':
        return '#10b981'; // Green
      case 'critical':
        return '#ef4444'; // Red
      case 'warning':
        return '#fbbf24'; // Yellow
      case 'dead':
        return '#6b7280'; // Gray
      default:
        return '#10b981';
    }
  };

  const getDeviceGlow = (status) => {
    switch (status) {
      case 'active':
        return 'url(#glow-green)';
      case 'critical':
        return 'url(#glow-red)';
      case 'warning':
        return 'url(#glow-yellow)';
      default:
        return 'none';
    }
  };

  // Generate curved path for particle animation
  const getCurvedPath = (device) => {
    const { x, y } = device.position;
    const controlX = x * 0.5;
    const controlY = y * 0.5;
    return `M 0,0 Q ${controlX},${controlY} ${x},${y}`;
  };

  // Get animation duration based on data flow (faster = more data)
  const getAnimationDuration = (dataFlow) => {
    if (dataFlow > 500) return '0.8s';
    if (dataFlow > 300) return '1.2s';
    if (dataFlow > 100) return '1.8s';
    return '2.5s';
  };

  // Get particle count based on data flow
  const getParticleCount = (dataFlow) => {
    if (dataFlow > 500) return 3;
    if (dataFlow > 300) return 2;
    if (dataFlow > 0) return 1;
    return 0;
  };

  // Calculate dynamic node size based on importance (consumers + data flow)
  const getNodeRadius = (device) => {
    if (device.status === 'dead') return 6; // Small for dead devices

    const importance = (device.consumers || 0) * 3 + (device.dataFlow || 0) / 100;

    if (importance > 20) return 15; // Large - high traffic (max inner radius)
    if (importance > 10) return 13; // Medium-large
    if (importance > 5) return 11;  // Medium
    return 9; // Small - low importance
  };

  // Get connection line thickness based on data flow
  const getLineThickness = (device) => {
    if (device.status === 'dead') return 2;
    if (device.dataFlow > 500) return 4;
    if (device.dataFlow > 300) return 3.5;
    if (device.dataFlow > 100) return 3;
    return 2.5;
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
      {/* Legend Card - Top Left Overlay */}
      <Paper
        elevation={3}
        sx={{
          position: 'absolute',
          top: 10,
          left: 10,
          zIndex: 10,
          background: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${APP_CONFIG.THEME.GLASS_BORDER}`,
          borderRadius: 2,
          p: 1.5,
          minWidth: '140px',
        }}
      >
        <Typography
          sx={{
            color: APP_CONFIG.THEME.TEXT_SECONDARY,
            fontSize: '10px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            mb: 1,
          }}
        >
          Status Legend
        </Typography>

        {/* Legend Items */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
          {/* Active */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: '#10b981',
                border: '2px solid #10b981',
              }}
            />
            <Typography
              sx={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '11px',
                fontWeight: 600,
              }}
            >
              Active
            </Typography>
          </Box>

          {/* Low */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: '#fbbf24',
                border: '2px solid #fbbf24',
              }}
            />
            <Typography
              sx={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '11px',
                fontWeight: 600,
              }}
            >
              Low
            </Typography>
          </Box>

          {/* Idle */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: '#ef4444',
                border: '2px solid #ef4444',
              }}
            />
            <Typography
              sx={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '11px',
                fontWeight: 600,
              }}
            >
              Idle
            </Typography>
          </Box>

          {/* Offline */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: '#6b7280',
                border: '2px solid #6b7280',
              }}
            />
            <Typography
              sx={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '11px',
                fontWeight: 600,
              }}
            >
              Offline
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <svg width="100%" height="100%" viewBox="-280 -200 560 440" preserveAspectRatio="xMidYMid meet">
        <defs>
          {/* Glow filters */}
          <filter id="glow-green">
            <feGaussianBlur stdDeviation="6" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-red">
            <feGaussianBlur stdDeviation="6" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-yellow">
            <feGaussianBlur stdDeviation="5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-blue">
            <feGaussianBlur stdDeviation="8" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Define paths for particle animations */}
          {devices.map((device) => (
            <path
              key={`path-${device.id}`}
              id={`path-${device.id}`}
              d={getCurvedPath(device)}
              fill="none"
              stroke="none"
            />
          ))}
        </defs>

        {/* Central Hub */}
        <g transform="translate(0, 0)">
          {/* Pulsing outer rings */}
          <circle r="55" fill="none" stroke="#818cf8" strokeWidth="2" opacity="0">
            <animate attributeName="r" values="55;90;55" dur="4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.8;0;0.8" dur="4s" repeatCount="indefinite" />
          </circle>

          <circle r="55" fill="none" stroke="#6366f1" strokeWidth="2" opacity="0">
            <animate attributeName="r" values="55;90;55" dur="4s" begin="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.8;0;0.8" dur="4s" begin="2s" repeatCount="indefinite" />
          </circle>

          {/* Rotating ring */}
          <circle r="65" fill="none" stroke="#6366f1" strokeWidth="2" opacity="0.3" strokeDasharray="12,6">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 0 0"
              to="360 0 0"
              dur="25s"
              repeatCount="indefinite"
            />
          </circle>

          {/* Main hub with data emission rings */}
          <circle r="50" fill="rgba(99,102,241,0.3)" stroke="#818cf8" strokeWidth="4" filter="url(#glow-blue)" />
          <circle r="45" fill="rgba(15,16,41,0.95)" />

          {/* Data emission rings */}
          <circle r="40" fill="none" stroke="#22c55e" strokeWidth="2" opacity="0">
            <animate attributeName="r" values="40;65;40" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite" />
          </circle>

          {/* Hub label */}
          <text
            y="6"
            textAnchor="middle"
            fill="#c7d2fe"
            fontSize="16"
            fontWeight="700"
            fontFamily="system-ui, sans-serif"
          >
            TB-001
          </text>
        </g>

        {/* Connection lines and devices */}
        {devices.map((device, index) => {
          const color = getDeviceColor(device.status);
          const glow = getDeviceGlow(device.status);
          const isHovered = hoveredDevice === device.id;
          const isSelected = selectedDeviceId === device.id;
          const radius = getNodeRadius(device); // Dynamic size based on importance
          const lineThickness = getLineThickness(device);
          const { x, y } = device.position;

          return (
            <g key={device.id}>
              {/* Curved connection line */}
              <path
                d={getCurvedPath(device)}
                fill="none"
                stroke={color}
                strokeWidth={isHovered || isSelected ? lineThickness * 1.2 : lineThickness}
                opacity={isHovered || isSelected ? 0.8 : 0.5}
                strokeDasharray={device.status === 'critical' ? '6,4' : device.status === 'dead' ? '2,2' : 'none'}
                style={{ transition: 'all 0.3s ease' }}
              >
                {device.status === 'critical' && (
                  <animate
                    attributeName="stroke-opacity"
                    values="0.5;1;0.5"
                    dur="1.5s"
                    repeatCount="indefinite"
                  />
                )}
              </path>

              {/* Flowing particles along path - EXACTLY like SVG mockup */}
              {device.status === 'active' && (
                <>
                  {/* Particle 1: Largest with glow (r=4, #10b981) */}
                  <circle r="4" fill="#10b981" filter={glow}>
                    <animateMotion dur={getAnimationDuration(device.dataFlow)} repeatCount="indefinite">
                      <mpath href={`#path-${device.id}`} />
                    </animateMotion>
                  </circle>

                  {/* Particle 2: Medium (r=3, #34d399) */}
                  <circle r="3" fill="#34d399">
                    <animateMotion dur={getAnimationDuration(device.dataFlow)} repeatCount="indefinite" begin="0.3s">
                      <mpath href={`#path-${device.id}`} />
                    </animateMotion>
                  </circle>

                  {/* Particle 3: Medium lighter (r=3, #6ee7b7) */}
                  <circle r="3" fill="#6ee7b7">
                    <animateMotion dur={getAnimationDuration(device.dataFlow)} repeatCount="indefinite" begin="0.6s">
                      <mpath href={`#path-${device.id}`} />
                    </animateMotion>
                  </circle>

                  {/* Particle 4: Smallest lightest (r=2, #a7f3d0) */}
                  <circle r="2" fill="#a7f3d0">
                    <animateMotion dur={getAnimationDuration(device.dataFlow)} repeatCount="indefinite" begin="0.9s">
                      <mpath href={`#path-${device.id}`} />
                    </animateMotion>
                  </circle>
                </>
              )}

              {/* Device node */}
              <g transform={`translate(${x}, ${y})`}>
                {/* Selection ring */}
                {isSelected && (
                  <circle
                    r={radius + 10}
                    fill="none"
                    stroke="#3DCD58"
                    strokeWidth="3"
                    opacity="0.8"
                  >
                    <animate
                      attributeName="r"
                      values={`${radius + 10};${radius + 12};${radius + 10}`}
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}

                {/* Outer glow circle */}
                <circle
                  r={isHovered ? radius + 6 : radius + 3}
                  fill={`${color}33`}
                  stroke={color}
                  strokeWidth={isHovered || isSelected ? 2.5 : 1.5}
                  style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                  filter={isHovered ? glow : 'none'}
                  onMouseEnter={() => setHoveredDevice(device.id)}
                  onMouseLeave={() => setHoveredDevice(null)}
                  onClick={() => onDeviceClick(device)}
                >
                  {device.status === 'critical' && (
                    <animate
                      attributeName="stroke-opacity"
                      values="1;0.3;1"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  )}
                </circle>

                {/* Main device circle */}
                <circle
                  r={isHovered ? radius * 1.1 : radius}
                  fill={color}
                  style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                  onMouseEnter={() => setHoveredDevice(device.id)}
                  onMouseLeave={() => setHoveredDevice(null)}
                  onClick={() => onDeviceClick(device)}
                />

                {/* Data emission rings for active high-traffic devices */}
                {device.status === 'active' && device.dataFlow > 300 && (
                  <circle r={radius + 3} fill="none" stroke={color} strokeWidth="1.5" opacity="0">
                    <animate attributeName="r" values={`${radius + 3};${radius + 18};${radius + 3}`} dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.8;0;0.8" dur="2s" repeatCount="indefinite" />
                  </circle>
                )}

                {/* Electric spark effects for active high-traffic devices (SVG mockup style) */}
                {device.status === 'active' && device.dataFlow > 400 && (
                  <>
                    {/* Spark line 1 */}
                    <line x1={-radius} y1="0" x2={-radius - 8} y2="-5" stroke={color} strokeWidth="1.5" opacity="0">
                      <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" begin="0s" />
                    </line>
                    {/* Spark line 2 */}
                    <line x1={radius} y1="-3" x2={radius + 7} y2="-9" stroke={color} strokeWidth="1.5" opacity="0">
                      <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" begin="0.5s" />
                    </line>
                    {/* Spark line 3 */}
                    <line x1={9} y1={radius - 3} x2={16} y2={radius + 7} stroke={color} strokeWidth="1.5" opacity="0">
                      <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" begin="1s" />
                    </line>
                  </>
                )}

                {/* Pulsing warning effect for critical devices - enhanced */}
                {device.status === 'critical' && (
                  <>
                    <circle r={radius + 12} fill="none" stroke="#ef4444" strokeWidth="3" opacity="0">
                      <animate attributeName="r" values={`${radius + 12};${radius + 22};${radius + 12}`} dur="2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.9;0;0.9" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <circle r={radius + 12} fill="none" stroke="#ef4444" strokeWidth="3" opacity="0">
                      <animate attributeName="r" values={`${radius + 12};${radius + 22};${radius + 12}`} dur="2s" begin="1s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.9;0;0.9" dur="2s" begin="1s" repeatCount="indefinite" />
                    </circle>
                  </>
                )}

                {/* Wasted energy visualization - upward floating particles (SVG mockup style) */}
                {(device.status === 'critical' || device.status === 'dead') && device.consumers === 0 && (
                  <g>
                    {/* Particle 1 */}
                    <circle r="2" fill="#ef4444" opacity="0.8" cy={radius + 6}>
                      <animate attributeName="cy" values={`${radius + 6};${-radius - 35}`} dur="3s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.8;0" dur="3s" repeatCount="indefinite" />
                    </circle>
                    {/* Particle 2 */}
                    <circle r="1.5" fill="#f87171" opacity="0.6" cy={radius + 6}>
                      <animate attributeName="cy" values={`${radius + 6};${-radius - 35}`} dur="3s" repeatCount="indefinite" begin="0.5s" />
                      <animate attributeName="opacity" values="0.6;0" dur="3s" repeatCount="indefinite" begin="0.5s" />
                    </circle>
                    {/* Particle 3 */}
                    <circle r="1.5" fill="#fca5a5" opacity="0.5" cy={radius + 6}>
                      <animate attributeName="cy" values={`${radius + 6};${-radius - 35}`} dur="3s" repeatCount="indefinite" begin="1s" />
                      <animate attributeName="opacity" values="0.5;0" dur="3s" repeatCount="indefinite" begin="1s" />
                    </circle>
                    {/* Particle 4 */}
                    <circle r="2" fill="#ef4444" opacity="0.7" cy={radius + 6} cx="-3">
                      <animate attributeName="cy" values={`${radius + 6};${-radius - 35}`} dur="3s" repeatCount="indefinite" begin="1.5s" />
                      <animate attributeName="opacity" values="0.7;0" dur="3s" repeatCount="indefinite" begin="1.5s" />
                    </circle>
                    {/* Particle 5 */}
                    <circle r="1.5" fill="#f87171" opacity="0.6" cy={radius + 6} cx="3">
                      <animate attributeName="cy" values={`${radius + 6};${-radius - 35}`} dur="3s" repeatCount="indefinite" begin="2s" />
                      <animate attributeName="opacity" values="0.6;0" dur="3s" repeatCount="indefinite" begin="2s" />
                    </circle>
                  </g>
                )}

                {/* Device label */}
                <rect
                  x="-22"
                  y="-9"
                  width="44"
                  height="18"
                  rx="9"
                  fill="rgba(15, 23, 42, 0.95)"
                  stroke={isSelected ? '#3DCD58' : 'rgba(255, 255, 255, 0.2)'}
                  strokeWidth={isSelected ? 2 : 1}
                />
                <text
                  y="4"
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="11"
                  fontWeight="700"
                  fontFamily="system-ui, sans-serif"
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                  onMouseEnter={() => setHoveredDevice(device.id)}
                  onMouseLeave={() => setHoveredDevice(null)}
                  onClick={() => onDeviceClick(device)}
                >
                  D-{device.id}
                </text>

                {/* Warning badge (!) for critical devices with no consumers - SVG mockup style */}
                {device.status === 'critical' && device.consumers === 0 && (
                  <g transform={`translate(${radius - 3}, ${-radius + 3})`}>
                    <circle r="8" fill="#ef4444">
                      <animate attributeName="opacity" values="1;0.4;1" dur="0.8s" repeatCount="indefinite" />
                    </circle>
                    <text
                      y="3.5"
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="10"
                      fontWeight="bold"
                      fontFamily="system-ui, sans-serif"
                    >
                      !
                    </text>
                  </g>
                )}

                {/* Status indicator - only show if hovered or critical */}
                {(isHovered || isSelected || device.status === 'critical' || device.status === 'dead') && (
                  <>
                    <rect
                      x="-42"
                      y="-42"
                      width="84"
                      height="20"
                      rx="10"
                      fill="rgba(15, 23, 42, 0.95)"
                      stroke={color}
                      strokeWidth="1.5"
                    />
                    <text
                      y="-28"
                      textAnchor="middle"
                      fill={color}
                      fontSize="9"
                      fontWeight="700"
                      fontFamily="system-ui, sans-serif"
                      textTransform="uppercase"
                    >
                      {device.status === 'active' && `${device.dataFlow} MB/s`}
                      {device.status === 'critical' && device.consumers === 0 && 'No Consumers'}
                      {device.status === 'warning' && `${device.dataFlow} MB/s`}
                      {device.status === 'dead' && 'Offline'}
                    </text>
                  </>
                )}
              </g>
            </g>
          );
        })}

      </svg>
      </Box>
    </Box>
  );
};

export default AnimatedNetworkVisualization;
