/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import notifee from '@notifee/react-native';

// Register background event handler
notifee.onBackgroundEvent(async ({ type, detail }) => {
  // Background handling logic if needed
  console.log('Background Event:', type, detail);
});

AppRegistry.registerComponent(appName, () => App);
