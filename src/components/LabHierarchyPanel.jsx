import React, { useState } from 'react';
import { Box, Typography, Collapse } from '@mui/material';
import { motion } from 'framer-motion';
import {
  ExpandMore,
  ChevronRight,
  Science,
  Computer,
  Circle,
  Warning,
  Error,
  CheckCircle,
} from '@mui/icons-material';
import { APP_CONFIG } from '../constants/appConfig';
import { useNavigate } from 'react-router-dom';

const LabHierarchyPanel = ({ labData }) => {
  const navigate = useNavigate();
  const [expandedLabs, setExpandedLabs] = useState(['LAB-A', 'LAB-B', 'LAB-C']);

  const toggleLab = (labId) => {
    setExpandedLabs((prev) =>
      prev.includes(labId) ? prev.filter((id) => id !== labId) : [...prev, labId]
    );
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'good':
        return <CheckCircle sx={{ fontSize: 16, color: APP_CONFIG.THEME.STATUS_GOOD }} />;
      case 'critical':
        return <Warning sx={{ fontSize: 16, color: APP_CONFIG.THEME.STATUS_WARNING }} />;
      case 'warning':
        return <Warning sx={{ fontSize: 16, color: APP_CONFIG.THEME.STATUS_WARNING }} />;
      case 'dead':
        return <Error sx={{ fontSize: 16, color: APP_CONFIG.THEME.STATUS_CRITICAL }} />;
      default:
        return <Circle sx={{ fontSize: 16, color: APP_CONFIG.THEME.TEXT_TERTIARY }} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'good':
        return APP_CONFIG.THEME.STATUS_GOOD;
      case 'critical':
        return APP_CONFIG.THEME.STATUS_WARNING;
      case 'warning':
        return APP_CONFIG.THEME.STATUS_WARNING;
      case 'dead':
        return APP_CONFIG.THEME.STATUS_CRITICAL;
      default:
        return APP_CONFIG.THEME.TEXT_TERTIARY;
    }
  };

  return (
    <Box
      sx={{
        height: '100%',
        background: APP_CONFIG.THEME.GLASS_BG,
        backdropFilter: APP_CONFIG.THEME.GLASS_BLUR,
        borderRadius: 3,
        border: `1px solid ${APP_CONFIG.THEME.GLASS_BORDER}`,
        p: 2.5,
        overflow: 'auto',
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '3px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: APP_CONFIG.THEME.PRIMARY_GREEN,
          borderRadius: '3px',
          '&:hover': {
            background: APP_CONFIG.THEME.DARK_GREEN,
          },
        },
      }}
    >
      {/* Panel Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            <Science sx={{ fontSize: 28, color: APP_CONFIG.THEME.PRIMARY_GREEN }} />
          </motion.div>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: APP_CONFIG.THEME.TEXT_PRIMARY,
              textTransform: 'uppercase',
              letterSpacing: 1,
            }}
          >
            Lab Hierarchy
          </Typography>
        </Box>
        <Typography
          variant="caption"
          sx={{
            color: APP_CONFIG.THEME.TEXT_TERTIARY,
            display: 'block',
            fontSize: '11px',
          }}
        >
          {labData.summary.totalLabs} Labs • {labData.summary.totalTestBenches} Test Benches •{' '}
          {labData.summary.totalDevices} Devices
        </Typography>
      </Box>

      {/* Summary Stats */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 1.5,
          mb: 3,
        }}
      >
        <motion.div whileHover={{ scale: 1.05 }}>
          <Box
            sx={{
              p: 1.5,
              background: APP_CONFIG.THEME.BG_GRADIENT_CARD,
              borderRadius: 2,
              border: `1px solid ${APP_CONFIG.THEME.GLASS_BORDER}`,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: APP_CONFIG.THEME.TEXT_TERTIARY,
                fontSize: '10px',
                textTransform: 'uppercase',
                display: 'block',
                mb: 0.5,
              }}
            >
              Active Devices
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                color: APP_CONFIG.THEME.PRIMARY_GREEN,
              }}
            >
              {labData.summary.activeDevices}
            </Typography>
          </Box>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }}>
          <Box
            sx={{
              p: 1.5,
              background: APP_CONFIG.THEME.BG_GRADIENT_CARD,
              borderRadius: 2,
              border: `1px solid ${APP_CONFIG.THEME.GLASS_BORDER}`,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: APP_CONFIG.THEME.TEXT_TERTIARY,
                fontSize: '10px',
                textTransform: 'uppercase',
                display: 'block',
                mb: 0.5,
              }}
            >
              Utilization
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                color: APP_CONFIG.THEME.PRIMARY_GREEN,
              }}
            >
              {labData.summary.overallUtilization}%
            </Typography>
          </Box>
        </motion.div>
      </Box>

      {/* Lab Tree */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {labData.labs.map((lab, labIndex) => (
          <motion.div
            key={lab.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: labIndex * 0.1 }}
          >
            <Box>
              {/* Lab Header */}
              <Box
                onClick={() => toggleLab(lab.id)}
                sx={{
                  p: 1.5,
                  background: `linear-gradient(135deg, ${APP_CONFIG.THEME.GLASS_BG} 0%, rgba(61, 205, 88, 0.05) 100%)`,
                  borderRadius: 2,
                  border: `1px solid ${APP_CONFIG.THEME.GLASS_BORDER}`,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: `linear-gradient(135deg, rgba(61, 205, 88, 0.1) 0%, rgba(61, 205, 88, 0.05) 100%)`,
                    borderColor: APP_CONFIG.THEME.PRIMARY_GREEN,
                    transform: 'translateX(4px)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  {expandedLabs.includes(lab.id) ? (
                    <ExpandMore sx={{ fontSize: 18, color: APP_CONFIG.THEME.TEXT_SECONDARY }} />
                  ) : (
                    <ChevronRight sx={{ fontSize: 18, color: APP_CONFIG.THEME.TEXT_SECONDARY }} />
                  )}
                  <Science sx={{ fontSize: 18, color: APP_CONFIG.THEME.PRIMARY_GREEN }} />
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 700,
                      color: APP_CONFIG.THEME.TEXT_PRIMARY,
                      flex: 1,
                    }}
                  >
                    {lab.name}
                  </Typography>
                  {getStatusIcon(lab.status)}
                </Box>

                <Typography
                  variant="caption"
                  sx={{
                    color: APP_CONFIG.THEME.TEXT_TERTIARY,
                    fontSize: '10px',
                    display: 'block',
                    ml: 4.5,
                  }}
                >
                  {lab.location} • {lab.utilization}% utilized
                </Typography>
              </Box>

              {/* Test Benches */}
              <Collapse in={expandedLabs.includes(lab.id)} timeout="auto">
                <Box sx={{ ml: 3, mt: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {lab.testBenches.map((bench, benchIndex) => (
                    <motion.div
                      key={bench.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: benchIndex * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <Box
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/testbench/${bench.id}`);
                        }}
                        sx={{
                          p: 1.5,
                          background: 'rgba(255, 255, 255, 0.03)',
                          borderRadius: 1.5,
                          borderLeft: `3px solid ${getStatusColor(bench.status)}`,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            background: 'rgba(61, 205, 88, 0.08)',
                            transform: 'translateX(4px)',
                          },
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Computer
                            sx={{
                              fontSize: 16,
                              color: APP_CONFIG.THEME.TEXT_SECONDARY,
                            }}
                          />
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: 600,
                              color: APP_CONFIG.THEME.TEXT_PRIMARY,
                              flex: 1,
                              fontSize: '12px',
                            }}
                          >
                            {bench.name}
                          </Typography>
                          {bench.alerts > 0 && (
                            <motion.div
                              animate={{
                                scale: [1, 1.2, 1],
                                opacity: [1, 0.6, 1],
                              }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            >
                              <Box
                                sx={{
                                  px: 0.8,
                                  py: 0.3,
                                  backgroundColor: APP_CONFIG.THEME.STATUS_CRITICAL,
                                  borderRadius: 1,
                                  fontSize: '9px',
                                  fontWeight: 800,
                                  color: APP_CONFIG.THEME.WHITE,
                                }}
                              >
                                {bench.alerts}
                              </Box>
                            </motion.div>
                          )}
                        </Box>

                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            ml: 2.5,
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              color: APP_CONFIG.THEME.TEXT_TERTIARY,
                              fontSize: '10px',
                            }}
                          >
                            {bench.activeDevices}/{bench.totalDevices} devices
                          </Typography>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5,
                            }}
                          >
                            <Box
                              sx={{
                                width: 40,
                                height: 4,
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                borderRadius: 2,
                                overflow: 'hidden',
                              }}
                            >
                              <Box
                                sx={{
                                  width: `${bench.utilization}%`,
                                  height: '100%',
                                  backgroundColor: APP_CONFIG.THEME.PRIMARY_GREEN,
                                  transition: 'width 0.5s ease',
                                }}
                              />
                            </Box>
                            <Typography
                              variant="caption"
                              sx={{
                                color: APP_CONFIG.THEME.PRIMARY_GREEN,
                                fontSize: '10px',
                                fontWeight: 700,
                              }}
                            >
                              {bench.utilization}%
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </motion.div>
                  ))}
                </Box>
              </Collapse>
            </Box>
          </motion.div>
        ))}
      </Box>
    </Box>
  );
};

export default LabHierarchyPanel;
