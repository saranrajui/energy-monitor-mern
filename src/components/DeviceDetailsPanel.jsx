import React from 'react';
import { Box, Typography, IconButton, Divider, Chip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { APP_CONFIG } from '../constants/appConfig';
import PowerIcon from '@mui/icons-material/Power';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import SpeedIcon from '@mui/icons-material/Speed';
import AccountTreeIcon from '@mui/icons-material/AccountTree';

const DeviceDetailsPanel = ({ device, onClose, allDevices }) => {
  if (!device) return null;

  // Get status color
  const getStatusColor = (status) => {
    const colors = {
      active: APP_CONFIG.THEME.STATUS_GOOD,
      warning: APP_CONFIG.THEME.STATUS_WARNING,
      critical: APP_CONFIG.THEME.STATUS_CRITICAL,
      dead: APP_CONFIG.THEME.STATUS_DEAD,
      idle: APP_CONFIG.THEME.STATUS_CRITICAL,
    };
    return colors[status] || APP_CONFIG.THEME.ACCENT_BLUE;
  };

  // Get device type label
  const getTypeLabel = (type) => {
    const labels = {
      load_bank: 'Load Bank',
      gateway: 'Gateway',
      switch: 'Switch',
      relay: 'Relay',
      power_meter: 'Power Meter',
      sensor: 'Sensor',
    };
    return labels[type] || type;
  };

  // Find parent device
  const parent = device.parentId ? allDevices.find(d => d.id === device.parentId) : null;

  // Find children devices
  const children = allDevices.filter(d => d.parentId === device.id);

  return (
    <Box
      sx={{
        position: 'fixed',
        right: 0,
        top: 0,
        height: '100vh',
        width: '400px',
        backgroundColor: APP_CONFIG.THEME.BG_DARK_SECONDARY,
        borderLeft: `2px solid ${APP_CONFIG.THEME.GLASS_BORDER}`,
        boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.5)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          padding: 2.5,
          borderBottom: `1px solid ${APP_CONFIG.THEME.GLASS_BORDER}`,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          background: `linear-gradient(135deg, ${APP_CONFIG.THEME.BG_DARK_PRIMARY} 0%, ${APP_CONFIG.THEME.BG_DARK_SECONDARY} 100%)`,
        }}
      >
        <Box sx={{ flex: 1, mr: 2 }}>
          <Typography
            variant="h6"
            sx={{
              color: APP_CONFIG.THEME.TEXT_PRIMARY,
              fontWeight: 700,
              fontSize: '18px',
              mb: 0.5,
              wordBreak: 'break-word',
            }}
          >
            {device.name}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
            <Chip
              label={getTypeLabel(device.type)}
              size="small"
              sx={{
                backgroundColor: APP_CONFIG.THEME.HIGHLIGHT_COLOR + '30',
                color: APP_CONFIG.THEME.HIGHLIGHT_COLOR,
                fontSize: '11px',
                height: '24px',
                fontWeight: 600,
              }}
            />
            <Chip
              label={device.status?.toUpperCase()}
              size="small"
              sx={{
                backgroundColor: getStatusColor(device.status) + '30',
                color: getStatusColor(device.status),
                fontSize: '11px',
                height: '24px',
                fontWeight: 600,
              }}
            />
          </Box>
        </Box>
        <IconButton
          size="small"
          onClick={onClose}
          sx={{
            color: APP_CONFIG.THEME.TEXT_SECONDARY,
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: APP_CONFIG.THEME.TEXT_PRIMARY,
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Content */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          padding: 2.5,
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: APP_CONFIG.THEME.BG_DARK_PRIMARY,
          },
          '&::-webkit-scrollbar-thumb': {
            background: APP_CONFIG.THEME.GLASS_BORDER,
            borderRadius: '4px',
          },
        }}
      >
        {/* Device Info */}
        <Box sx={{ mb: 3 }}>
          <Typography
            sx={{
              color: APP_CONFIG.THEME.TEXT_SECONDARY,
              fontSize: '12px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              mb: 1.5,
            }}
          >
            Device Information
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <InfoRow label="Device ID" value={device.id} />
            <InfoRow label="Type" value={getTypeLabel(device.type)} />
            <InfoRow label="Level" value={`Level ${device.level || 0}`} />
            {device.location && <InfoRow label="Location" value={device.location} />}
          </Box>
        </Box>

        <Divider sx={{ borderColor: APP_CONFIG.THEME.GLASS_BORDER, mb: 3 }} />

        {/* Metrics */}
        {(device.energyUsage || device.temperature || device.uptime) && (
          <>
            <Box sx={{ mb: 3 }}>
              <Typography
                sx={{
                  color: APP_CONFIG.THEME.TEXT_SECONDARY,
                  fontSize: '12px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  mb: 1.5,
                }}
              >
                Metrics
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {device.energyUsage !== undefined && (
                  <MetricCard
                    icon={<PowerIcon />}
                    label="Energy Usage"
                    value={`${device.energyUsage} kW`}
                    color={APP_CONFIG.THEME.PRIMARY_GREEN}
                  />
                )}
                {device.temperature !== undefined && (
                  <MetricCard
                    icon={<DeviceThermostatIcon />}
                    label="Temperature"
                    value={`${device.temperature}°C`}
                    color={device.temperature > 75 ? APP_CONFIG.THEME.STATUS_WARNING : APP_CONFIG.THEME.ACCENT_BLUE}
                  />
                )}
                {device.uptime !== undefined && (
                  <MetricCard
                    icon={<SpeedIcon />}
                    label="Uptime"
                    value={`${device.uptime}%`}
                    color={APP_CONFIG.THEME.ACCENT_PURPLE}
                  />
                )}
              </Box>
            </Box>

            <Divider sx={{ borderColor: APP_CONFIG.THEME.GLASS_BORDER, mb: 3 }} />
          </>
        )}

        {/* Hierarchy */}
        <Box sx={{ mb: 3 }}>
          <Typography
            sx={{
              color: APP_CONFIG.THEME.TEXT_SECONDARY,
              fontSize: '12px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              mb: 1.5,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <AccountTreeIcon sx={{ fontSize: 16 }} />
            Connection Hierarchy
          </Typography>

          {parent && (
            <Box sx={{ mb: 2 }}>
              <Typography
                sx={{
                  color: APP_CONFIG.THEME.TEXT_TERTIARY,
                  fontSize: '11px',
                  mb: 0.5,
                }}
              >
                Parent Device
              </Typography>
              <ConnectionItem device={parent} />
            </Box>
          )}

          {children.length > 0 && (
            <Box>
              <Typography
                sx={{
                  color: APP_CONFIG.THEME.TEXT_TERTIARY,
                  fontSize: '11px',
                  mb: 0.5,
                }}
              >
                Connected Devices ({children.length})
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                {children.map(child => (
                  <ConnectionItem key={child.id} device={child} />
                ))}
              </Box>
            </Box>
          )}

          {!parent && children.length === 0 && (
            <Typography
              sx={{
                color: APP_CONFIG.THEME.TEXT_TERTIARY,
                fontSize: '13px',
                fontStyle: 'italic',
              }}
            >
              No connected devices
            </Typography>
          )}
        </Box>

        {/* Additional Info */}
        {(device.activeConsumers || device.consumers) && (
          <>
            <Divider sx={{ borderColor: APP_CONFIG.THEME.GLASS_BORDER, mb: 3 }} />
            <Box>
              <Typography
                sx={{
                  color: APP_CONFIG.THEME.TEXT_SECONDARY,
                  fontSize: '12px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  mb: 1.5,
                }}
              >
                Additional Information
              </Typography>
              <InfoRow label="Active Consumers" value={device.activeConsumers || device.consumers || 0} />
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

// Helper Components
const InfoRow = ({ label, value }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <Typography
      sx={{
        color: APP_CONFIG.THEME.TEXT_TERTIARY,
        fontSize: '13px',
      }}
    >
      {label}
    </Typography>
    <Typography
      sx={{
        color: APP_CONFIG.THEME.TEXT_PRIMARY,
        fontSize: '13px',
        fontWeight: 600,
      }}
    >
      {value}
    </Typography>
  </Box>
);

const MetricCard = ({ icon, label, value, color }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 1.5,
      padding: 1.5,
      borderRadius: 1.5,
      backgroundColor: color + '15',
      border: `1px solid ${color}40`,
    }}
  >
    <Box
      sx={{
        color: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {icon}
    </Box>
    <Box sx={{ flex: 1 }}>
      <Typography
        sx={{
          color: APP_CONFIG.THEME.TEXT_TERTIARY,
          fontSize: '11px',
          mb: 0.3,
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          color: APP_CONFIG.THEME.TEXT_PRIMARY,
          fontSize: '16px',
          fontWeight: 700,
        }}
      >
        {value}
      </Typography>
    </Box>
  </Box>
);

const ConnectionItem = ({ device }) => {
  const getStatusColor = (status) => {
    const colors = {
      active: APP_CONFIG.THEME.STATUS_GOOD,
      warning: APP_CONFIG.THEME.STATUS_WARNING,
      critical: APP_CONFIG.THEME.STATUS_CRITICAL,
      dead: APP_CONFIG.THEME.STATUS_DEAD,
      idle: APP_CONFIG.THEME.STATUS_CRITICAL,
    };
    return colors[status] || APP_CONFIG.THEME.ACCENT_BLUE;
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        padding: 1,
        borderRadius: 1,
        backgroundColor: APP_CONFIG.THEME.GLASS_BG,
        border: `1px solid ${APP_CONFIG.THEME.GLASS_BORDER}`,
        transition: 'all 0.2s',
        '&:hover': {
          backgroundColor: 'rgba(61, 205, 88, 0.1)',
          borderColor: APP_CONFIG.THEME.PRIMARY_GREEN,
        },
      }}
    >
      <Box
        sx={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: getStatusColor(device.status),
          boxShadow: `0 0 8px ${getStatusColor(device.status)}`,
        }}
      />
      <Typography
        sx={{
          color: APP_CONFIG.THEME.TEXT_PRIMARY,
          fontSize: '13px',
          flex: 1,
        }}
      >
        {device.name}
      </Typography>
    </Box>
  );
};

export default DeviceDetailsPanel;
