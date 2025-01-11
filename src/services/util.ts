import { updateStore, useStateStore } from "statestorejs";

export const createServiceUpdater = <S>({provider, serviceId}:{provider: string; serviceId: string})=>{
    return ({actors,store}:{actors?: Array<keyof S>, store:Partial<S extends { [k: string]: any; [k: number]: any; [k: symbol]: any; } ? S : never>})=>updateStore(provider, serviceId, {actors, store} )
}

export const createServiceHook = <S>({ provider, serviceId}:{provider: string; serviceId: string})=>{
    return function useState({watch}:{watch?: Array<keyof S>}){
        return useStateStore<S>(provider, serviceId, watch)
    }
}