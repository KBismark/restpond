import { createStore, createStoreHook, getStore, updateStore } from "statestorejs";
import { appProvider } from "./global";
import { ResponseObject } from "../endpoint-view/types";

const storeName = 'recent-request-response'

type Store = { endpoint: string; response: ResponseObject['response'] | null; request: ResponseObject['request']|null };

createStore<Store>(appProvider, storeName, {
    endpoint: '',
    request: null,
    response: null
});

export const useRecentRequestResponseStore = createStoreHook<Store>({
  provider: appProvider,
  storeId: storeName
});

export const updateRecentRequestResponseStore = (endpoint: string)=>{
    updateStore<Store>(appProvider, storeName, {
        actors: ['endpoint','request', 'response'],
        store: {endpoint: endpoint, ...getAPIrecents(endpoint)}
    })
}

const recents: {[k: string]: Omit<Store, 'endpoint'>} = {};

export const setAPIrecents = (endpoint: string, req_res: ResponseObject|null)=>{
    recents[endpoint] = req_res||{request: null, response: null};
    getStore<Store, void>(appProvider, storeName, (store)=>{
        if(store.endpoint === endpoint){
            updateRecentRequestResponseStore(endpoint)
        }
    })
}

export const getAPIrecents = (endpoint: string) =>
  (recents[endpoint] || { request: null, response: null }) as ResponseObject ;

export const removeAPIrecents = (endpoint: string)=>{
    recents[endpoint] = null as any;
    getStore<Store, void>(appProvider, storeName, (store) => {
      if (store.endpoint === endpoint) {
        updateRecentRequestResponseStore(endpoint);
      }
    });
}
