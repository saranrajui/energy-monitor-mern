import React, { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import * as d3 from 'd3';
import { motion } from 'framer-motion';
import { APP_CONFIG } from '../constants/appConfig';

const AnimatedNetworkVisualizationD3 = ({ devices, onDeviceClick, selectedDeviceId }) => {
  const svgRef = useRef(null);
  const simulationRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [isLargeGraph, setIsLargeGraph] = useState(false);

  // Status color mapping
  const getStatusColor = (status) => {
    const colors = {
      active: '#10b981',
      warning: '#fbbf24',
      critical: '#ef4444',
      dead: '#6b7280',
    };
    return colors[status] || '#818cf8';
  };

  // Calculate node radius based on importance
  const getNodeRadius = (device) => {
    const baseRadius = 20;
    const consumerBonus = (device.activeConsumers || 0) * 2;
    const energyBonus = (device.energyUsage || 0) / 10;
    return Math.min(baseRadius + consumerBonus + energyBonus * 0.5, 45);
  };

  useEffect(() => {
    if (!devices || devices.length === 0) return;

    // Detect large graph for performance optimizations
    const largeGraph = devices.length > 50;
    setIsLargeGraph(largeGraph);

    // Clear previous simulation
    if (simulationRef.current) {
      simulationRef.current.stop();
    }

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous content

    const width = dimensions.width;
    const height = dimensions.height;

    // Create main group for zoom/pan
    const g = svg.append('g').attr('class', 'main-group');

    // Add zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Prepare nodes and links data
    const nodes = devices.map((device) => ({
      id: device.id,
      ...device,
      radius: getNodeRadius(device),
    }));

    // Create links based on parent-child hierarchy using parentId
    const links = [];
    devices.forEach((device) => {
      if (device.parentId) {
        links.push({
          source: device.parentId,
          target: device.id,
          dataFlow: device.dataFlow || 0,
        });
      }
    });

    // Create force simulation with adaptive parameters for large graphs
    const simulation = d3
      .forceSimulation(nodes)
      .force(
        'link',
        d3
          .forceLink(links)
          .id((d) => d.id)
          .distance(largeGraph ? 80 : 100) // Shorter distances for large graphs
          .strength(largeGraph ? 0.3 : 0.5) // Weaker links for large graphs
      )
      .force('charge', d3.forceManyBody().strength(largeGraph ? -200 : -300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force(
        'collision',
        d3.forceCollide().radius((d) => d.radius + (largeGraph ? 5 : 10))
      )
      .force('x', d3.forceX(width / 2).strength(0.05))
      .force('y', d3.forceY(height / 2).strength(0.05))
      .alphaDecay(largeGraph ? 0.05 : 0.0228) // Faster settling for large graphs
      .velocityDecay(largeGraph ? 0.6 : 0.4); // More damping for large graphs

    simulationRef.current = simulation;

    // Create arrow markers for links
    g.append('defs')
      .selectAll('marker')
      .data(['active', 'warning', 'critical', 'dead'])
      .join('marker')
      .attr('id', (d) => `arrow-${d}`)
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 20)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('fill', (d) => getStatusColor(d))
      .attr('d', 'M0,-5L10,0L0,5');

    // Create gradient definitions for glow effects
    const defs = g.append('defs');
    ['active', 'warning', 'critical', 'dead'].forEach((status) => {
      const gradient = defs
        .append('radialGradient')
        .attr('id', `glow-${status}`);
      gradient
        .append('stop')
        .attr('offset', '0%')
        .attr('stop-color', getStatusColor(status))
        .attr('stop-opacity', 0.8);
      gradient
        .append('stop')
        .attr('offset', '100%')
        .attr('stop-color', getStatusColor(status))
        .attr('stop-opacity', 0);
    });

    // Create links
    const link = g
      .append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', (d) => {
        const sourceNode = nodes.find((n) => n.id === d.source.id || n.id === d.source);
        return getStatusColor(sourceNode?.status || 'active');
      })
      .attr('stroke-opacity', 0.4)
      .attr('stroke-width', 2)
      .attr('marker-end', (d) => {
        const sourceNode = nodes.find((n) => n.id === d.source.id || n.id === d.source);
        return `url(#arrow-${sourceNode?.status || 'active'})`;
      });

    // Create particle groups for data flow animation
    const particleGroups = g
      .append('g')
      .attr('class', 'particles')
      .selectAll('g')
      .data(links)
      .join('g');

    // Add particles for each link - reduce particles for large graphs
    particleGroups.each(function (d) {
      const particleCount = largeGraph ? 2 : 3; // Fewer particles for performance
      for (let i = 0; i < particleCount; i++) {
        d3.select(this)
          .append('circle')
          .attr('r', largeGraph ? 1.5 : 2) // Smaller particles for large graphs
          .attr('fill', () => {
            const sourceNode = nodes.find((n) => n.id === d.source.id || n.id === d.source);
            return getStatusColor(sourceNode?.status || 'active');
          })
          .attr('opacity', 0.8)
          .attr('class', 'particle');
      }
    });

    // Create node groups
    const node = g
      .append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .attr('class', 'node')
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        event.stopPropagation();
        onDeviceClick(d);
      });

    // Add glow circles for active devices
    node
      .filter((d) => d.status === 'active' || d.status === 'warning')
      .append('circle')
      .attr('r', (d) => d.radius + 8)
      .attr('fill', (d) => `url(#glow-${d.status})`)
      .attr('class', 'glow-circle');

    // Add main node circles
    node
      .append('circle')
      .attr('r', (d) => d.radius)
      .attr('fill', (d) => getStatusColor(d.status))
      .attr('stroke', (d) =>
        selectedDeviceId === d.id ? APP_CONFIG.THEME.PRIMARY_GREEN : '#ffffff'
      )
      .attr('stroke-width', (d) => (selectedDeviceId === d.id ? 4 : 2))
      .attr('class', 'main-circle');

    // Add pulsing effect for critical devices
    node
      .filter((d) => d.status === 'critical')
      .select('.main-circle')
      .append('animate')
      .attr('attributeName', 'r')
      .attr('values', (d) => `${d.radius};${d.radius + 5};${d.radius}`)
      .attr('dur', '2s')
      .attr('repeatCount', 'indefinite');

    // Add breathing glow for active devices
    node
      .filter((d) => d.status === 'active')
      .select('.glow-circle')
      .append('animate')
      .attr('attributeName', 'r')
      .attr('values', (d) => `${d.radius + 8};${d.radius + 12};${d.radius + 8}`)
      .attr('dur', '3s')
      .attr('repeatCount', 'indefinite');

    // Add device labels
    node
      .append('text')
      .text((d) => d.name.split(' ')[0])
      .attr('text-anchor', 'middle')
      .attr('dy', (d) => d.radius + 15)
      .attr('fill', '#ffffff')
      .attr('font-size', '10px')
      .attr('font-weight', 600)
      .style('pointer-events', 'none');

    // Add active consumer count badge
    node
      .filter((d) => d.activeConsumers > 0)
      .append('circle')
      .attr('r', 8)
      .attr('cx', (d) => d.radius - 5)
      .attr('cy', (d) => -d.radius + 5)
      .attr('fill', APP_CONFIG.THEME.PRIMARY_GREEN)
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 1.5);

    node
      .filter((d) => d.activeConsumers > 0)
      .append('text')
      .text((d) => d.activeConsumers)
      .attr('x', (d) => d.radius - 5)
      .attr('y', (d) => -d.radius + 5)
      .attr('text-anchor', 'middle')
      .attr('dy', '0.3em')
      .attr('fill', '#ffffff')
      .attr('font-size', '9px')
      .attr('font-weight', 700)
      .style('pointer-events', 'none');

    // Drag behavior with spring physics
    const drag = d3
      .drag()
      .on('start', (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on('end', (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        // Keep the node fixed at dragged position (comment out next 2 lines for free-floating)
        // d.fx = null;
        // d.fy = null;
      });

    node.call(drag);

    // Update positions on each tick with performance optimization for large graphs
    let tickCounter = 0;
    simulation.on('tick', () => {
      tickCounter++;

      // Update links
      link
        .attr('x1', (d) => d.source.x)
        .attr('y1', (d) => d.source.y)
        .attr('x2', (d) => d.target.x)
        .attr('y2', (d) => d.target.y);

      // Update nodes
      node.attr('transform', (d) => `translate(${d.x},${d.y})`);

      // Animate particles along links - throttle for large graphs (every 2nd tick)
      if (!largeGraph || tickCounter % 2 === 0) {
        particleGroups.each(function (d) {
          const particles = d3.select(this).selectAll('.particle');
          const particleCount = largeGraph ? 2 : 3;
          particles.each(function (_, i) {
            const particle = d3.select(this);
            const duration = 2000;
            const offset = (i / particleCount) * duration;
            const elapsed = (Date.now() + offset) % duration;
            const t = elapsed / duration;

            const x = d.source.x + (d.target.x - d.source.x) * t;
            const y = d.source.y + (d.target.y - d.source.y) * t;

            particle.attr('cx', x).attr('cy', y);
          });
        });
      }
    });

    // Clean up on unmount
    return () => {
      if (simulationRef.current) {
        simulationRef.current.stop();
      }
    };
  }, [devices, selectedDeviceId, dimensions, onDeviceClick]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const container = svgRef.current?.parentElement;
      if (container) {
        setDimensions({
          width: container.clientWidth,
          height: container.clientHeight,
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      style={{ width: '100%', height: '100%' }}
    >
      <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          style={{
            background: 'transparent',
            borderRadius: '8px',
          }}
        />

        {/* Zoom Controls */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 16,
            right: 16,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            background: 'rgba(15, 20, 35, 0.8)',
            backdropFilter: 'blur(10px)',
            borderRadius: 2,
            p: 1,
            border: `1px solid ${APP_CONFIG.THEME.GLASS_BORDER}`,
          }}
        >
          <Box
            sx={{
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 1,
              background: 'rgba(61, 205, 88, 0.2)',
              color: APP_CONFIG.THEME.PRIMARY_GREEN,
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '18px',
              '&:hover': {
                background: 'rgba(61, 205, 88, 0.3)',
              },
            }}
            onClick={() => {
              const svg = d3.select(svgRef.current);
              svg.transition().call(d3.zoom().scaleBy, 1.3);
            }}
          >
            +
          </Box>
          <Box
            sx={{
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 1,
              background: 'rgba(61, 205, 88, 0.2)',
              color: APP_CONFIG.THEME.PRIMARY_GREEN,
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '18px',
              '&:hover': {
                background: 'rgba(61, 205, 88, 0.3)',
              },
            }}
            onClick={() => {
              const svg = d3.select(svgRef.current);
              svg.transition().call(d3.zoom().scaleBy, 0.7);
            }}
          >
            −
          </Box>
          <Box
            sx={{
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 1,
              background: 'rgba(61, 205, 88, 0.2)',
              color: APP_CONFIG.THEME.PRIMARY_GREEN,
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '10px',
              '&:hover': {
                background: 'rgba(61, 205, 88, 0.3)',
              },
            }}
            onClick={() => {
              const svg = d3.select(svgRef.current);
              svg
                .transition()
                .call(
                  d3.zoom().transform,
                  d3.zoomIdentity.translate(0, 0).scale(1)
                );
            }}
          >
            ⟲
          </Box>
        </Box>

        {/* Legend */}
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            left: 16,
            background: 'rgba(15, 20, 35, 0.8)',
            backdropFilter: 'blur(10px)',
            borderRadius: 2,
            p: 1.5,
            border: `1px solid ${APP_CONFIG.THEME.GLASS_BORDER}`,
          }}
        >
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {[
              { status: 'active', label: 'Active' },
              { status: 'warning', label: 'Warning' },
              { status: 'critical', label: 'Critical' },
              { status: 'dead', label: 'Offline' },
            ].map((item) => (
              <Box
                key={item.status}
                sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
              >
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    background: getStatusColor(item.status),
                  }}
                />
                <Box
                  sx={{
                    color: '#ffffff',
                    fontSize: '10px',
                    fontWeight: 600,
                  }}
                >
                  {item.label}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Instructions */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 16,
            left: 16,
            background: 'rgba(15, 20, 35, 0.8)',
            backdropFilter: 'blur(10px)',
            borderRadius: 2,
            p: 1.5,
            border: `1px solid ${APP_CONFIG.THEME.GLASS_BORDER}`,
          }}
        >
          <Box sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '10px' }}>
            <div>• Click & drag nodes to reposition</div>
            <div>• Scroll or use controls to zoom</div>
            <div>• Drag background to pan</div>
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
};

export default AnimatedNetworkVisualizationD3;
