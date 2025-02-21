import { APIModel, RequestMethod, RequestMethodColor, ResponseStatus } from "../types";

export const defaultRouteModel: APIModel['apis']['']['GET']['200'] = {
    connected: false,
    body: 'Paste response body here...',
    responseType: 'text',
    headers: {
        'Content-Type': 'text/plain'
    }
}

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

export const defaultResponseMethodValues = responseStatuses.reduce((acc, status) => {
  acc[status] = defaultRouteModel;
  return acc;
}
, {} as APIModel['apis']['']['GET']);

export const defaultResponseRouteValues = requestMethods.reduce((acc, method) => {
  acc[method] = defaultResponseMethodValues;
  return acc;
}
, {} as APIModel['apis']['']);