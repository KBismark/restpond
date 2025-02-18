/* eslint-disable prettier/prettier */
// Native
import { join } from 'path';

// Packages
import { BrowserWindow, app, ipcMain, IpcMainEvent, nativeTheme } from 'electron';
import {  RequestObject,  ResponseObject, ServerResponseObjects } from './server/electron-server-events';
// import { server, SERVER_PORT } from './server';
import http, { ServerResponse } from 'http';
// import isDev from 'electron-is-dev';

const height = 600;
const width = 960;

const getElectronEventsAPI = (window: BrowserWindow) => {
  const HTTP_REQUESTS: { [k: string]: ServerResponseObjects[] } = {};

  const electronEventsAPI = {
    sendToApp: (data: any) => {
      if (window.isDestroyed()) return;
      window.webContents.send('activate-route', data);
    },
    activateRoute: (data: RequestObject, responseObject: ServerResponseObjects) => {
      if (window.isDestroyed()) {
        responseObject.statusCode = 500;
        responseObject.end('Internal Server Error');
        return;
      }

      const id = JSON.stringify(data);
      // getUniqueID();

      if (!HTTP_REQUESTS[id]) {
        HTTP_REQUESTS[id] = [responseObject];

        // make only one request server all same requests hitting the server time
        electronEventsAPI.sendToApp(data);
        return;
      }
      HTTP_REQUESTS[id].push(responseObject);
    },

    responseHandler: (data: ResponseObject) => {
      // Search for the route in the router registry for the given pathname
      // If found, call the handler function with the request and response objects
      // If not found, return a 404 response
      // If an error occurs, return a 500 response
      const id = JSON.stringify(data.request);
      const responses = HTTP_REQUESTS[id];
      if (!responses) {
        return;
      }

      // cleanup the request object from the registry
      cleanup(id);

      let key = '';
      const splitter = getUniqueID();
      const headerKeys = Object.keys(data.response.headers || {}).filter((key) => key.length > 0);
      const contentTypeSet = headerKeys.join(splitter).toLowerCase().split(splitter).includes('content-type');

      for (const res of responses) {
        res.statusCode = data.response.status;
        // set header from response object
        for (let i = 0; i < headerKeys.length; i++) {
          key = headerKeys[i];
          res.setHeader(key, data.response.headers[key]);
        }

        if (['TEXT', 'text'].includes(data.response.responseType)) {
          // Set content type to text if not set
          !contentTypeSet && res.setHeader('Content-Type', 'text/plain');

          // send response as text
          res.end(data.response.body as string);
          return;
        }
        // Set content type to json if not set
        !contentTypeSet && res.setHeader('Content-Type', 'application/json');

        // send response as json
        res.end(JSON.stringify(data.response.body));
      }
    }
  };

 

  const cleanup = (id: string) => {
    HTTP_REQUESTS[id] = undefined as any;
    delete HTTP_REQUESTS[id];
  };

  const getUniqueID = () => {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  return electronEventsAPI;
};

const getServer = (electronEventsAPI: ReturnType<typeof getElectronEventsAPI>)=>{
    const SERVER_PORT = 5202;

    const servers = {
      listen(...rest: any[]) {
        console.log('Server listening on port', SERVER_PORT);
        // setTimeout(() => {
          console.log('Sending request to app');

          electronEventsAPI.activateRoute(
            {
              headers: { ...{} } as Record<string, string>,
              method: 'GET'.toUpperCase(),
              pathname: '/user/kbis',
              body: {},
              query: {}
            },
            {} as ServerResponse
          );
        // }, 3000);
      },
      close(...rest: any[]) {}
    };

    const server = http.createServer((request, response) => {
      const urlObject = new URL(`http://localhost:${SERVER_PORT}${request.url}`);
      const { pathname } = urlObject;
      console.log(urlObject);

      // Send the request activation to the app for simulated response
      electronEventsAPI.activateRoute(
        {
          headers: { ...(request.headers || {}) } as Record<string, string>,
          method: (request.method || 'GET').toUpperCase(),
          pathname: pathname,
          body: {},
          query: {}
        },
        response
        // {} as ServerResponse
      );
      // response.setHeader('content-type','application/json').end('{ok: true}')
    });

    return { server, SERVER_PORT };
}


let globalServer: ReturnType<typeof getServer>;
let electronEventsAPI: ReturnType<typeof getElectronEventsAPI>;
async function createWindow() {
  // Dynamically import electron-is-dev
  const isDev = (await import('electron-is-dev')).default;

  // Create the browser window.
  const window = new BrowserWindow({
    width,
    height,
    minHeight: width,
    //  change to false to use AppBar
    frame: false,
    show: true,
    resizable: true,
    fullscreenable: true,
    webPreferences: {
      preload: join(__dirname, 'preload.js')
    }
  });
  
  // Expose the current window to the server API
  // electronEventsAPI.windowDestroyed = ()=>window.isDestroyed();
  // electronEventsAPI.sendToApp = (data:any)=>{;
  //   if(window.isDestroyed()) return;
  //   window.webContents.send('activate-route', data);
  // }
  electronEventsAPI = getElectronEventsAPI(window)



  // Prevent window from being resized below minimum dimensions
  window.on('will-resize', (event, newBounds) => {
    if (newBounds.width < width || newBounds.height < height) {
      event.preventDefault();
    }
  });

  const port = process.env.PORT || 3000;
  const url = isDev ? `http://localhost:${port}` : join(__dirname, '../dist-vite/index.html');

  // and load the index.html of the app.
  if (isDev) {
    window?.loadURL(url);
  } else {
    window?.loadFile(url);
  }
  // Open the DevTools.
  // window.webContents.openDevTools();

  // For AppBar
  ipcMain.on('minimize', () => {
    // eslint-disable-next-line no-unused-expressions
    window.isMinimized() ? window.restore() : window.minimize();
    // or alternatively: win.isVisible() ? win.hide() : win.show()
  });
  ipcMain.on('maximize', () => {
    // eslint-disable-next-line no-unused-expressions
    window.isMaximized() ? window.restore() : window.maximize();
  });

  ipcMain.on('close', () => {
    window.close();
  });

  nativeTheme.themeSource = 'dark';

  // Send data to server
  ipcMain.on('activated-route-response', (event: IpcMainEvent, data: ResponseObject) => {
    
    // Send the response in electron main process
    electronEventsAPI.responseHandler(data);
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  await createWindow();
  const {server, SERVER_PORT} = globalServer = getServer(electronEventsAPI);
  server.listen(SERVER_PORT, () => {
    console.log(`Server running at http://localhost:${SERVER_PORT}`);
  });
  (server as any).__started = true;

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0){
      createWindow();

      if(!(server as any).__started){
        server.listen(SERVER_PORT, () => {
          console.log(`Server running at http://localhost:${SERVER_PORT}`);
        });
        (server as any).__started = true;
      }

    } 
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if(!globalServer) {
      app.quit();
      return;
    }
    globalServer.server.close((serverNotLiveError: any) => {
      if(serverNotLiveError){}
       app.quit();
    });
   
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
let dfg = 0;
// listen the channel `message` and resend the received message to the renderer process
ipcMain.on('message', (event: IpcMainEvent, message: any) => {
  console.log(`From Renderer: ${message}`);
  // setTimeout(() => event.sender.send('message', 'common.hiElectron'), 500);
  // dfg === 0 && setTimeout(() => {
  //   electronEventsAPI.activateRoute(
  //   {
  //     headers: { ...{} } as Record<string, string>,
  //     method: 'GET'.toUpperCase(),
  //     pathname: '/user/kbis',
  //     body: {name: 'Bismark', ag: 34},
  //     query: {}
  //   },
  //   {} as ServerResponse
  // );
  // }, 500);
  dfg++;
});

// ipcMain.on('activate-route', (event: IpcMainEvent, message: any) => {
//   console.log(`From Renderer: ${message}`);
//   // setTimeout(() => event.sender.send('message', 'common.hiElectron'), 500);
// });

