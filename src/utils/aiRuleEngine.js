/**
 * AI Rule Engine
 * Evaluates device data against defined rules to generate insights and recommendations
 */

import aiRulesConfig from '../config/aiRules.json';

/**
 * Evaluates a single condition against device data
 * @param {Object} condition - The condition to evaluate
 * @param {any} deviceValue - The actual value from the device
 * @returns {boolean} - Whether the condition is met
 */
const evaluateCondition = (condition, deviceValue) => {
  // Handle simple equality (e.g., isConnected: true)
  if (typeof condition === 'boolean' || typeof condition === 'string' || typeof condition === 'number') {
    if (Array.isArray(deviceValue)) {
      return deviceValue.includes(condition);
    }
    return deviceValue === condition;
  }

  // Handle array conditions (e.g., status: ["active", "idle"])
  if (Array.isArray(condition)) {
    return condition.includes(deviceValue);
  }

  // Handle operator-based conditions (e.g., { operator: ">", value: 5 })
  if (condition.operator && condition.value !== undefined) {
    const { operator, value, unit, period } = condition;

    // Handle timestamp comparisons (e.g., lastDataEmission)
    if (unit === 'milliseconds_ago') {
      const currentTime = Date.now();
      const timeDiff = currentTime - deviceValue;

      switch (operator) {
        case '>': return timeDiff > value;
        case '>=': return timeDiff >= value;
        case '<': return timeDiff < value;
        case '<=': return timeDiff <= value;
        case '==': return timeDiff === value;
        case '!=': return timeDiff !== value;
        default: return false;
      }
    }

    // Handle standard numeric comparisons
    switch (operator) {
      case '>': return deviceValue > value;
      case '>=': return deviceValue >= value;
      case '<': return deviceValue < value;
      case '<=': return deviceValue <= value;
      case '==': return deviceValue === value;
      case '!=': return deviceValue !== value;
      default: return false;
    }
  }

  return false;
};

/**
 * Checks if a device matches all conditions of a rule
 * @param {Object} rule - The rule to check
 * @param {Object} device - The device data
 * @returns {boolean} - Whether all conditions are met
 */
const matchesRule = (rule, device) => {
  const { conditions } = rule;

  for (const [field, condition] of Object.entries(conditions)) {
    const deviceValue = device[field];

    // Skip if device doesn't have this field (unless it's a critical field)
    if (deviceValue === undefined || deviceValue === null) {
      // For critical fields, treat as not matching
      if (['isConnected', 'status'].includes(field)) {
        return false;
      }
      continue;
    }

    // Evaluate the condition
    if (!evaluateCondition(condition, deviceValue)) {
      return false;
    }
  }

  return true;
};

/**
 * Calculates estimated savings based on rule configuration
 * @param {Object} savings - Savings configuration from rule
 * @param {Object} device - Device data
 * @returns {Object} - Calculated savings with amount and unit
 */
const calculateSavings = (savings, device) => {
  if (!savings || !savings.calculation) {
    return null;
  }

  const { calculation, type, unit } = savings;

  try {
    // Simple calculation using device properties
    // Support basic math expressions like "energyUsage * 30 * 0.12"
    const expression = calculation.replace(/(\w+)/g, (match) => {
      if (device[match] !== undefined) {
        return device[match];
      }
      // Handle constants like replacement_cost (use default values)
      if (match === 'replacement_cost') {
        return 1000; // Default replacement cost
      }
      return match;
    });

    // Evaluate the expression safely
    // Note: In production, use a safer expression evaluator
    const amount = eval(expression);

    return {
      type,
      amount: Math.round(amount * 100) / 100, // Round to 2 decimal places
      unit
    };
  } catch (error) {
    console.error('Error calculating savings:', error);
    return null;
  }
};

/**
 * Analyzes a device against all rules
 * @param {Object} device - Device data to analyze
 * @returns {Object} - Analysis result with insights, recommendations, and score
 */
export const analyzeDevice = (device) => {
  const { rules, scoring } = aiRulesConfig;

  const matchedRules = [];
  const insights = [];
  const recommendations = [];
  let criticalCount = 0;
  let warningCount = 0;
  let infoCount = 0;

  // Evaluate each rule
  rules.forEach((rule) => {
    if (matchesRule(rule, device)) {
      matchedRules.push(rule);

      // Count by severity
      if (rule.severity === 'critical') criticalCount++;
      else if (rule.severity === 'warning') warningCount++;
      else if (rule.severity === 'info') infoCount++;

      // Skip "optimal performance" rule from recommendations
      if (rule.id === 'optimal-performance') {
        insights.push({
          id: rule.id,
          name: rule.name,
          category: rule.category,
          severity: rule.severity,
          description: rule.description,
          message: rule.recommendation.reason
        });
      } else {
        // Add to recommendations
        const savings = calculateSavings(rule.estimatedSavings, device);

        recommendations.push({
          id: rule.id,
          name: rule.name,
          category: rule.category,
          severity: rule.severity,
          priority: rule.priority,
          action: rule.recommendation.action,
          reason: rule.recommendation.reason,
          impact: rule.recommendation.impact,
          savings: savings
        });

        // Add to insights
        insights.push({
          id: rule.id,
          name: rule.name,
          category: rule.category,
          severity: rule.severity,
          description: rule.description,
          message: rule.recommendation.reason
        });
      }
    }
  });

  // Calculate health score
  let healthScore = scoring.base_score;
  healthScore -= criticalCount * scoring.deductions.critical;
  healthScore -= warningCount * scoring.deductions.warning;
  healthScore -= infoCount * scoring.deductions.info;
  healthScore = Math.max(healthScore, scoring.minimum_score);

  // Sort recommendations by priority
  recommendations.sort((a, b) => a.priority - b.priority);

  return {
    deviceId: device.id,
    deviceName: device.name,
    timestamp: new Date().toISOString(),
    healthScore,
    criticalIssues: criticalCount,
    warnings: warningCount,
    infoItems: infoCount,
    totalIssues: criticalCount + warningCount,
    insights,
    recommendations,
    matchedRules: matchedRules.map(r => r.id)
  };
};

/**
 * Analyzes multiple devices
 * @param {Array} devices - Array of device data
 * @returns {Array} - Array of analysis results
 */
export const analyzeDevices = (devices) => {
  if (!Array.isArray(devices)) {
    return [];
  }

  return devices.map(device => analyzeDevice(device));
};

/**
 * Gets summary statistics across all devices
 * @param {Array} devices - Array of device data
 * @returns {Object} - Summary statistics
 */
export const getFleetSummary = (devices) => {
  const analyses = analyzeDevices(devices);

  const summary = {
    totalDevices: devices.length,
    averageHealthScore: 0,
    totalCriticalIssues: 0,
    totalWarnings: 0,
    totalRecommendations: 0,
    estimatedTotalSavings: 0,
    categoryBreakdown: {},
    topRecommendations: []
  };

  // Aggregate data
  let totalScore = 0;
  const allRecommendations = [];

  analyses.forEach(analysis => {
    totalScore += analysis.healthScore;
    summary.totalCriticalIssues += analysis.criticalIssues;
    summary.totalWarnings += analysis.warnings;
    summary.totalRecommendations += analysis.recommendations.length;

    // Collect all recommendations
    allRecommendations.push(...analysis.recommendations.map(rec => ({
      ...rec,
      deviceId: analysis.deviceId,
      deviceName: analysis.deviceName
    })));

    // Count by category
    analysis.recommendations.forEach(rec => {
      if (!summary.categoryBreakdown[rec.category]) {
        summary.categoryBreakdown[rec.category] = 0;
      }
      summary.categoryBreakdown[rec.category]++;
    });
  });

  // Calculate averages
  summary.averageHealthScore = devices.length > 0
    ? Math.round((totalScore / devices.length) * 10) / 10
    : 0;

  // Get top 10 recommendations by priority
  summary.topRecommendations = allRecommendations
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 10);

  return summary;
};

export default {
  analyzeDevice,
  analyzeDevices,
  getFleetSummary
};
