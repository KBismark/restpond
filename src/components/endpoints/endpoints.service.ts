import { generateEndpoint } from "../../dummydata";
import { useAppStore } from "../../services/app.service";
import { Endpoint } from "../../types";
import { useEffect, useState } from "react";
import { createStore, getStorageProvider } from "statestorejs";
import { updateProjectsStore, useProjectsStore } from "../projects/projects.service";

export const endpointServiceProvider = 'endpoints'
createStore<EndpointsStore>(endpointServiceProvider,endpointServiceProvider,{})

export const useCurrentProjectEndpointLoader = ()=>{
    const {env} = useAppStore({watch: []})!
    const {currentProjectId: projectId} = useProjectsStore({watch: ['currentProjectId']})!
    const [fetched, setFetchStatus] = useState(false)
    const projectEndpoints = getAllEndpointIds({projectId})
    
    useEffect(()=>{
        (!fetched||projectEndpoints.length<1)&&
        fetchEndpoints({env, projectId})
        .catch(()=>{})
        .then(()=>{
            // Simulate data load from server/database
            setTimeout(() => {
                setFetchStatus(true)
                updateProjectsStore({actors:['currentProjectId'], store:{}})
            }, 2000);
        })
    })
    
    return projectEndpoints
}


export const getAllEndpointsData = ({projectId}:{projectId: string}):Endpoint[]=>{
    return Object.values<{value:Endpoint}>(getStorageProvider(`${projectId}`)||{}).map(provider=>provider.value)
}

export const getAllEndpointIds = ({projectId}:{projectId: string})=>{
    return Object.keys(getStorageProvider(`${projectId}`)||{})
}

const fetchEndpoints = async ({env, projectId}:{env: string; projectId: string})=>{

    if(env === 'development'){
        const endpointsCount = Math.floor(Math.random() * 20) + 5; // 5-25 endpoints
        const projectEndpoints = Array.from({ length: endpointsCount }, generateEndpoint)
        projectEndpoints.forEach((endpoint)=>{
            createStore(projectId, endpoint.id, endpoint);
        })
        return;
    }

    // TODO: Fetch from database if in production

}




  interface EndpointsStore{

  }