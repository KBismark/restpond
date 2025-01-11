import {createStore} from 'statestorejs'
import { createServiceHook, createServiceUpdater } from '../../services/util';
import { endpointServiceProvider } from './endpoints.service';

const filterStoreKey = 'filter'

createStore<Filter>(endpointServiceProvider, filterStoreKey,{
    status: [],
    method: []
})

const service = {provider: endpointServiceProvider, serviceId: filterStoreKey}
export const useFilterStore = createServiceHook<Filter>(service)
export const updateFilterStore = createServiceUpdater<Filter>(service)




interface Filter{
    status: string[]
    method: string[]
}

