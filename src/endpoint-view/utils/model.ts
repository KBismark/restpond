
import { convertBodyStringToObject, getUniqueID, parseResponseBody } from ".";
import { matchRouter, sendActivatedRouteResponse } from "../../helpers/server-app-bridge";
import { projectsCacheStorage } from "../store";
import { APIModel, RequestMethod, RequestMethodColor, RequestObject, ResponseObject, ResponseStatus, RouteDataType } from "../types";

export const defaultRouteModel = (): APIModel['apis']['']['GET']['200']  => ({
  connected: false,
  body: 'Paste response body here...',
  responseType: 'text',
  headers: [{ id: getUniqueID(), key: 'Content-Type', value: 'text/plain' }]
});

export const requestMethods: RequestMethod[] = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'];

export const requestMethodColors: RequestMethodColor = {
  GET: '#2e90fa',
  POST: '#ef6820',
  PUT: '#2fbe76',
  DELETE: '#f55252',
  PATCH: '#e87e1a',
  OPTIONS: '#9373ee',
  HEAD: '#0ea4b7'
}

export const responseStatuses: ResponseStatus[] = [200, 201, 203, 301, 302, 401, 403, 404, 500];

export const defaultResponseMethodValues = () =>
  responseStatuses.reduce(
    (acc, status) => {
      acc[status] = defaultRouteModel();
      return acc;
    },
    {} as APIModel['apis']['']['GET']
  );

export const defaultResponseRouteValues = () => requestMethods.reduce((acc, method) => {
  acc[method] = defaultResponseMethodValues();
  return acc;
}
, {} as APIModel['apis']['']);


export type API_Connection = {method: RequestMethod, status: ResponseStatus}

export const apiConnections: {[k: string]: API_Connection|null} = {};

export const setAPIconnection = (endpoint: string, connection: API_Connection|null) => {
  apiConnections[endpoint] = connection;
}

export const getAPIconnection = (endpoint: string) => apiConnections[endpoint]||null;

export const removeAPIconnection = (endpoint: string) => {
  const connection = apiConnections[endpoint]
  if(connection){
    apiConnections[endpoint] = null;
  }
  matchRouter.deactivateRoute(endpoint as `/${string}`);
  projectsCacheStorage.setItem(endpoint, ''); //  Clear data
};

export const createEndpointConnection = (endpoint: string) => {
  matchRouter.registerRoute(endpoint as `/${string}`, async (requestData: RequestObject, params) => {
    // let routeItem: StorageResult<RouteDataType>;
    const connection = getAPIconnection(endpoint);
    if (!connection) {
      const res: ResponseObject['response'] = {
        status: 500,
        body: `[Internal Server Error]: Endpoint: ${endpoint} is disconnected`,
        responseType: 'text',
        headers: {}
      };

      return sendActivatedRouteResponse({
        request: requestData,
        response: res
      });
    }

    try {
      const routeItem = await projectsCacheStorage.getItem<RouteDataType>(endpoint);
      if (routeItem.data) {

        if(requestData.method.toLowerCase() !== connection.method.toLowerCase()){
          const res: ResponseObject['response'] = {
            status: 500,
            body: `[Method Not Allowed]: Endpoint: ${endpoint} is disconnected for ${requestData.method.toUpperCase()} requests`,
            responseType: 'text',
            headers: {}
          };
          return sendActivatedRouteResponse({
            request: requestData,
            response: res
          });
        }
          
        let { method, status } = connection;
         let bodyString = parseResponseBody(routeItem.data[method][status].body, params);
        let restype = routeItem.data[method][status].responseType;
        if (restype === 'json') {
          try {
            bodyString = convertBodyStringToObject(bodyString);
            
          } catch (error) {
            status = 500;
            restype = 'text';
            bodyString = "[Internal Server Error]: Can't parse response body";
          }
        }
        return sendActivatedRouteResponse({
          request: requestData,
          response: {
            status: status,
            body: bodyString,
            responseType: restype,
            headers: {}
          }
        });
      } else {
        throw new Error('No data found');
      }
    } catch (error) {
      const res: ResponseObject['response'] = {
        status: 500,
        body: `[Internal Server Error]: Can't retrieve route data for ${endpoint}`,
        responseType: 'text',
        headers: {}
      };

      return sendActivatedRouteResponse({
        request: requestData,
        response: res
      });
    }
  });
}