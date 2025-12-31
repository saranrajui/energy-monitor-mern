# AI Rules Engine - Documentation

## Overview

The AI Rules Engine is a comprehensive system for analyzing device data and generating intelligent insights and recommendations based on predefined rules. It evaluates devices against multiple criteria including energy usage, performance, reliability, and operational efficiency.

## Architecture

### Core Components

1. **AI Rules Configuration** (`src/config/aiRules.json`)
   - JSON-based rule definitions
   - Configurable thresholds and conditions
   - Scoring system configuration

2. **AI Rule Engine** (`src/utils/aiRuleEngine.js`)
   - Rule evaluation logic
   - Condition matching
   - Savings calculations
   - Health score computation

3. **AI Insights Generator** (`src/utils/aiInsightsGenerator.js`)
   - High-level API for generating insights
   - UI-friendly formatting
   - Export capabilities

4. **Mock Data Generator** (`src/utils/mockDataGenerator.js`)
   - Generates AI-compatible device data
   - Ensures all required properties are present

5. **AI Insights Panel Component** (`src/components/AIInsightsPanel.jsx`)
   - Visual display of insights and recommendations
   - Real-time analysis integration

## Rule Categories

The AI engine analyzes devices across **7 key focus areas**:

### 1. **High Data Flow**
- Monitors data emission rates
- Identifies high-utilization devices
- Optimizes bandwidth usage

### 2. **Restart Frequency**
- Tracks device restart patterns
- Warns about excessive restarts that reduce lifespan
- Identifies stability issues

### 3. **Load Handling**
- Monitors CPU usage and capacity
- Detects overloaded devices
- Prevents performance degradation

### 4. **High Voltage**
- Detects voltage spikes and anomalies
- Prevents electrical damage
- Ensures power quality

### 5. **Not Connected**
- Identifies powered devices not connected to network
- Eliminates wasted energy
- Improves resource allocation

### 6. **Connected but No Data Emission**
- Finds idle connected devices
- Reduces unnecessary power consumption
- Optimizes resource usage

### 7. **Data Emitted but No Consumers**
- Detects devices transmitting data with zero consumers
- Identifies pure energy waste
- Maximizes cost savings

## Device Data Requirements

For the AI engine to analyze a device, it must include these properties:

### Required Properties

```javascript
{
  // Basic Info
  id: string,
  name: string,
  type: string,
  status: 'active' | 'critical' | 'warning' | 'idle' | 'dead' | 'offline',

  // Performance Metrics
  consumers: number,              // Number of active consumers
  dataFlow: number,               // Data flow in MB/s
  energyUsage: number,            // Energy consumption in kWh/day
  temperature: number,            // Temperature in °C
  uptime: number,                 // Uptime percentage (0-100)

  // AI-Specific Metrics (NEW)
  restartFrequency: number,       // Number of restarts per week
  voltageSpikes: number,          // Number of voltage spikes per day
  cpuUsage: number,               // CPU usage percentage (0-100)
  isConnected: boolean,           // Network connection status
  lastDataEmission: number        // Timestamp in milliseconds
}
```

## Usage Examples

### 1. Basic Integration with AIInsightsPanel

```jsx
import AIInsightsPanel from '../components/AIInsightsPanel';
import { generateEnhancedDevice } from '../utils/mockDataGenerator';

function MyComponent({ device }) {
  // Ensure device has all required AI properties
  const enhancedDevice = generateEnhancedDevice(device);

  return (
    <AIInsightsPanel device={enhancedDevice} />
  );
}
```

### 2. Programmatic Analysis

```javascript
import { analyzeDevice } from '../utils/aiRuleEngine';

const device = {
  id: '01',
  name: 'Power Analyzer A1',
  // ... other required properties
};

const analysis = analyzeDevice(device);

console.log('Health Score:', analysis.healthScore);
console.log('Critical Issues:', analysis.criticalIssues);
console.log('Recommendations:', analysis.recommendations);
```

### 3. Fleet-Level Analysis

```javascript
import { getFleetSummary } from '../utils/aiRuleEngine';

const devices = [device1, device2, device3];
const fleetSummary = getFleetSummary(devices);

console.log('Average Health:', fleetSummary.averageHealthScore);
console.log('Total Issues:', fleetSummary.totalCriticalIssues);
console.log('Top Recommendations:', fleetSummary.topRecommendations);
```

### 4. Generate UI-Friendly Insights

```javascript
import { generateDeviceInsights } from '../utils/aiInsightsGenerator';

const insights = generateDeviceInsights(device);

// insights contains:
// - hasInsights: boolean
// - score: number (0-100)
// - scoreLabel: string ('Excellent', 'Good', 'Fair', 'Poor', 'Critical')
// - scoreColor: string (hex color)
// - criticalIssues: number
// - warnings: number
// - recommendations: array
// - summary: string
```

## Rule Definition Format

Rules are defined in `src/config/aiRules.json`. Each rule follows this structure:

```json
{
  "id": "unique-rule-id",
  "name": "Human-readable rule name",
  "category": "energy_waste | performance | reliability | optimization | lifespan | electrical | data_quality",
  "severity": "critical | warning | info",
  "priority": 1-10,
  "description": "What this rule checks",
  "conditions": {
    "fieldName": value | { "operator": ">", "value": 10 } | ["value1", "value2"]
  },
  "recommendation": {
    "action": "What to do",
    "reason": "Why it's needed",
    "impact": "Expected benefit"
  },
  "estimatedSavings": {
    "type": "energy | maintenance | performance",
    "calculation": "energyUsage * 30 * 0.12",
    "unit": "$/month"
  }
}
```

## Condition Operators

The rule engine supports these comparison operators:

- `>` - Greater than
- `>=` - Greater than or equal
- `<` - Less than
- `<=` - Less than or equal
- `==` - Equal to
- `!=` - Not equal to

### Special Conditions

- **Array values**: `"status": ["active", "idle"]` - matches if device status is in array
- **Timestamp comparison**: For `lastDataEmission`, use `milliseconds_ago` unit
- **Period-based**: Some conditions support `period` (e.g., "per week", "per day")

## Health Score Calculation

The health score starts at 100 and deducts points based on issues found:

- **Critical issues**: -25 points each
- **Warnings**: -10 points each
- **Info items**: 0 points

**Score Labels**:
- 95-100%: Excellent (Green)
- 85-94%: Good (Blue)
- 70-84%: Fair (Yellow)
- 50-69%: Poor (Orange)
- 0-49%: Critical (Red)

## Customizing Rules

### Adding a New Rule

1. Edit `src/config/aiRules.json`
2. Add a new rule object to the `rules` array
3. Define conditions, recommendations, and savings calculation
4. Test with sample devices

### Modifying Thresholds

Update the `thresholds` section in `aiRules.json`:

```json
{
  "thresholds": {
    "energy": {
      "waste_threshold_kwh": 5,
      "cost_per_kwh": 0.12
    },
    "performance": {
      "cpu_warning": 85,
      "cpu_critical": 95
    }
  }
}
```

## API Reference

### `analyzeDevice(device)`

Analyzes a single device against all rules.

**Returns**:
```javascript
{
  deviceId: string,
  deviceName: string,
  timestamp: string,
  healthScore: number,
  criticalIssues: number,
  warnings: number,
  infoItems: number,
  totalIssues: number,
  insights: array,
  recommendations: array,
  matchedRules: array
}
```

### `analyzeDevices(devices)`

Analyzes multiple devices.

**Returns**: Array of analysis results

### `getFleetSummary(devices)`

Gets aggregate statistics across all devices.

**Returns**:
```javascript
{
  totalDevices: number,
  averageHealthScore: number,
  totalCriticalIssues: number,
  totalWarnings: number,
  totalRecommendations: number,
  estimatedTotalSavings: number,
  categoryBreakdown: object,
  topRecommendations: array
}
```

### `generateDeviceInsights(device)`

Generates UI-friendly formatted insights.

**Returns**:
```javascript
{
  hasInsights: boolean,
  score: number,
  scoreLabel: string,
  scoreColor: string,
  criticalIssues: number,
  warnings: number,
  recommendations: array,
  summary: string
}
```

### `generateEnhancedDevice(baseDevice)`

Adds all required AI properties to a device object.

**Returns**: Enhanced device object with all AI-compatible properties

## Best Practices

1. **Always enhance devices** before analysis:
   ```javascript
   const enhanced = generateEnhancedDevice(rawDevice);
   ```

2. **Use memoization** in React components:
   ```javascript
   const insights = useMemo(() => generateDeviceInsights(device), [device]);
   ```

3. **Handle missing data gracefully**:
   - The engine skips non-critical missing fields
   - Use `mockDataGenerator` to fill in defaults

4. **Test rules thoroughly**:
   - Use `generateSampleDevices()` for testing
   - Verify rule conditions match expected scenarios

5. **Monitor performance**:
   - For large device fleets, consider batching
   - Cache analysis results when appropriate

## Troubleshooting

### No insights generated

**Problem**: `hasInsights` is false

**Solutions**:
- Verify device has all required properties
- Check device values match rule conditions
- Ensure `aiRules.json` is properly loaded

### Incorrect health scores

**Problem**: Scores don't match expectations

**Solutions**:
- Review matched rules in analysis results
- Check scoring configuration in `aiRules.json`
- Verify severity levels of triggered rules

### Missing recommendations

**Problem**: Expected recommendations not showing

**Solutions**:
- Check rule conditions carefully
- Verify device property values
- Review rule priority (lower = higher priority)

## Example Files

- **Complete example**: `src/examples/AIEngineExample.jsx`
- **Sample devices**: Use `generateSampleDevices()` from `mockDataGenerator.js`
- **Test integration**: See `AIInsightsPanel` component

## Future Enhancements

Potential improvements:
- Machine learning-based threshold adaptation
- Historical trend analysis
- Predictive maintenance alerts
- Custom rule builder UI
- Export/import rule configurations
- Multi-tenant rule sets
- Real-time rule evaluation engine

## Support

For questions or issues:
1. Check this documentation
2. Review example files
3. Inspect `aiRules.json` for rule definitions
4. Test with sample devices from `mockDataGenerator`
