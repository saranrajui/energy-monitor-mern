# Network Visualization - Multi-Layout System

## Overview
The new `NetworkVisualizationMultiLayout` component provides **4 different visualization layouts** with interactive controls, allowing users to choose the best view for their needs.

---

## 🎨 Available Layouts

### 1. **Hierarchical Tree Layout** (DEFAULT - RECOMMENDED)
```
                    Gateway (Level 1)
                       |
        +--------------+--------------+
        |              |              |
     Switch1       Switch2         Switch3  (Level 2)
        |              |              |
    +---+---+      +---+---+      +---+---+
    |   |   |      |   |   |      |   |   |
   R1  R2  R3     M1  M2  M3     S1  S2  S3  (Level 3+)
```

**Best for:**
- ✅ Clear parent-child relationships
- ✅ Understanding equipment hierarchy (Gateway → Switch → Device)
- ✅ Tracing energy flow from source to endpoint
- ✅ Multi-level deep structures (n-levels)

**Features:**
- Top-to-bottom layout
- Color-coded by device status
- Node size based on energy consumption
- Clean, organized structure

---

### 2. **Radial Tree Layout**
```
           Concentric circles radiating from center
           - Center: Gateway
           - Ring 1: Switches
           - Ring 2: Relays/Meters
           - Ring 3+: End devices
```

**Best for:**
- ✅ Space-efficient visualization
- ✅ Dashboard presentations
- ✅ Showing hierarchy via distance from center
- ✅ Symmetric network structures

**Features:**
- Circular/radial arrangement
- Depth shown by radius from center
- Visually appealing
- Good for limited screen space

---

### 3. **Sankey Energy Flow Diagram**
```
Gateway ════════════════╗
  ||                    ║
  ╠══► Switch 1 (40%) ══╣══► Active Devices
  ║                     ║
  ╠══► Switch 2 (35%) ══╣══► Idle Devices (wasting energy)
  ║                     ║
  ╚══► Switch 3 (25%) ══╝══► Critical Devices
```

**Best for:**
- ✅ **Visualizing energy consumption magnitude**
- ✅ Identifying energy waste
- ✅ Understanding data flow patterns
- ✅ Power distribution analysis

**Features:**
- Flow thickness = energy consumption
- Left-to-right flow by device level
- Highlights high-consumption paths
- Perfect for energy optimization insights

---

### 4. **Force-Directed Graph** (Original)
```
     Nodes positioned by physics simulation
     - Active repulsion between nodes
     - Link attraction between connected devices
     - Natural clustering of related equipment
```

**Best for:**
- ✅ Exploring complex networks interactively
- ✅ Finding clusters and patterns
- ✅ Organic, self-organizing layout
- ✅ Draggable nodes for custom arrangement

**Features:**
- Physics-based simulation
- Drag and drop nodes
- Dynamic repositioning
- Natural grouping

---

## 🎮 Interactive Controls

### Layout Selector (Dropdown)
- Switch between 4 layout types instantly
- Located in top-right control panel
- Smooth transitions between layouts
- Remembers selected device across layout changes

### Zoom Controls
- **Zoom In** (+) - Magnify view
- **Zoom Out** (-) - See more of the network
- **Reset View** (↻) - Return to default zoom/pan
- Smooth zoom transitions

### Fullscreen Mode
- **Fullscreen** (⛶) - Expand to full screen
- **Exit Fullscreen** (⛶) - Return to normal view
- Perfect for presentations or detailed analysis
- Works with all layouts

### Pan & Navigate
- Click and drag background to pan
- Mouse wheel to zoom in/out
- Click device to see details in right panel

---

## 🎨 Visual Features

### Color Coding by Status
- 🟢 **Green** - Active devices (operating normally)
- 🟡 **Yellow** - Warning (attention needed)
- 🔴 **Red** - Critical/Idle (wasting energy)
- ⚫ **Gray** - Dead devices (offline)

### Node Sizing
- Node size = f(energy consumption, active consumers)
- Larger nodes = higher energy usage
- Immediate visual identification of power-hungry devices

### Connection Lines
- Color matches target device status
- Thickness shows data flow (Sankey layout)
- Animated flow indicators (optional)
- Semi-transparent for clarity

### Interactive Highlights
- Selected device glows with white border
- Hover effects on all interactive elements
- Smooth animations on layout transitions

---

## 📊 Status Legend
Always visible in bottom-left corner:
- Active (green circle)
- Warning (yellow circle)
- Critical/Idle (red circle)
- Dead (gray circle)

---

## 🚀 Usage

```jsx
import NetworkVisualizationMultiLayout from './NetworkVisualizationMultiLayout';

<NetworkVisualizationMultiLayout
  devices={testBenchData.devices}
  onDeviceClick={handleDeviceClick}
  selectedDeviceId={selectedDevice?.id}
/>
```

---

## 🔧 Technical Details

### Performance Optimizations
- Automatic detection of large graphs (>50 nodes)
- Adaptive force parameters for large networks
- Efficient D3.js rendering
- Smooth 60fps animations

### Data Requirements
Each device should have:
```json
{
  "id": "unique-id",
  "name": "Device Name",
  "parentId": "parent-device-id",
  "level": 1,
  "status": "active|warning|critical|dead",
  "energyUsage": 45,
  "activeConsumers": 3,
  "dataFlow": 420,
  "type": "gateway|switch|relay|power_meter|sensor"
}
```

### Browser Compatibility
- Modern browsers with ES6+ support
- SVG rendering
- CSS transforms for animations
- Fullscreen API (optional, degrades gracefully)

---

## 🎯 Best Practices

1. **For Energy Analysis** → Use Sankey Layout
2. **For Understanding Structure** → Use Hierarchical Tree
3. **For Presentations** → Use Radial or Hierarchical + Fullscreen
4. **For Exploration** → Use Force-Directed
5. **For Deep Hierarchies (5+ levels)** → Use Hierarchical Tree

---

## 📈 Future Enhancements

Potential additions:
- [ ] Time-series animation (show energy flow over time)
- [ ] Heatmap overlay (show temperature/load)
- [ ] Export as image (PNG/SVG)
- [ ] Mini-map for large networks
- [ ] Filter by device type/status
- [ ] Path highlighting (trace from root to selected device)
- [ ] Comparison mode (side-by-side layouts)

---

## 🐛 Troubleshooting

**Issue**: Nodes overlap in Tree layout
- **Solution**: Layout automatically spaces nodes, but may need manual adjustment for very wide trees

**Issue**: Fullscreen not working
- **Solution**: Browser security requires user interaction; ensure button is clicked, not programmatically triggered

**Issue**: Slow performance with many nodes
- **Solution**: Component automatically optimizes for >50 nodes; consider filtering/grouping for 500+ nodes

---

**Built with:** React, D3.js, Material-UI, Framer Motion
**Component:** `NetworkVisualizationMultiLayout.jsx`
**Author:** Energy Twin Team
**Version:** 1.0.0
