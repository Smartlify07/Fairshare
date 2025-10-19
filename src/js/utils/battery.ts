interface CustomNavigator extends Navigator {
  getBattery?: () => Promise<any>;
}
async function getBatteryPercentage() {
  if ('getBattery' in navigator) {
    try {
      const customNavigator = navigator as CustomNavigator;
      const battery = await customNavigator?.getBattery!();
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
