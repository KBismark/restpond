export interface RequestMethodColor {
  GET: '#2e90fa';
  POST: '#ef6820';
  PUT: '#2fbe76';
  DELETE: '#f55252';
  PATCH: '#e87e1a';
  OPTIONS: '#9373ee';
  HEAD: '#0ea4b7';
}

export type RequestMethod = keyof RequestMethodColor;

export type ResponseStatus = 200 | 201 | 203 | 301 | 302 | 401 | 403 | 404 | 500 | ({} & number);

export interface APIModel {
  settings: {
    activeMethod: RequestMethod;
    activeStatus: ResponseStatus;
  };
  apis: {
    [key: string]: {
      [key in RequestMethod]: {
        [key in ResponseStatus]: {
          connected: boolean;
          body: string;
          responseType: 'json' | 'text';
          headers: Header[];
        };
      };
    };
  };
}

export interface Header {
  id: string;
  key: string;
  value: string;
}

export type RouteDataType = APIModel['apis'][string];

export type EndpointViewSettings = {
  status: ResponseStatus;
  method: RequestMethod;
  connection: { method: RequestMethod; status: ResponseStatus } | null;
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