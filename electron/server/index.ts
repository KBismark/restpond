import http, { ServerResponse } from 'http'
import {join} from 'path'
import { electronEventsAPI } from './electron-server-events';

export const SERVER_PORT = 5202;

export const server = {
  listen(...rest: any[]) {
    console.log('Server listening on port', SERVER_PORT);
    setTimeout(() => {
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
    }, 5000);
  },
  close(...rest: any[]) {}
};

export const servers = http.createServer((request, response)=>{
    const urlObject = new URL(`http://localhost:${SERVER_PORT}${request.url}`);
    const {pathname} = urlObject;
    console.log(urlObject);
    
    // Send the request activation to the app for simulated response
    electronEventsAPI.activateRoute({
      headers: { ...(request.headers || {}) } as Record<string, string>,
      method: (request.method || 'GET').toUpperCase(),
      pathname: pathname,
      body: {},
      query: {}
    }, response);

});


 

