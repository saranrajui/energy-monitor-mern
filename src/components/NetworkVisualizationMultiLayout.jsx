import React, { useEffect, useRef, useState } from 'react';
import { Box, IconButton, Select, MenuItem, FormControl, Tooltip, Typography, Popper, Paper, Fade } from '@mui/material';
import * as d3 from 'd3';
import { motion } from 'framer-motion';
import { APP_CONFIG } from '../constants/appConfig';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import DeviceDetailsPanel from './DeviceDetailsPanel';

const LAYOUT_TYPES = {
  HIERARCHICAL_FORCE: 'hierarchical_force', // New default: hierarchy + physics
  FORCE: 'force',
  TREE: 'tree',
  RADIAL: 'radial',
  SANKEY: 'sankey',
};

const NetworkVisualizationMultiLayout = ({ devices, onDeviceClick, selectedDeviceId }) => {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const simulationRef = useRef(null);
  const zoomRef = useRef(null);
  const linksRef = useRef([]);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [layoutType, setLayoutType] = useState(LAYOUT_TYPES.HIERARCHICAL_FORCE);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLargeGraph, setIsLargeGraph] = useState(false);
  const [hoveredDevice, setHoveredDevice] = useState(null);
  const [clickedDevice, setClickedDevice] = useState(null);
  const [tooltipAnchor, setTooltipAnchor] = useState(null);
  const [tooltipDevice, setTooltipDevice] = useState(null);

  // Status color mapping
  const getStatusColor = (status) => {
    const colors = {
      active: '#10b981',
      warning: '#fbbf24',
      critical: '#ef4444',
      dead: '#6b7280',
      idle: '#ef4444',
    };
    return colors[status] || '#818cf8';
  };

  // Calculate node radius based on importance (RESPONSIVE SIZES)
  const getNodeRadius = (device) => {
    // Scale factor based on fullscreen mode - LARGER in fullscreen
    const scaleFactor = isFullscreen ? 2.0 : 1.0;

    // Reduced sizes for all nodes
    if (device.type === 'load_bank') {
      const baseSize = layoutType === LAYOUT_TYPES.TREE ? 16 :
                       layoutType === LAYOUT_TYPES.HIERARCHICAL_FORCE ? 30 : 45;
      return baseSize * scaleFactor;
    }

    // Smaller base radius for hierarchical force layout
    const baseRadius = layoutType === LAYOUT_TYPES.HIERARCHICAL_FORCE ? 10 :
                       layoutType === LAYOUT_TYPES.TREE ? 8 : 20;
    const consumerBonus = (device.activeConsumers || device.consumers || 0) * 0.3;
    const energyBonus = (device.energyUsage || 0) / 30;

    const maxRadius = layoutType === LAYOUT_TYPES.HIERARCHICAL_FORCE ? 18 :
                      layoutType === LAYOUT_TYPES.TREE ? 15 : 45;

    return Math.min(baseRadius + consumerBonus + energyBonus * 0.3, maxRadius) * scaleFactor;
  };

  // Get device type icon/shape
  const getDeviceShape = (type) => {
    const shapes = {
      load_bank: 'hexagon',
      gateway: 'rect',
      switch: 'diamond',
      relay: 'circle',
      power_meter: 'circle',
      sensor: 'circle',
      default: 'circle',
    };
    return shapes[type] || shapes.default;
  };

  // Get connected node IDs (parent + children + device itself)
  const getConnectedNodeIds = (deviceId, allDevices) => {
    const device = allDevices.find(d => d.id === deviceId);
    if (!device) return new Set([deviceId]);

    const connected = new Set([deviceId]);

    // Add parent
    if (device.parentId) {
      connected.add(device.parentId);
    }

    // Add children
    allDevices.forEach(d => {
      if (d.parentId === deviceId) {
        connected.add(d.id);
      }
    });

    return connected;
  };

  // Get connected link IDs
  const getConnectedLinkIds = (deviceId, links) => {
    const connectedLinks = new Set();
    links.forEach((link, index) => {
      const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
      const targetId = typeof link.target === 'object' ? link.target.id : link.target;

      if (sourceId === deviceId || targetId === deviceId) {
        connectedLinks.add(index);
      }
    });
    return connectedLinks;
  };

  // Render node shape based on device type
  const renderNodeShape = (nodeGroup, data, selectedId) => {
    nodeGroup.each(function(d) {
      const node = d3.select(this);
      const shape = getDeviceShape(d.data.type);
      const radius = d.data.radius;
      const isSelected = d.data.id === selectedId;
      const color = getStatusColor(d.data.status);

      switch(shape) {
        case 'hexagon':
          // Create hexagon path for Load Bank
          const hexagonPoints = [];
          for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i - Math.PI / 2;
            hexagonPoints.push([
              radius * Math.cos(angle),
              radius * Math.sin(angle)
            ]);
          }
          node.append('path')
            .attr('d', `M${hexagonPoints.map(p => p.join(',')).join('L')}Z`)
            .attr('fill', color)
            .attr('stroke', isSelected ? '#fff' : color)
            .attr('stroke-width', isSelected ? 4 : 2)
            .attr('filter', isSelected ? 'url(#glow)' : 'none')
            .style('opacity', 0.9);
          break;

        case 'rect':
          // Rectangle for Gateway
          node.append('rect')
            .attr('x', -radius)
            .attr('y', -radius)
            .attr('width', radius * 2)
            .attr('height', radius * 2)
            .attr('fill', color)
            .attr('stroke', isSelected ? '#fff' : 'none')
            .attr('stroke-width', 3)
            .attr('filter', isSelected ? 'url(#glow)' : 'none');
          break;

        case 'diamond':
          // Diamond for Switch
          node.append('path')
            .attr('d', `M0,${-radius} L${radius},0 L0,${radius} L${-radius},0 Z`)
            .attr('fill', color)
            .attr('stroke', isSelected ? '#fff' : 'none')
            .attr('stroke-width', 3)
            .attr('filter', isSelected ? 'url(#glow)' : 'none');
          break;

        case 'circle':
        default:
          // Circle for other devices
          node.append('circle')
            .attr('r', radius)
            .attr('fill', color)
            .attr('stroke', isSelected ? '#fff' : 'none')
            .attr('stroke-width', 3)
            .attr('filter', isSelected ? 'url(#glow)' : 'none');
          break;
      }
    });
  };

  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      // Enter fullscreen
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      } else if (containerRef.current.webkitRequestFullscreen) {
        containerRef.current.webkitRequestFullscreen();
      } else if (containerRef.current.mozRequestFullScreen) {
        containerRef.current.mozRequestFullScreen();
      } else if (containerRef.current.msRequestFullscreen) {
        containerRef.current.msRequestFullscreen();
      }
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
    // State will be updated by fullscreen change event listener
  };

  // Handle zoom
  const handleZoom = (direction) => {
    const svg = d3.select(svgRef.current);
    const currentTransform = d3.zoomTransform(svg.node());
    const scaleFactor = direction === 'in' ? 1.3 : 0.7;

    svg.transition()
      .duration(300)
      .call(zoomRef.current.scaleTo, currentTransform.k * scaleFactor);
  };

  // Reset view
  const resetView = () => {
    const svg = d3.select(svgRef.current);
    svg.transition()
      .duration(750)
      .call(zoomRef.current.transform, d3.zoomIdentity);
  };

  // Apply path highlighting
  const applyPathHighlight = (deviceId) => {
    if (!deviceId) {
      // Reset all highlighting - restore original colors and widths (SKIP HUB LINKS)
      d3.selectAll('.node')
        .transition()
        .duration(200)
        .style('opacity', 1);

      d3.selectAll('.link')
        .each(function(d) {
          // CRITICAL: Skip hub links - they should never be affected
          if (d.isHubLink) return;

          const link = d3.select(this);
          // Get original stroke color from data
          const originalColor = d.color || getStatusColor(d.source?.data?.status || d.target?.data?.status || 'active');
          const originalWidth = d.originalWidth || 3;

          link
            .transition()
            .duration(200)
            .style('opacity', 0.7)
            .attr('stroke', originalColor)
            .attr('stroke-width', originalWidth);
        });

      d3.selectAll('.particle')
        .each(function(d, i) {
          // CRITICAL: Skip hub link particles
          if (d.isHubLink) return;

          d3.select(this)
            .transition()
            .duration(200)
            .style('opacity', 1);
        });
      return;
    }

    const connectedNodes = getConnectedNodeIds(deviceId, devices);
    const connectedLinks = getConnectedLinkIds(deviceId, linksRef.current);

    // Dim all nodes and links first
    d3.selectAll('.node')
      .transition()
      .duration(200)
      .style('opacity', d => {
        const nodeId = d.id || d.data?.id;
        return connectedNodes.has(nodeId) ? 1 : APP_CONFIG.THEME.DIMMED_OPACITY;
      });

    d3.selectAll('.link')
      .each(function(d, i) {
        // CRITICAL: Skip hub links - they should NEVER be dimmed or highlighted
        if (d.isHubLink) return;

        const link = d3.select(this);
        const isConnected = connectedLinks.has(i);

        // Store original values if not already stored
        if (!d.originalWidth) {
          d.originalWidth = parseFloat(link.attr('stroke-width') || 3);
        }
        if (!d.color) {
          d.color = link.attr('stroke');
        }

        const originalColor = d.color;
        const originalWidth = d.originalWidth;

        link
          .transition()
          .duration(200)
          .style('opacity', isConnected ? 1 : APP_CONFIG.THEME.DIMMED_OPACITY)
          .attr('stroke', isConnected ? APP_CONFIG.THEME.HIGHLIGHT_COLOR : originalColor)
          .attr('stroke-width', isConnected ? originalWidth * 1.5 : originalWidth);
      });

    d3.selectAll('.particle')
      .each(function(d, i) {
        // CRITICAL: Skip hub link particles
        if (d.isHubLink) return;

        const isConnected = connectedLinks.has(i);
        d3.select(this)
          .transition()
          .duration(200)
          .style('opacity', isConnected ? 1 : APP_CONFIG.THEME.DIMMED_OPACITY);
      });
  };

  // Handle node hover
  const handleNodeHover = (event, device) => {
    setHoveredDevice(device.id || device.data?.id);
    setTooltipDevice(device);
    // Create a virtual anchor element at mouse position for better tooltip positioning
    const virtualAnchor = {
      getBoundingClientRect: () => ({
        top: event.clientY,
        left: event.clientX,
        right: event.clientX,
        bottom: event.clientY,
        width: 0,
        height: 0,
        x: event.clientX,
        y: event.clientY,
      }),
    };
    setTooltipAnchor(virtualAnchor);
    applyPathHighlight(device.id || device.data?.id);
  };

  // Handle node hover end
  const handleNodeHoverEnd = () => {
    setHoveredDevice(null);
    setTooltipDevice(null);
    setTooltipAnchor(null);
    // Only reset highlight if no device is clicked
    if (!clickedDevice) {
      applyPathHighlight(null);
    } else {
      applyPathHighlight(clickedDevice);
    }
  };

  // Handle node click
  const handleNodeClick = (event, device) => {
    const deviceData = device.data || device;
    const deviceId = deviceData.id;

    if (clickedDevice === deviceId) {
      // Clicking same device again closes the panel
      setClickedDevice(null);
      applyPathHighlight(null);
    } else {
      setClickedDevice(deviceId);
      applyPathHighlight(deviceId);
      // Call parent's onDeviceClick
      onDeviceClick(deviceData);
    }
  };

  // Update dimensions on resize and fullscreen changes
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
      }
    };

    // Listen for fullscreen change events
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );
      setIsFullscreen(isCurrentlyFullscreen);
      // Small delay to ensure proper dimension calculation after fullscreen transition
      setTimeout(updateDimensions, 100);
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      window.removeEventListener('resize', updateDimensions);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  // Main visualization effect
  useEffect(() => {
    if (!devices || devices.length === 0) return;

    // Detect large graph
    const largeGraph = devices.length > 50;
    setIsLargeGraph(largeGraph);

    // Clear previous simulation
    if (simulationRef.current) {
      simulationRef.current.stop();
    }

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

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

    zoomRef.current = zoom;
    svg.call(zoom);

    // Prepare nodes and links
    const nodes = devices.map((device) => ({
      id: device.id,
      ...device,
      radius: getNodeRadius(device),
    }));

    // Find the hub/load_bank node
    const hubNode = devices.find(d => d.type === 'load_bank');
    const hubId = hubNode?.id;

    const links = [];
    devices.forEach((device) => {
      if (device.parentId) {
        links.push({
          source: device.parentId,
          target: device.id,
          dataFlow: device.dataFlow || 0,
          isHubLink: device.parentId === hubId || device.id === hubId, // Mark hub links
        });
      }
    });

    // Store links for path highlighting
    linksRef.current = links;

    // Render based on layout type
    switch (layoutType) {
      case LAYOUT_TYPES.HIERARCHICAL_FORCE:
        renderHierarchicalForceLayout(g, nodes, links, width, height, largeGraph);
        break;
      case LAYOUT_TYPES.TREE:
        renderTreeLayout(g, nodes, links, width, height);
        break;
      case LAYOUT_TYPES.RADIAL:
        renderRadialLayout(g, nodes, links, width, height);
        break;
      case LAYOUT_TYPES.SANKEY:
        renderSankeyLayout(g, nodes, links, width, height);
        break;
      case LAYOUT_TYPES.FORCE:
      default:
        renderForceLayout(g, nodes, links, width, height, largeGraph);
        break;
    }
  }, [devices, dimensions, layoutType, selectedDeviceId]);

  // Hierarchical Tree Layout
  const renderTreeLayout = (g, nodes, links, width, height) => {
    // Build hierarchy
    const root = d3.stratify()
      .id(d => d.id)
      .parentId(d => d.parentId || null)
      (nodes);

    // Create tree layout with better spacing in fullscreen
    const padding = isFullscreen ? 200 : 100;
    const treeLayout = d3.tree()
      .size([width - padding, height - padding])
      .separation((a, b) => (a.parent === b.parent ? 1 : 1.5));

    const treeData = treeLayout(root);

    // Center the tree with better margins
    const xOffset = padding / 2;
    const yOffset = padding / 2;

    // Draw links
    const link = g.selectAll('.link')
      .data(treeData.links())
      .join('path')
      .attr('class', 'link')
      .attr('d', d3.linkVertical()
        .x(d => d.x + xOffset)
        .y(d => d.y + yOffset))
      .attr('fill', 'none')
      .attr('stroke', (d) => {
        const targetStatus = d.target.data.status;
        return getStatusColor(targetStatus) + '60';
      })
      .attr('stroke-width', 2)
      .attr('opacity', 0.6);

    // Draw nodes
    const node = g.selectAll('.node')
      .data(treeData.descendants())
      .join('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.x + xOffset},${d.y + yOffset})`)
      .style('cursor', 'pointer')
      .on('mouseenter', (event, d) => handleNodeHover(event, d))
      .on('mouseleave', handleNodeHoverEnd)
      .on('click', (event, d) => handleNodeClick(event, d));

    // Render node shapes (circles, hexagons, diamonds, etc.)
    renderNodeShape(node, treeData.descendants(), selectedDeviceId);

    // Node labels with larger text in fullscreen
    node.append('text')
      .attr('dy', d => d.data.radius + (isFullscreen ? 18 : 15))
      .attr('text-anchor', 'middle')
      .attr('fill', APP_CONFIG.THEME.TEXT_PRIMARY)
      .attr('font-size', isFullscreen ? '13px' : '10px')
      .attr('font-weight', 600)
      .text(d => {
        const maxLength = isFullscreen ? 20 : 15;
        return d.data.name.length > maxLength ? d.data.name.substring(0, maxLength) + '...' : d.data.name;
      });

    // Add glow filter for selected node
    const defs = g.append('defs');
    const filter = defs.append('filter').attr('id', 'glow');
    filter.append('feGaussianBlur').attr('stdDeviation', 3.5).attr('result', 'coloredBlur');
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');
  };

  // Radial Tree Layout
  const renderRadialLayout = (g, nodes, links, width, height) => {
    const root = d3.stratify()
      .id(d => d.id)
      .parentId(d => d.parentId || null)
      (nodes);

    const padding = isFullscreen ? 150 : 100;
    const radius = Math.min(width, height) / 2 - padding;

    const tree = d3.tree()
      .size([2 * Math.PI, radius])
      .separation((a, b) => (a.parent === b.parent ? 1 : 2) / a.depth);

    const treeData = tree(root);

    const centerX = width / 2;
    const centerY = height / 2;

    // Draw links
    g.selectAll('.link')
      .data(treeData.links())
      .join('path')
      .attr('class', 'link')
      .attr('d', d3.linkRadial()
        .angle(d => d.x)
        .radius(d => d.y))
      .attr('transform', `translate(${centerX},${centerY})`)
      .attr('fill', 'none')
      .attr('stroke', d => getStatusColor(d.target.data.status) + '60')
      .attr('stroke-width', 2)
      .attr('opacity', 0.6);

    // Draw nodes
    const node = g.selectAll('.node')
      .data(treeData.descendants())
      .join('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${centerX + d.y * Math.cos(d.x - Math.PI / 2)},${centerY + d.y * Math.sin(d.x - Math.PI / 2)})`)
      .style('cursor', 'pointer')
      .on('mouseenter', (event, d) => handleNodeHover(event, d))
      .on('mouseleave', handleNodeHoverEnd)
      .on('click', (event, d) => handleNodeClick(event, d));

    // Render node shapes
    renderNodeShape(node, treeData.descendants(), selectedDeviceId);

    node.append('text')
      .attr('dy', d => d.data.radius + (isFullscreen ? 15 : 12))
      .attr('text-anchor', 'middle')
      .attr('fill', APP_CONFIG.THEME.TEXT_PRIMARY)
      .attr('font-size', isFullscreen ? '12px' : '9px')
      .attr('font-weight', 600)
      .text(d => {
        const maxLength = isFullscreen ? 16 : 12;
        return d.data.name.length > maxLength ? d.data.name.substring(0, maxLength) + '...' : d.data.name;
      });
  };

  // Sankey Layout (Energy Flow)
  const renderSankeyLayout = (g, nodes, links, width, height) => {
    // Group nodes by level
    const nodesByLevel = {};
    nodes.forEach(node => {
      const level = node.level || 0;
      if (!nodesByLevel[level]) nodesByLevel[level] = [];
      nodesByLevel[level].push(node);
    });

    const levels = Object.keys(nodesByLevel).sort((a, b) => a - b);
    const padding = isFullscreen ? 200 : 100;
    const levelWidth = (width - padding) / (levels.length - 1 || 1);

    // Position nodes with better spacing
    nodes.forEach(node => {
      const level = node.level || 0;
      const levelNodes = nodesByLevel[level];
      const index = levelNodes.indexOf(node);
      const levelHeight = height - padding;

      node.x = padding / 2 + level * levelWidth;
      node.y = padding / 2 + (levelHeight / (levelNodes.length + 1)) * (index + 1);
    });

    // Draw links as Sankey flows
    g.selectAll('.link')
      .data(links)
      .join('path')
      .attr('class', 'link')
      .attr('d', d => {
        const source = nodes.find(n => n.id === d.source);
        const target = nodes.find(n => n.id === (d.target.id || d.target));

        if (!source || !target) return '';

        const path = d3.path();
        path.moveTo(source.x, source.y);

        const midX = (source.x + target.x) / 2;
        path.bezierCurveTo(midX, source.y, midX, target.y, target.x, target.y);

        return path.toString();
      })
      .attr('fill', 'none')
      .attr('stroke', d => {
        const target = nodes.find(n => n.id === (d.target.id || d.target));
        return getStatusColor(target?.status) + '40';
      })
      .attr('stroke-width', d => Math.max(2, (d.dataFlow || 100) / 50))
      .attr('opacity', 0.6);

    // Draw nodes
    const node = g.selectAll('.node')
      .data(nodes)
      .join('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.x},${d.y})`)
      .style('cursor', 'pointer')
      .on('mouseenter', (event, d) => handleNodeHover(event, d))
      .on('mouseleave', handleNodeHoverEnd)
      .on('click', (event, d) => handleNodeClick(event, d));

    node.append('rect')
      .attr('x', -25)
      .attr('y', -10)
      .attr('width', 50)
      .attr('height', 20)
      .attr('rx', 4)
      .attr('fill', d => getStatusColor(d.status))
      .attr('stroke', d => d.id === selectedDeviceId ? '#fff' : 'none')
      .attr('stroke-width', 2);

    node.append('text')
      .attr('dy', isFullscreen ? 30 : 25)
      .attr('text-anchor', 'middle')
      .attr('fill', APP_CONFIG.THEME.TEXT_PRIMARY)
      .attr('font-size', isFullscreen ? '12px' : '9px')
      .attr('font-weight', 600)
      .text(d => {
        const maxLength = isFullscreen ? 20 : 15;
        return d.name.length > maxLength ? d.name.substring(0, maxLength) + '...' : d.name;
      });
  };

  // Hierarchical Force-Directed Layout (Combines structure + physics)
  const renderHierarchicalForceLayout = (g, nodes, links, width, height, largeGraph) => {
    // Step 1: Calculate hierarchical levels and group by type
    const nodesByLevel = {};
    nodes.forEach(node => {
      if (!node.level) {
        node.level = calculateNodeLevel(node, nodes);
      }
      if (!nodesByLevel[node.level]) {
        nodesByLevel[node.level] = [];
      }
      nodesByLevel[node.level].push(node);
    });

    const maxLevel = Math.max(...Object.keys(nodesByLevel).map(Number));

    // MASSIVELY EXPANDED spacing in fullscreen to fill the entire canvas
    // Calculate optimal spacing based on available width
    const horizontalPadding = isFullscreen ? 200 : 100;
    const availableWidth = width - (horizontalPadding * 2);
    const levelSpacing = maxLevel > 0 ? availableWidth / maxLevel : availableWidth;

    // Center the visualization horizontally
    const leftMargin = isFullscreen ? horizontalPadding : 80;

    // Step 2: Initialize nodes with hierarchical positions
    nodes.forEach(node => {
      const level = node.level;
      const levelNodes = nodesByLevel[level];
      const index = levelNodes.indexOf(node);

      // EXPANDED MARGINS: Much more breathing room in fullscreen
      const topMargin = isFullscreen ? 120 : 60;
      const bottomMargin = isFullscreen ? 120 : 60;
      const availableHeight = height - topMargin - bottomMargin;

      // Calculate optimal vertical spacing to distribute nodes evenly
      const verticalSpacing = levelNodes.length > 1
        ? availableHeight / (levelNodes.length - 1)
        : availableHeight / 2;

      // Position nodes with new spacing
      node.x = leftMargin + (levelSpacing * level);
      node.y = topMargin + (verticalSpacing * index);
    });

    // Step 3: Create force simulation with STRONG position forces for ZERO shake
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links)
        .id(d => d.id)
        .distance(d => {
          // Use dynamic distance based on actual level spacing
          return levelSpacing * 0.8;
        })
        .strength(0.1)) // Very weak link strength to prevent cascading movement
      .force('charge', d3.forceManyBody()
        .strength(isFullscreen ? -150 : -60) // Stronger repulsion in fullscreen for more spread
        .distanceMax(isFullscreen ? 400 : 150)) // Larger influence range in fullscreen
      .force('collision', d3.forceCollide()
        .radius(d => d.radius + (isFullscreen ? 25 : 8)) // More padding in fullscreen
        .strength(0.8)) // Collision to prevent overlap
      // VERY STRONG X-axis force to LOCK horizontal hierarchy (ZERO SHAKE)
      .force('x', d3.forceX(d => {
        const level = d.level || 0;
        return leftMargin + (levelSpacing * level);
      }).strength(1.5)) // Extremely strong force to lock horizontal position
      // VERY STRONG Y-axis force for vertical stability (ZERO SHAKE)
      .force('y', d3.forceY(d => {
        const level = d.level || 0;
        const levelNodes = nodesByLevel[level];
        const index = levelNodes.indexOf(d);
        const topMargin = isFullscreen ? 120 : 60;
        const bottomMargin = isFullscreen ? 120 : 60;
        const availableHeight = height - topMargin - bottomMargin;

        // Use same vertical spacing logic as initialization
        const vertSpacing = levelNodes.length > 1
          ? availableHeight / (levelNodes.length - 1)
          : availableHeight / 2;

        return topMargin + (vertSpacing * index);
      }).strength(1.5)) // Extremely strong Y force to lock vertical position
      .alphaDecay(0.08) // Very fast cooling for quick stabilization
      .velocityDecay(0.7) // Very high friction to kill momentum instantly
      .alphaMin(0.001); // Stop simulation sooner

    simulationRef.current = simulation;

    // Add glow filter for selected nodes
    const defs = g.append('defs');
    const filter = defs.append('filter')
      .attr('id', 'glow')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%');

    filter.append('feGaussianBlur')
      .attr('stdDeviation', '4')
      .attr('result', 'coloredBlur');

    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Add gradient definitions for animated data flow
    links.forEach((link, i) => {
      const target = typeof link.target === 'object' ? link.target : nodes.find(n => n.id === link.target);
      const gradient = defs.append('linearGradient')
        .attr('id', `flow-gradient-${i}`)
        .attr('gradientUnits', 'userSpaceOnUse');

      gradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', getStatusColor(target?.status))
        .attr('stop-opacity', 0.1);

      gradient.append('stop')
        .attr('offset', '50%')
        .attr('stop-color', getStatusColor(target?.status))
        .attr('stop-opacity', 0.8)
        .append('animate')
        .attr('attributeName', 'offset')
        .attr('values', '0;1')
        .attr('dur', '2s')
        .attr('repeatCount', 'indefinite');

      gradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', getStatusColor(target?.status))
        .attr('stop-opacity', 0.1);
    });

    // Draw links with THICKER lines and animated gradient
    const link = g.selectAll('.link')
      .data(links)
      .join('line')
      .attr('class', 'link')
      .attr('stroke', (d, i) => `url(#flow-gradient-${i})`)
      .attr('stroke-width', d => {
        // Much thicker links - more visible
        const dataFlow = d.dataFlow || 100;
        return Math.max(3, Math.min(6, dataFlow / 50)); // Minimum 3px, max 6px
      })
      .attr('opacity', 0.7) // More visible
      .style('pointer-events', 'none');

    // Add animated particles flowing along links for dynamic effect
    const particles = g.selectAll('.particle')
      .data(links)
      .join('circle')
      .attr('class', 'particle')
      .attr('r', 3)
      .attr('fill', d => {
        const target = typeof d.target === 'object' ? d.target : nodes.find(n => n.id === d.target);
        return getStatusColor(target?.status);
      })
      .style('pointer-events', 'none');

    // Draw nodes with shapes based on device type
    const node = g.selectAll('.node')
      .data(nodes)
      .join('g')
      .attr('class', 'node')
      .style('cursor', 'pointer')
      .on('mouseenter', (event, d) => handleNodeHover(event, d))
      .on('mouseleave', handleNodeHoverEnd)
      .on('click', (event, d) => {
        // Prevent click event from triggering during drag
        if (event.defaultPrevented) return;
        handleNodeClick(event, d);
      })
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    // Render node shapes (hexagon, rectangle, diamond, circle)
    node.each(function(d) {
      const nodeGroup = d3.select(this);
      const shape = getDeviceShape(d.type);
      const radius = d.radius;
      const isSelected = d.id === selectedDeviceId;
      const color = getStatusColor(d.status);

      switch(shape) {
        case 'hexagon':
          // Load Bank - Hexagon
          const hexagonPoints = [];
          for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i - Math.PI / 2;
            hexagonPoints.push([
              radius * Math.cos(angle),
              radius * Math.sin(angle)
            ]);
          }
          nodeGroup.append('path')
            .attr('d', `M${hexagonPoints.map(p => p.join(',')).join('L')}Z`)
            .attr('fill', color)
            .attr('stroke', isSelected ? '#fff' : color)
            .attr('stroke-width', isSelected ? 4 : 2)
            .attr('filter', isSelected ? 'url(#glow)' : 'none')
            .style('opacity', 0.9)
            .style('transition', 'all 0.3s ease');
          break;

        case 'rect':
          // Gateway - Rectangle
          nodeGroup.append('rect')
            .attr('x', -radius)
            .attr('y', -radius)
            .attr('width', radius * 2)
            .attr('height', radius * 2)
            .attr('rx', 4)
            .attr('fill', color)
            .attr('stroke', isSelected ? '#fff' : color)
            .attr('stroke-width', isSelected ? 4 : 2)
            .attr('filter', isSelected ? 'url(#glow)' : 'none')
            .style('opacity', 0.9);
          break;

        case 'diamond':
          // Switch - Diamond
          nodeGroup.append('path')
            .attr('d', `M0,${-radius} L${radius},0 L0,${radius} L${-radius},0 Z`)
            .attr('fill', color)
            .attr('stroke', isSelected ? '#fff' : color)
            .attr('stroke-width', isSelected ? 4 : 2)
            .attr('filter', isSelected ? 'url(#glow)' : 'none')
            .style('opacity', 0.9);
          break;

        case 'circle':
        default:
          // Other devices - Circle
          nodeGroup.append('circle')
            .attr('r', radius)
            .attr('fill', color)
            .attr('stroke', isSelected ? '#fff' : color)
            .attr('stroke-width', isSelected ? 4 : 2)
            .attr('filter', isSelected ? 'url(#glow)' : 'none')
            .style('opacity', 0.9);
          break;
      }

      // Add status indicator pulse for critical devices
      if (d.status === 'critical' || d.status === 'warning') {
        nodeGroup.append('circle')
          .attr('r', radius + 6)
          .attr('fill', 'none')
          .attr('stroke', color)
          .attr('stroke-width', 2)
          .attr('opacity', 0)
          .transition()
          .duration(1500)
          .ease(d3.easeLinear)
          .attr('r', radius + 15)
          .attr('opacity', 0)
          .on('end', function repeat() {
            d3.select(this)
              .attr('r', radius + 6)
              .attr('opacity', 0.6)
              .transition()
              .duration(1500)
              .ease(d3.easeLinear)
              .attr('r', radius + 15)
              .attr('opacity', 0)
              .on('end', repeat);
          });
      }
    });

    // Add labels with larger text in fullscreen
    node.append('text')
      .attr('dy', d => d.radius + (isFullscreen ? 18 : 14))
      .attr('text-anchor', 'middle')
      .attr('fill', APP_CONFIG.THEME.TEXT_PRIMARY)
      .attr('font-size', d => {
        const baseSize = d.type === 'load_bank' ? 11 : 9;
        return isFullscreen ? `${baseSize + 3}px` : `${baseSize}px`;
      })
      .attr('font-weight', d => d.type === 'load_bank' ? 700 : 600)
      .style('pointer-events', 'none')
      .text(d => {
        const maxLength = isFullscreen
          ? (d.type === 'load_bank' ? 25 : 18)
          : (d.type === 'load_bank' ? 18 : 12);
        return d.name.length > maxLength ? d.name.substring(0, maxLength) + '...' : d.name;
      });

    // Add status badge for devices with issues
    node.filter(d => d.status === 'critical' || d.status === 'warning')
      .append('circle')
      .attr('cx', d => d.radius * 0.7)
      .attr('cy', d => -d.radius * 0.7)
      .attr('r', 6)
      .attr('fill', '#ef4444')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);

    // Simulation tick with particle animation and SMOOTH transitions
    let tickCount = 0;
    let isInitialRender = true;

    simulation.on('tick', () => {
      tickCount++;

      // After initial stabilization, use very gentle transitions for smooth movement
      const shouldUseTransition = !isInitialRender && simulation.alpha() < 0.1;

      // Update links with smooth transition
      if (shouldUseTransition) {
        link
          .transition()
          .duration(100)
          .ease(d3.easeLinear)
          .attr('x1', d => d.source.x)
          .attr('y1', d => d.source.y)
          .attr('x2', d => d.target.x)
          .attr('y2', d => d.target.y);
      } else {
        link
          .attr('x1', d => d.source.x)
          .attr('y1', d => d.source.y)
          .attr('x2', d => d.target.x)
          .attr('y2', d => d.target.y);
      }

      // Update gradient positions for animation
      links.forEach((linkData, i) => {
        const gradient = defs.select(`#flow-gradient-${i}`);
        if (!gradient.empty()) {
          gradient
            .attr('x1', linkData.source.x)
            .attr('y1', linkData.source.y)
            .attr('x2', linkData.target.x)
            .attr('y2', linkData.target.y);
        }
      });

      // Animate particles along links (data flow effect)
      particles.attr('cx', (d, i) => {
        const t = (tickCount * 0.02 + i * 0.2) % 1; // Stagger particles
        return d.source.x + (d.target.x - d.source.x) * t;
      }).attr('cy', (d, i) => {
        const t = (tickCount * 0.02 + i * 0.2) % 1;
        return d.source.y + (d.target.y - d.source.y) * t;
      });

      // Update nodes with smooth transition after initial render
      if (shouldUseTransition) {
        node
          .transition()
          .duration(100)
          .ease(d3.easeLinear)
          .attr('transform', d => `translate(${d.x},${d.y})`);
      } else {
        node.attr('transform', d => `translate(${d.x},${d.y})`);
      }

      // Mark initial render complete after simulation stabilizes
      if (isInitialRender && simulation.alpha() < 0.05) {
        isInitialRender = false;
      }
    });

    // Drag functions with NO SHAKE - only affect the dragged node
    function dragstarted(event, d) {
      // CRITICAL FIX: Use minimal alphaTarget to prevent tree shaking
      // Only restart if simulation has completely stopped (alpha = 0)
      if (!event.active && simulation.alpha() < 0.01) {
        simulation.alphaTarget(0.01).restart();
      }
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      // Only move the dragged node
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      // Immediately stop any simulation movement
      if (!event.active) simulation.alphaTarget(0);
      // Release fixed position with very gentle return animation
      d.fx = null;
      d.fy = null;
    }
  };

  // Helper function to calculate node level in hierarchy
  const calculateNodeLevel = (node, allNodes) => {
    if (!node.parentId) return 0;
    const parent = allNodes.find(n => n.id === node.parentId);
    if (!parent) return 1;
    if (!parent.level) {
      parent.level = calculateNodeLevel(parent, allNodes);
    }
    return parent.level + 1;
  };

  // Force-Directed Layout (existing)
  const renderForceLayout = (g, nodes, links, width, height, largeGraph) => {
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links)
        .id(d => d.id)
        .distance(largeGraph ? 80 : 100)
        .strength(largeGraph ? 0.3 : 0.5))
      .force('charge', d3.forceManyBody().strength(largeGraph ? -200 : -300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(d => d.radius + (largeGraph ? 5 : 10)))
      .force('x', d3.forceX(width / 2).strength(0.05))
      .force('y', d3.forceY(height / 2).strength(0.05))
      .alphaDecay(largeGraph ? 0.05 : 0.0228);

    simulationRef.current = simulation;

    // Draw links
    const link = g.selectAll('.link')
      .data(links)
      .join('line')
      .attr('class', 'link')
      .attr('stroke', d => {
        const target = typeof d.target === 'object' ? d.target : nodes.find(n => n.id === d.target);
        return getStatusColor(target?.status) + '60';
      })
      .attr('stroke-width', 2)
      .attr('opacity', 0.6);

    // Draw nodes
    const node = g.selectAll('.node')
      .data(nodes)
      .join('g')
      .attr('class', 'node')
      .style('cursor', 'pointer')
      .on('mouseenter', (event, d) => handleNodeHover(event, d))
      .on('mouseleave', handleNodeHoverEnd)
      .on('click', (event, d) => handleNodeClick(event, d))
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    node.append('circle')
      .attr('r', d => d.radius)
      .attr('fill', d => getStatusColor(d.status))
      .attr('stroke', d => d.id === selectedDeviceId ? '#fff' : 'none')
      .attr('stroke-width', 3);

    node.append('text')
      .attr('dy', d => d.radius + 15)
      .attr('text-anchor', 'middle')
      .attr('fill', APP_CONFIG.THEME.TEXT_PRIMARY)
      .attr('font-size', '10px')
      .attr('font-weight', 600)
      .text(d => d.name.length > 15 ? d.name.substring(0, 15) + '...' : d.name);

    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      node.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  };

  return (
    <Box
      ref={containerRef}
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor: isFullscreen ? APP_CONFIG.THEME.BG_DARK_PRIMARY : 'transparent',
      }}
    >
      {/* Control Panel */}
      <Box
        sx={{
          position: 'absolute',
          top: 10,
          right: 10,
          zIndex: 10,
          display: 'flex',
          gap: 1,
          alignItems: 'center',
          backgroundColor: 'rgba(15, 20, 35, 0.9)',
          backdropFilter: 'blur(10px)',
          borderRadius: 2,
          padding: 1,
          border: `1px solid ${APP_CONFIG.THEME.GLASS_BORDER}`,
        }}
      >
        {/* Layout Selector */}
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <Select
            value={layoutType}
            onChange={(e) => setLayoutType(e.target.value)}
            sx={{
              color: APP_CONFIG.THEME.TEXT_PRIMARY,
              fontSize: '12px',
              '.MuiOutlinedInput-notchedOutline': {
                borderColor: APP_CONFIG.THEME.PRIMARY_GREEN,
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#2eb049',
              },
              '.MuiSvgIcon-root': {
                color: APP_CONFIG.THEME.PRIMARY_GREEN,
              },
            }}
          >
            <MenuItem value={LAYOUT_TYPES.HIERARCHICAL_FORCE}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccountTreeIcon sx={{ fontSize: 16 }} />
                Interactive Hierarchy
              </Box>
            </MenuItem>
            <MenuItem value={LAYOUT_TYPES.TREE}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccountTreeIcon sx={{ fontSize: 16 }} />
                Static Tree
              </Box>
            </MenuItem>
            <MenuItem value={LAYOUT_TYPES.RADIAL}>Radial Tree</MenuItem>
            <MenuItem value={LAYOUT_TYPES.SANKEY}>Energy Flow (Sankey)</MenuItem>
            <MenuItem value={LAYOUT_TYPES.FORCE}>Random Force</MenuItem>
          </Select>
        </FormControl>

        {/* Zoom Controls */}
        <Tooltip title="Zoom In">
          <IconButton
            size="small"
            onClick={() => handleZoom('in')}
            sx={{
              color: APP_CONFIG.THEME.PRIMARY_GREEN,
              '&:hover': { backgroundColor: 'rgba(61, 205, 88, 0.1)' },
            }}
          >
            <ZoomInIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Zoom Out">
          <IconButton
            size="small"
            onClick={() => handleZoom('out')}
            sx={{
              color: APP_CONFIG.THEME.PRIMARY_GREEN,
              '&:hover': { backgroundColor: 'rgba(61, 205, 88, 0.1)' },
            }}
          >
            <ZoomOutIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Reset View">
          <IconButton
            size="small"
            onClick={resetView}
            sx={{
              color: APP_CONFIG.THEME.PRIMARY_GREEN,
              '&:hover': { backgroundColor: 'rgba(61, 205, 88, 0.1)' },
            }}
          >
            <RestartAltIcon />
          </IconButton>
        </Tooltip>

        {/* Fullscreen Toggle */}
        <Tooltip title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}>
          <IconButton
            size="small"
            onClick={toggleFullscreen}
            sx={{
              color: APP_CONFIG.THEME.PRIMARY_GREEN,
              '&:hover': { backgroundColor: 'rgba(61, 205, 88, 0.1)' },
            }}
          >
            {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
          </IconButton>
        </Tooltip>
      </Box>

      {/* SVG Canvas */}
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: 'transparent',
        }}
      />

      {/* Legend - Top Left */}
      {/* <Box
        sx={{
          position: 'absolute',
          top: 10,
          left: 10,
          zIndex: 10,
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: 2,
          padding: 1.5,
          border: `1px solid ${APP_CONFIG.THEME.GLASS_BORDER}`,
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
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
          {[
            { status: 'active', label: 'Active' },
            { status: 'warning', label: 'Low' },
            { status: 'critical', label: 'Idle' },
            { status: 'dead', label: 'Offline' },
          ].map(({ status, label }) => (
            <Box key={status} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: getStatusColor(status),
                  border: `2px solid ${getStatusColor(status)}`,
                }}
              />
              <Typography
                sx={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '11px',
                  fontWeight: 600,
                }}
              >
                {label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box> */}

      {/* Tooltip */}
      <Popper
        open={Boolean(tooltipAnchor && tooltipDevice)}
        anchorEl={tooltipAnchor}
        placement="top"
        transition
        sx={{ zIndex: 1300, pointerEvents: 'none' }}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={200}>
            <Paper
              sx={{
                padding: 1.5,
                backgroundColor: APP_CONFIG.THEME.BG_DARK_SECONDARY,
                border: `1px solid ${APP_CONFIG.THEME.GLASS_BORDER}`,
                borderRadius: 1.5,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
                maxWidth: 250,
              }}
            >
              <Typography
                sx={{
                  color: APP_CONFIG.THEME.TEXT_PRIMARY,
                  fontSize: '13px',
                  fontWeight: 700,
                  mb: 0.5,
                }}
              >
                {(tooltipDevice?.data || tooltipDevice)?.name}
              </Typography>
              <Typography
                sx={{
                  color: APP_CONFIG.THEME.TEXT_SECONDARY,
                  fontSize: '11px',
                  mb: 0.5,
                }}
              >
                Type: {(tooltipDevice?.data || tooltipDevice)?.type?.replace('_', ' ').toUpperCase()}
              </Typography>
              <Box
                sx={{
                  display: 'inline-block',
                  padding: '2px 8px',
                  borderRadius: 1,
                  backgroundColor: getStatusColor((tooltipDevice?.data || tooltipDevice)?.status) + '30',
                  color: getStatusColor((tooltipDevice?.data || tooltipDevice)?.status),
                  fontSize: '10px',
                  fontWeight: 600,
                }}
              >
                {(tooltipDevice?.data || tooltipDevice)?.status?.toUpperCase()}
              </Box>
              <Typography
                sx={{
                  color: APP_CONFIG.THEME.TEXT_TERTIARY,
                  fontSize: '10px',
                  mt: 0.5,
                  fontStyle: 'italic',
                }}
              >
                Click for details
              </Typography>
            </Paper>
          </Fade>
        )}
      </Popper>

      {/* Device Details Panel */}
      {clickedDevice && (
        <DeviceDetailsPanel
          device={devices.find(d => d.id === clickedDevice)}
          allDevices={devices}
          onClose={() => {
            setClickedDevice(null);
            applyPathHighlight(null);
          }}
        />
      )}
    </Box>
  );
};

export default NetworkVisualizationMultiLayout;
