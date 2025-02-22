import { createContext, useContext } from "react";
import { APIModel } from "../types";

const EndpointContext = createContext<APIModel>({
    settings: {
        activeMethod: 'GET',
        activeStatus: 200
    },
    apis: {}
});



export default EndpointContext;


export const EndpointProvider = EndpointContext.Provider;

export const useEndpointContext = ()=>{
    return useContext(EndpointContext);
};



