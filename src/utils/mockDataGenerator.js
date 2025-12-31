/**
 * Mock Data Generator with AI Rule Engine Compatible Properties
 * Generates realistic device data with all properties needed for AI analysis
 */

/**
 * Generates random value within range
 */
const randomInRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * Generates random float within range
 */
const randomFloatInRange = (min, max, decimals = 1) => {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
};

/**
 * Generates a timestamp for lastDataEmission
 * @param {number} minutesAgo - How many minutes ago (0 = now, 60 = 1 hour ago)
 */
const generateTimestamp = (minutesAgo = 0) => {
  return Date.now() - (minutesAgo * 60 * 1000);
};

/**
 * Generates comprehensive device data with all AI-compatible properties
 */
export const generateEnhancedDevice = (baseDevice) => {
  const { id, name, type, status, position, consumers, dataFlow, energyUsage } = baseDevice;

  // Determine additional properties based on status
  let restartFrequency, voltageSpikes, cpuUsage, isConnected, lastDataEmission, uptime;

  switch (status) {
    case 'active':
      // Healthy active device
      restartFrequency = randomInRange(0, 2); // Low restart frequency
      voltageSpikes = randomInRange(0, 1); // Minimal voltage issues
      cpuUsage = randomInRange(40, 75); // Normal CPU usage
      isConnected = true;
      lastDataEmission = generateTimestamp(randomInRange(0, 5)); // Recent data emission
      uptime = randomFloatInRange(98, 99.9, 1);
      break;

    case 'critical':
      // Device with issues
      if (consumers === 0) {
        // Idle device wasting energy
        restartFrequency = randomInRange(1, 3);
        voltageSpikes = randomInRange(2, 4); // Some voltage issues
        cpuUsage = randomInRange(10, 30); // Low CPU (idle)
        isConnected = true;
        lastDataEmission = dataFlow > 0 ? generateTimestamp(randomInRange(0, 10)) : generateTimestamp(randomInRange(60, 180));
        uptime = randomFloatInRange(40, 60, 1);
      } else {
        // Overloaded device
        restartFrequency = randomInRange(5, 10); // High restart frequency
        voltageSpikes = randomInRange(3, 6); // Voltage problems
        cpuUsage = randomInRange(85, 98); // High CPU usage
        isConnected = true;
        lastDataEmission = generateTimestamp(randomInRange(0, 3));
        uptime = randomFloatInRange(75, 90, 1);
      }
      break;

    case 'warning':
      // Device with warnings
      restartFrequency = randomInRange(3, 5);
      voltageSpikes = randomInRange(1, 3);
      cpuUsage = randomInRange(75, 88);
      isConnected = true;
      lastDataEmission = generateTimestamp(randomInRange(5, 30));
      uptime = randomFloatInRange(90, 97, 1);
      break;

    case 'idle':
      // Idle device
      restartFrequency = randomInRange(0, 2);
      voltageSpikes = randomInRange(0, 2);
      cpuUsage = randomInRange(5, 20);
      isConnected = true;
      lastDataEmission = generateTimestamp(randomInRange(60, 300)); // 1-5 hours ago
      uptime = randomFloatInRange(95, 99, 1);
      break;

    case 'dead':
    case 'offline':
      // Offline device
      restartFrequency = 0;
      voltageSpikes = 0;
      cpuUsage = 0;
      isConnected = false;
      lastDataEmission = generateTimestamp(randomInRange(1440, 10080)); // 1-7 days ago
      uptime = 0;
      break;

    default:
      // Default values
      restartFrequency = randomInRange(0, 3);
      voltageSpikes = randomInRange(0, 2);
      cpuUsage = randomInRange(20, 70);
      isConnected = true;
      lastDataEmission = generateTimestamp(randomInRange(0, 60));
      uptime = randomFloatInRange(95, 99.5, 1);
  }

  return {
    ...baseDevice,
    // New AI-compatible properties
    restartFrequency,       // Number of restarts per week
    voltageSpikes,          // Number of voltage spikes per day
    cpuUsage,               // CPU usage percentage (0-100)
    isConnected,            // Boolean - is device connected to network
    lastDataEmission,       // Timestamp of last data emission (milliseconds)
    uptime: uptime,         // Uptime percentage
    // Convert existing properties to compatible format
    consumers: consumers || 0,
    dataFlow: dataFlow || 0,
    energyUsage: energyUsage || 0,
    temperature: baseDevice.temperature || randomInRange(35, 75),
  };
};

/**
 * Enhances all devices in a test bench with AI-compatible properties
 */
export const enhanceTestBenchDevices = (testBench) => {
  if (!testBench || !testBench.devices) {
    return testBench;
  }

  return {
    ...testBench,
    devices: testBench.devices.map(device => generateEnhancedDevice(device))
  };
};

/**
 * Generates sample devices for testing AI rules
 */
export const generateSampleDevices = () => {
  return [
    // Active device with high data flow and consumers
    {
      id: '01',
      name: 'Power Analyzer A1',
      type: 'analyzer',
      status: 'active',
      position: { x: -90, y: -75 },
      consumers: 5,
      dataFlow: 680,
      energyUsage: 30,
      temperature: 42,
      restartFrequency: 1,
      voltageSpikes: 0,
      cpuUsage: 65,
      isConnected: true,
      lastDataEmission: Date.now() - 60000, // 1 minute ago
      uptime: 99.8
    },
    // Critical: Idle device wasting energy (connected, data emission, but no consumers)
    {
      id: '02',
      name: 'Load Simulator B2',
      type: 'simulator',
      status: 'critical',
      position: { x: -60, y: 105 },
      consumers: 0,
      dataFlow: 150,
      energyUsage: 25,
      temperature: 68,
      restartFrequency: 2,
      voltageSpikes: 3,
      cpuUsage: 20,
      isConnected: true,
      lastDataEmission: Date.now() - 300000, // 5 minutes ago
      uptime: 45.2
    },
    // Critical: High CPU overload
    {
      id: '03',
      name: 'Grid Monitor C1',
      type: 'monitor',
      status: 'active',
      position: { x: 100, y: -60 },
      consumers: 8,
      dataFlow: 920,
      energyUsage: 45,
      temperature: 78,
      restartFrequency: 8,
      voltageSpikes: 5,
      cpuUsage: 97,
      isConnected: true,
      lastDataEmission: Date.now() - 30000, // 30 seconds ago
      uptime: 82.3
    },
    // Warning: Connected but not emitting data
    {
      id: '04',
      name: 'Voltage Regulator D3',
      type: 'regulator',
      status: 'idle',
      position: { x: 75, y: 100 },
      consumers: 0,
      dataFlow: 0,
      energyUsage: 8,
      temperature: 52,
      restartFrequency: 1,
      voltageSpikes: 1,
      cpuUsage: 12,
      isConnected: true,
      lastDataEmission: Date.now() - 7200000, // 2 hours ago
      uptime: 96.5
    },
    // Warning: Not connected but consuming power
    {
      id: '05',
      name: 'Harmonic Filter E2',
      type: 'filter',
      status: 'idle',
      position: { x: -130, y: 15 },
      consumers: 0,
      dataFlow: 0,
      energyUsage: 5,
      temperature: 48,
      restartFrequency: 0,
      voltageSpikes: 0,
      cpuUsage: 0,
      isConnected: false,
      lastDataEmission: Date.now() - 86400000, // 1 day ago
      uptime: 0
    },
    // Dead/Offline device
    {
      id: '06',
      name: 'Protection Relay F1',
      type: 'relay',
      status: 'dead',
      position: { x: 120, y: 80 },
      consumers: 0,
      dataFlow: 0,
      energyUsage: 0,
      temperature: 0,
      restartFrequency: 0,
      voltageSpikes: 0,
      cpuUsage: 0,
      isConnected: false,
      lastDataEmission: Date.now() - 604800000, // 7 days ago
      uptime: 0
    },
  ];
};

export default {
  generateEnhancedDevice,
  enhanceTestBenchDevices,
  generateSampleDevices
};
