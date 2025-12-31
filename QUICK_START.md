# Quick Start Guide - Energy Digital Twin

## ✅ Application is Running!

Your Energy Digital Twin application is now live at:
- **Local**: http://localhost:3000
- **Network**: http://10.252.174.156:3000

## 🎯 What You'll See

### Main Dashboard (Home Page)
1. **Header**: Schneider Electric branding with green theme
2. **Summary Cards**:
   - Total Devices (green gradient)
   - Good Devices (pulsing green animation)
   - Critical Devices (blinking red alert)
   - AI Insights (glowing blue badge)
3. **Widget Grid**: 6 test bench widgets (3 columns x 2 rows)
   - Each widget shows device status
   - Click any widget to see details

### Test Bench Detail Page
- Click any widget to navigate
- View detailed statistics
- See animated pie chart
- Check AI insights
- Use "Back to Dashboard" button to return

## 🎨 Visual Features You'll Notice

1. **Blinking Critical Alerts**: Red boxes pulse when critical devices detected
2. **Hover Effects**: Widgets zoom (1.05x) when you hover
3. **AI Badges**: Blue glowing effect on AI insight chips
4. **Smooth Animations**: Page transitions and card animations
5. **Custom Scrollbar**: Schneider green themed scrollbar

## ⚙️ Configuration

To change settings, edit: `src/constants/appConfig.js`

```javascript
HOME_PAGE_WIDGET_COUNT: 6  // Change number of widgets
GRID.COLUMNS: 3            // Change grid columns
ANIMATION.BLINK_CRITICAL: true  // Toggle blinking
```

## 📊 Test Data

Mock data includes 6 test benches with:
- Power Distribution Test Bench A (145 devices)
- Motor Control Test Bench B (98 devices)
- Circuit Breaker Test Bench C (210 devices)
- Relay Testing Station D (67 devices)
- Automation Test Bench E (180 devices)
- Safety Systems Test Bench F (125 devices)

## 🛠️ Development Commands

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

## 🎭 Key Features to Explore

1. **Click on "Power Distribution Test Bench A"** - Has the most critical devices (18)
2. **Notice the blinking red animation** on critical device counts
3. **Hover over any widget** to see the zoom effect
4. **Check the AI insights badges** - they glow with blue shadow
5. **Navigate to detail page** - See the animated pie chart
6. **Watch the summary cards** - They pulse gently

## 📱 Browser Compatibility

Optimized for desktop browsers:
- Chrome (recommended)
- Firefox
- Edge
- Safari

---

**Enjoy your Energy Digital Twin Dashboard!** 🚀
