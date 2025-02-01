// // preload.ts
// import { contextBridge, ipcRenderer } from 'electron';

// contextBridge.exposeInMainWorld('api', {
//   send: (channel: string, data: any) => {
//     const validChannels = ['toMain', 'dataRequest', 'dataUpdate'];
//     if (validChannels.includes(channel)) {
//       ipcRenderer.send(channel, data);
//     }
//   },
//   receive: (channel: string, func: (...args: any[]) => void) => {
//     const validChannels = ['fromMain', 'dataUpdate', 'notification', 'statusUpdate', 'error'];
//     if (validChannels.includes(channel)) {
//       ipcRenderer.on(channel, (event, ...args) => func(...args));
//     }
//   },
//   // Remove listener when no longer needed
//   removeListener: (channel: string, func: (...args: any[]) => void) => {
//     const validChannels = ['fromMain', 'dataUpdate', 'notification', 'statusUpdate', 'error'];
//     if (validChannels.includes(channel)) {
//       ipcRenderer.removeListener(channel, func);
//     }
//   }
// });

// // main.ts
// import { BrowserWindow, ipcMain } from 'electron';

// class MainProcess {
//   private mainWindow: BrowserWindow;

//   constructor(window: BrowserWindow) {
//     this.mainWindow = window;
//   }

//   // Send one-time message to renderer
//   sendMessage(message: any) {
//     if (!this.mainWindow.isDestroyed()) {
//       this.mainWindow.webContents.send('fromMain', message);
//     }
//   }

//   // Send data update to renderer
//   sendDataUpdate(data: any) {
//     if (!this.mainWindow.isDestroyed()) {
//       this.mainWindow.webContents.send('dataUpdate', data);
//     }
//   }

//   // Send notification to renderer
//   sendNotification(notification: { type: 'success' | 'error' | 'info'; message: string }) {
//     if (!this.mainWindow.isDestroyed()) {
//       this.mainWindow.webContents.send('notification', notification);
//     }
//   }

//   // Send status update to renderer
//   sendStatusUpdate(status: { type: string; data: any }) {
//     if (!this.mainWindow.isDestroyed()) {
//       this.mainWindow.webContents.send('statusUpdate', status);
//     }
//   }

//   // Send error to renderer
//   sendError(error: Error) {
//     if (!this.mainWindow.isDestroyed()) {
//       this.mainWindow.webContents.send('error', {
//         message: error.message,
//         stack: error.stack
//       });
//     }
//   }
// }

// // Example usage in main process
// const mainProcess = new MainProcess(mainWindow);

// // Send periodic updates
// setInterval(() => {
//   mainProcess.sendStatusUpdate({
//     type: 'systemStatus',
//     data: {
//       cpuUsage: process.cpuUsage(),
//       memoryUsage: process.memoryUsage()
//     }
//   });
// }, 5000);

// // Send data updates when something changes
// function onDataChange(newData: any) {
//   mainProcess.sendDataUpdate(newData);
// }

// // Send notifications for important events
// function onImportantEvent(event: any) {
//   mainProcess.sendNotification({
//     type: 'info',
//     message: `Important event occurred: ${event.type}`
//   });
// }

// // renderer.ts
// interface Window {
//   api: {
//     send: (channel: string, data: any) => void;
//     receive: (channel: string, func: (...args: any[]) => void) => void;
//     removeListener: (channel: string, func: (...args: any[]) => void) => void;
//   };
// }

// // Listen for messages from main process
// window.api.receive('fromMain', (message) => {
//   console.log('Message from main:', message);
// });

// // Listen for data updates
// const handleDataUpdate = (data: any) => {
//   console.log('Data update received:', data);
//   // Update UI with new data
// };
// window.api.receive('dataUpdate', handleDataUpdate);

// // Listen for notifications
// window.api.receive('notification', (notification) => {
//   console.log('Notification received:', notification);
//   // Show notification in UI
//   showNotification(notification.type, notification.message);
// });

// // Listen for status updates
// window.api.receive('statusUpdate', (status) => {
//   console.log('Status update received:', status);
//   // Update status indicators in UI
//   updateStatusDisplay(status);
// });

// // Listen for errors
// window.api.receive('error', (error) => {
//   console.error('Error received from main process:', error);
//   // Show error in UI
//   showErrorMessage(error.message);
// });

// // Cleanup when component unmounts
// function cleanup() {
//   window.api.removeListener('dataUpdate', handleDataUpdate);
// }
