import { createDerivedStore, createStore, createStoreHook, createStoreUpdater } from 'statestorejs';
import { appProvider } from '../../store/global';
import { SelectorOptions } from '../selector';
import CacheLocalStorage from '@codigex/cachestorage';

export const cachestorage = new CacheLocalStorage({
  namespace: 'projects-endpoint-view',
  // 1 year cache duration in seconds
  cacheDuration: 60 * 60 * 24 * 365,
});


export const storeName = 'endpoint-view';

const DEFAULT_REQUEST_HEADER_RULES: SelectorOptions = {
  Required: false,
  'No Restriction': true
};

export const BODY_TYPES = {
  Text: true,
  Number: false,
  Boolean: false,
  'Array[]': false,
  'Object{}': false,
  // 'Multipart/Formdata': false
};

export const RESPONSE_STATUSES = [200, 401, 403, 404, 500];
export const RESPONSE_BODY_TYPES = ['Text', 'JSON'];


export const getDefualtEndpointData = ():EndpointData=>({
  file: '',
  routeName: '',
  isActive: false,
  info: {
    description: '',
    summary: ''
  },
  request: {
    method: 'GET',
    bodyType: 'Text',
    body: '',
    headers: {
      // Default header slot to update by user
      '': 'No Restriction'
    }
  },
  response: {
    status: 200,
    bodyType: {
      200: 'Text',
      401: 'Text',
      403: 'Text',
      404: 'Text',
      500: 'Text'
    },
    body: {
      200: '',
      401: '',
      403: '',
      404: '',
      500: ''
    },
    headers: {
      '': ''
    }
  },
  recentRequest: null,
  recentResponse: null
});



createStore<EndpointData>(appProvider, storeName, getDefualtEndpointData());

export const setInitialEndpointData = (file:string, routeName: string, data?: EndpointData) => {
  updateEndpointViewStore({ actors: ['routeName', 'file'], store: data ? data : { ...getDefualtEndpointData(), file, routeName } }); // No actors to update
};

export const useEndpointViewStore = createStoreHook<EndpointData>({ provider: appProvider, storeId: storeName });

export const updateEndpointViewStore = createStoreUpdater<EndpointData>({ provider: appProvider, storeId: storeName });

// Create a derived store for request headers
createDerivedStore<EndpointData>(appProvider, storeName, 'request');

// Create a hook to access the derived store
export const useEndpointViewStoreRequest = createStoreHook<EndpointData, 'request'>({
  provider: appProvider,
  storeId: storeName,
  fieldName: 'request'
});

// Create an updater to update the derived store
export const updateEndpointViewStoreRequest = createStoreUpdater<EndpointData, 'request'>({
  provider: appProvider,
  storeId: storeName,
  fieldName: 'request'
});

// Create a derived store for response headers
createDerivedStore<EndpointData>(appProvider, storeName, 'response');

// Create a hook to access the derived store
export const useEndpointViewStoreResponse = createStoreHook<EndpointData, 'response'>({
  provider: appProvider,
  storeId: storeName,
  fieldName: 'response'
});

// Create an updater to update the derived store
export const updateEndpointViewStoreResponse = createStoreUpdater<EndpointData, 'response'>({
  provider: appProvider,
  storeId: storeName,
  fieldName: 'response'
});

// Create a derived store for store info
createDerivedStore<EndpointData>(appProvider, storeName, 'info');

// Create a hook to access the derived store
export const useEndpointViewStoreInfo = createStoreHook<EndpointData, 'info'>({
  provider: appProvider,
  storeId: storeName,
  fieldName: 'info'
});

// Create an updater to update the derived store
export const updateEndpointViewStoreInfo = createStoreUpdater<EndpointData, 'info'>({
  provider: appProvider,
  storeId: storeName,
  fieldName: 'info'
});




export interface EndpointData {
  /** The file structure path which may include dynamic segments */
  file: string;
  /** The route name to match the http request */
  routeName: string;
  isActive: boolean;
  info: {
    description: string;
    summary: string;
  };
  request: {
    method: 'GET' | 'POST' | 'DELETE' | 'PATCH' | 'PUT';
    bodyType?: keyof typeof BODY_TYPES;
    body?: string | number | { [k: string]: any } | any[];
    headers: { [k: string]: string };
  };

  response: {
    status: 200 | 401 | 403 | 404 | 500;
    bodyType: {
      200: 'Text' | 'JSON';
      401: 'Text' | 'JSON';
      403: 'Text' | 'JSON';
      404: 'Text' | 'JSON';
      500: 'Text' | 'JSON';
    };
    body: {
      200: string;
      401: string;
      403: string;
      404: string;
      500: string;
    };
    headers: { [k: string]: string };
  };

  recentRequest?: { [k: string]: any } | null;
  recentResponse?: { [k: string]: any } | string | null;
}
