# Energy Digital Twin - Schneider Electric

A powerful React-based dashboard application for monitoring and managing test bench systems with real-time device status tracking and AI-powered insights.

## Features

### 🎨 Visual Highlights
- **Schneider Electric Branding**: Custom green theme (#3DCD58) with professional styling
- **Animated Widgets**: Eye-catching animations including:
  - Blinking alerts for critical devices
  - Hover zoom effects
  - Smooth transitions and fade-ins
  - Pulsating AI insight badges
  - Rotating AI icons
  - Glowing box shadows

### 📊 Dashboard Features
- **Configurable Widget Grid**: Display customizable number of test benches (set via `HOME_PAGE_WIDGET_COUNT`)
- **Real-time Status Overview**:
  - Total devices per test bench
  - Good/Critical/Dead device counts with color-coded indicators
  - AI insights availability badges
- **Summary Cards**: Overall statistics with animated highlights
- **Interactive Navigation**: Click any widget to view detailed information

### 📈 Test Bench Details
- **Comprehensive Stats**:
  - Total devices count
  - Energy consumption (kWh)
  - Efficiency percentage
  - System uptime
- **Visual Data Representation**:
  - Animated pie chart showing device status distribution
  - Color-coded status cards with hover effects
  - Blinking alerts for critical items
- **AI Insights Section**: Highlighted section for AI-powered recommendations

## Technology Stack

- **React 18**: Modern React with hooks
- **Material-UI (MUI)**: Professional UI components
- **React Router**: Client-side routing
- **Recharts**: Beautiful animated charts
- **Framer Motion**: Advanced animations and transitions
- **Emotion**: CSS-in-JS styling

## Project Structure

```
energy-twin/
├── src/
│   ├── components/
│   │   ├── Header.jsx              # Schneider branded header
│   │   ├── Footer.jsx              # Themed footer
│   │   ├── Dashboard.jsx           # Main dashboard with widgets
│   │   ├── TestBenchWidget.jsx     # Individual animated widget
│   │   └── TestBenchDetail.jsx     # Detailed view page
│   ├── constants/
│   │   └── appConfig.js            # Configuration settings
│   ├── assets/
│   │   └── mockData.json           # Mock test bench data
│   └── App.js                      # Main app with routing
├── backend/                         # Backend placeholder
└── public/
```

## Configuration

Edit `src/constants/appConfig.js` to customize:

- `HOME_PAGE_WIDGET_COUNT`: Number of widgets on dashboard (default: 6)
- `GRID.COLUMNS`: Number of columns in grid layout (default: 3)
- `ANIMATION.BLINK_CRITICAL`: Enable/disable blinking for critical items
- `ANIMATION.HOVER_ZOOM`: Enable/disable zoom on hover
- Theme colors and animation settings

## Getting Started

### Installation
```bash
cd energy-twin
npm install
```

### Development
```bash
npm start
```
Opens at [http://localhost:3000](http://localhost:3000)

### Build for Production
```bash
npm run build
```

## Mock Data Structure

The application uses mock data from `src/assets/mockData.json`:

```json
{
  "testBenches": [
    {
      "id": "TB001",
      "name": "Test Bench Name",
      "location": "Lab Location",
      "totalDevices": 145,
      "deviceStatus": {
        "good": 120,
        "critical": 18,
        "dead": 7
      },
      "aiInsightsAvailable": true,
      "aiInsightCount": 12,
      "energyConsumption": 2850.5,
      "efficiency": 87.3,
      "uptime": 98.5
    }
  ]
}
```

## Color Scheme (Schneider Electric)

- Primary Green: `#3DCD58`
- Dark Green: `#009742`
- Status Good: `#4CAF50`
- Status Critical: `#F44336` (with blinking animation)
- Status Dead: `#9E9E9E`
- AI Insight: `#2196F3`

## Animation Features

1. **Critical Device Alerts**: Blinking red animation with pulsating effect
2. **AI Insights**: Glowing blue badges with smooth shadow transitions
3. **Widget Hover**: Zoom effect (1.05x scale) with border color change
4. **Page Transitions**: Smooth fade-in and slide animations
5. **Charts**: Animated data visualization with Recharts
6. **Rotating Icons**: AI brain icon rotates continuously
7. **Breathing Effects**: Summary cards pulse gently

## Routes

- `/` - Main dashboard with all test benches
- `/testbench/:id` - Detailed view of specific test bench

## Future Enhancements

- Real API integration (replace mock JSON)
- Real-time WebSocket updates
- Advanced filtering and search
- Export functionality
- Mobile responsive design (currently desktop-only)
- User authentication
- Backend integration

---

**Powered by Schneider Electric** | Energy Digital Twin Dashboard
