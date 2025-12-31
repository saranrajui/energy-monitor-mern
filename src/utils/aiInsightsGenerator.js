/**
 * AI Insights Generator
 * High-level API for generating AI insights and recommendations
 */

import { analyzeDevice, analyzeDevices, getFleetSummary } from './aiRuleEngine';

/**
 * Formats insights for display in UI components
 * @param {Object} analysis - Analysis result from rule engine
 * @returns {Object} - Formatted insights for UI
 */
export const formatInsightsForUI = (analysis) => {
  if (!analysis) {
    return {
      hasInsights: false,
      score: 0,
      scoreLabel: 'No Data',
      criticalIssues: 0,
      warnings: 0,
      recommendations: [],
      summary: 'No AI insights available for this device.'
    };
  }

  const { healthScore, criticalIssues, warnings, recommendations } = analysis;

  // Determine score label and color
  let scoreLabel = 'Excellent';
  let scoreColor = '#10b981'; // green

  if (healthScore < 50) {
    scoreLabel = 'Critical';
    scoreColor = '#ef4444'; // red
  } else if (healthScore < 70) {
    scoreLabel = 'Poor';
    scoreColor = '#f97316'; // orange
  } else if (healthScore < 85) {
    scoreLabel = 'Fair';
    scoreColor = '#fbbf24'; // yellow
  } else if (healthScore < 95) {
    scoreLabel = 'Good';
    scoreColor = '#3b82f6'; // blue
  }

  // Generate summary message
  let summary = '';
  if (criticalIssues > 0) {
    summary = `Found ${criticalIssues} critical issue${criticalIssues > 1 ? 's' : ''} requiring immediate attention.`;
  } else if (warnings > 0) {
    summary = `Found ${warnings} warning${warnings > 1 ? 's' : ''} that should be addressed.`;
  } else if (recommendations.length === 0) {
    summary = 'No issues detected. Device is operating optimally.';
  } else {
    summary = `${recommendations.length} optimization${recommendations.length > 1 ? 's' : ''} available.`;
  }

  return {
    hasInsights: true,
    score: healthScore,
    scoreLabel,
    scoreColor,
    criticalIssues,
    warnings,
    recommendations,
    summary
  };
};

/**
 * Generates insights for a single device
 * @param {Object} device - Device data
 * @returns {Object} - Formatted insights
 */
export const generateDeviceInsights = (device) => {
  if (!device) {
    return formatInsightsForUI(null);
  }

  const analysis = analyzeDevice(device);
  return formatInsightsForUI(analysis);
};

/**
 * Generates insights for multiple devices (fleet view)
 * @param {Array} devices - Array of device data
 * @returns {Object} - Fleet-level insights
 */
export const generateFleetInsights = (devices) => {
  if (!devices || devices.length === 0) {
    return {
      hasInsights: false,
      totalDevices: 0,
      averageHealthScore: 0,
      criticalIssues: 0,
      warnings: 0,
      recommendations: [],
      categoryBreakdown: {}
    };
  }

  const summary = getFleetSummary(devices);

  return {
    hasInsights: true,
    totalDevices: summary.totalDevices,
    averageHealthScore: summary.averageHealthScore,
    criticalIssues: summary.totalCriticalIssues,
    warnings: summary.totalWarnings,
    recommendations: summary.topRecommendations,
    categoryBreakdown: summary.categoryBreakdown,
    totalRecommendations: summary.totalRecommendations
  };
};

/**
 * Gets recommendations by category
 * @param {Object} device - Device data
 * @param {string} category - Category to filter by
 * @returns {Array} - Filtered recommendations
 */
export const getRecommendationsByCategory = (device, category) => {
  const analysis = analyzeDevice(device);

  if (!category) {
    return analysis.recommendations;
  }

  return analysis.recommendations.filter(rec => rec.category === category);
};

/**
 * Gets only critical recommendations
 * @param {Object} device - Device data
 * @returns {Array} - Critical recommendations
 */
export const getCriticalRecommendations = (device) => {
  const analysis = analyzeDevice(device);
  return analysis.recommendations.filter(rec => rec.severity === 'critical');
};

/**
 * Calculates total potential savings across all recommendations
 * @param {Object} device - Device data
 * @returns {Object} - Total savings by type
 */
export const calculateTotalSavings = (device) => {
  const analysis = analyzeDevice(device);

  const savingsByType = {};

  analysis.recommendations.forEach(rec => {
    if (rec.savings && rec.savings.amount) {
      const { type, amount, unit } = rec.savings;

      if (!savingsByType[type]) {
        savingsByType[type] = {
          total: 0,
          unit,
          count: 0
        };
      }

      savingsByType[type].total += amount;
      savingsByType[type].count++;
    }
  });

  return savingsByType;
};

/**
 * Exports insights to various formats
 * @param {Object} device - Device data
 * @param {string} format - Export format ('json', 'csv', 'text')
 * @returns {string} - Formatted export data
 */
export const exportInsights = (device, format = 'json') => {
  const analysis = analyzeDevice(device);

  switch (format) {
    case 'json':
      return JSON.stringify(analysis, null, 2);

    case 'csv':
      let csv = 'Category,Severity,Action,Reason,Impact\n';
      analysis.recommendations.forEach(rec => {
        csv += `"${rec.category}","${rec.severity}","${rec.action}","${rec.reason}","${rec.impact}"\n`;
      });
      return csv;

    case 'text':
      let text = `AI Insights Report for ${device.name}\n`;
      text += `Generated: ${new Date().toLocaleString()}\n\n`;
      text += `Health Score: ${analysis.healthScore}%\n`;
      text += `Critical Issues: ${analysis.criticalIssues}\n`;
      text += `Warnings: ${analysis.warnings}\n\n`;
      text += 'RECOMMENDATIONS:\n';
      text += '================\n\n';
      analysis.recommendations.forEach((rec, idx) => {
        text += `${idx + 1}. [${rec.severity.toUpperCase()}] ${rec.name}\n`;
        text += `   Action: ${rec.action}\n`;
        text += `   Reason: ${rec.reason}\n`;
        text += `   Impact: ${rec.impact}\n\n`;
      });
      return text;

    default:
      return JSON.stringify(analysis, null, 2);
  }
};

export default {
  generateDeviceInsights,
  generateFleetInsights,
  getRecommendationsByCategory,
  getCriticalRecommendations,
  calculateTotalSavings,
  exportInsights,
  formatInsightsForUI
};
