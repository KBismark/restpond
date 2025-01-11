import { generateDummyProjects } from "../../dummydata";
import { useEffect, useState } from "react";
import { useAppStore } from "../../services/app.service";
import { createServiceHook, createServiceUpdater } from "../../services/util";
import { Project } from "../../types";
import { createStore, getStore, updateStore, useStateStore } from "statestorejs";
export const projectServiceProvider = 'projects'

createStore<Projects>(projectServiceProvider,projectServiceProvider,{
    currentProjectId: '',
    projectIds: [],
})

export const useProjectsLoaderService = ()=>{
    const {env} = useAppStore({watch: []})!
    const {projectIds, currentProjectId} = useStateStore<Projects>(
        projectServiceProvider, projectServiceProvider, ['currentProjectId','projectIds']
    )!
    const [fetched, setFetchStatus] = useState(false)

    useEffect(()=>{
        (!fetched||projectIds.length<1)&&
        fetchProjects({env, projectIds, currentProjectId})
        .then(()=>{
            setFetchStatus(true)
        })
        .catch(()=>{})
    })
}

export const useAllProjectsService = ():Project[]=>{
    const {projectIds} = useStateStore<Projects>(projectServiceProvider, projectServiceProvider, ['projectIds'])!
    const all: Project[] = []
    projectIds.forEach((projectId)=>{
        getStore<Project, void>(projectServiceProvider, projectId, (store)=>{
            all.push(store)
        })
    })
    return all
}

export const useProjectService = ({projectId, watch}:{projectId: string; watch?:Array<keyof Project>})=>{
    return useStateStore<Project>(projectServiceProvider, `${projectId}`, watch)
}


export const useCurrentProjectData = ({projectId, watch}:{projectId: string; watch?:Array<keyof Project>})=>{
    return useStateStore<Project>(projectServiceProvider, projectId, watch)
}

const service = {provider: projectServiceProvider, serviceId: projectServiceProvider}
export const useProjectsStore = createServiceHook<Projects>(service)
export const updateProjectsStore = createServiceUpdater<Projects>(service)


const fetchProjects = async ({env, currentProjectId, projectIds}:{env: string; currentProjectId: string; projectIds: string[]})=>{

   setTimeout(() => {
         if (env === 'development') {
           const projects = generateDummyProjects();
           const retrivedProjectIds = projects.map((project) => {
             createStore(projectServiceProvider, project.id, project);
             return project.id;
           });

           if (projects.length > 0) {
             const mergedIds = Array.from(new Set([...projectIds, ...retrivedProjectIds]));
             updateStore<Projects>(projectServiceProvider, projectServiceProvider, {
               actors: currentProjectId ? ['projectIds'] : ['projectIds', 'currentProjectId'],
               store: currentProjectId
                 ? { projectIds: mergedIds }
                 : { projectIds: mergedIds, currentProjectId: mergedIds[0] }
             });
           }

           return;
         }
   }, 2000);

    // TODO: Fetch from database if in production

}

  interface Projects{
    projectIds: Array<string>
    currentProjectId: string
  }