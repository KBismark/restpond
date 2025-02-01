
import {MatchRouter} from './router-claude-optimize';

export const matchRouter = new MatchRouter();

export const sendActivatedRouteResponse = (data: ResponseObject) => {
  // Send the response in electron main process
  if (window.Main) {
    window.Main.sendActivatedRouteResponse(data);
  }
};

export const activateRoute = (data: RequestObject) => {
  if(!data||!data.pathname) {
     sendActivatedRouteResponse({
       request: data,
       response: {
         status: 500,
         body: 'Internal Server Error',
         responseType: 'text',
         headers: {}
       }
     });
    return
  }
  // Activate route in app
  matchRouter.activateRoute(data.pathname as `/${string}`, data, (err) => {
    if (err) {
    } // Error handling
    sendActivatedRouteResponse({
      request: data,
      response: {
        status: 500,
        body: 'Internal Server Error',
        responseType: 'text',
        headers: {}
      }
    });
  });
};

export interface RequestObject {
  headers: Record<string, string>;
  method: string;
  pathname: string;
  body: string | Record<string, any>;
  query: Record<string, string>;
}

export interface ResponseObject {
  request: RequestObject;
  response: {
    status: number;
    body: string | Record<string, any>;
    responseType: 'json' | 'text';
    headers: Record<string, string>;
  };
}