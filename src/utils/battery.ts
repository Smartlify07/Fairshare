async function getBatteryPercentage() {
  if ('getBattery' in navigator) {
    try {
      const battery = await navigator.getBattery();
      const batteryLevel = Math.round(battery.level * 100);
      console.log(`Battery Level: ${batteryLevel}%`);
    } catch (error) {
      console.error('Error accessing Battery Status API:', error);
    }
  } else {
    console.log('Battery Status API not supported in this browser.');
  }
}

getBatteryPercentage();
