
import { convertBodyStringToObject, getUniqueID, parseResponseBody } from ".";
import { matchRouter, sendActivatedRouteResponse } from "../../helpers/server-app-bridge";
import { removeAPIrecents, setAPIrecents } from "../../store/recents";
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


export type API_Connection = Partial<Record<RequestMethod, ResponseStatus>>; //{method: RequestMethod, status: ResponseStatus}

export let apiConnections: {[k: string]: API_Connection|null} = {};

export const resetAPIconnections = (connections: { [k: string]: API_Connection | null }) => apiConnections = connections;

export const setAPIconnection = (endpoint: string, connection: API_Connection|null) => {
  apiConnections[endpoint] = connection;
}

export const getAPIconnection = (endpoint: string) => apiConnections[endpoint]||null;

export const removeAPIconnection = async (endpoint: string) => {

  // If endpoint's connection exists, set to null
  getAPIconnection(endpoint) && setAPIconnection(endpoint, null);

  // Disconnect endpoint from recieving requests
  matchRouter.deactivateRoute(endpoint as `/${string}`);

  // Remove any recent request and response data
  removeAPIrecents(endpoint);

  // Remove endpoint's data from the cache storage
  try{
    await projectsCacheStorage.removeItem(endpoint);
  }
  catch(err){/* Can't remove */}
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

      setAPIrecents(endpoint, {
        request: requestData,
        response: res
      });

      return sendActivatedRouteResponse({
        request: requestData,
        response: res
      });
    }

    try {
      const routeItem = await projectsCacheStorage.getItem<RouteDataType>(endpoint);
      if (routeItem.data) {
        const requestMethod = requestData.method.toUpperCase() as RequestMethod;
        if(!connection[requestMethod]){
          const res: ResponseObject['response'] = {
            status: 500,
            body: `[Method Not Allowed]: Endpoint: ${endpoint} is disconnected for ${requestMethod} requests`,
            responseType: 'text',
            headers: {}
          };

          setAPIrecents(endpoint, {
            request: requestData,
            response: res
          });

          return sendActivatedRouteResponse({
            request: requestData,
            response: res
          });
        }
          
        let { method, status } = { method: requestMethod, status: connection[requestMethod] as ResponseStatus };
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

        const res = {
          status: status,
          body: bodyString,
          responseType: restype,
          headers: {}
        };

        setAPIrecents(endpoint, {
          request: requestData,
          response: {...res}
        });

        return sendActivatedRouteResponse({
          request: requestData,
          response: res
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

      setAPIrecents(endpoint, {
        request: requestData,
        response: res
      });

      return sendActivatedRouteResponse({
        request: requestData,
        response: res
      });
    }
  });
}