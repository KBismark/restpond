import { getSideBarStoreField, SideBarRouteStore } from "../../components/sidebar-routes/stores"
import { encryptTextWithRounds } from "../../helpers/crypt";
import { findAllEndpoints } from "../../helpers/routes"
import { projectsCacheStorage } from "../store";
import { RouteDataType } from "../types";
import { apiConnections } from "./model";


export const exportData = async ()=>{
  try {
    const projects = getSideBarStoreField('projects')!;
    const endpoints: string[] = [];
    // Pushes all file nodes into fileNodes
    findAllEndpoints(projects, (node, endpoint) => {
      endpoints.push(endpoint);
    });
    const endpointsData = await Promise.all(
      endpoints.map((endpoint) => projectsCacheStorage.getItem<RouteDataType>(endpoint).then(res=>res.data))
    );

    
    const routes = getSideBarStoreField('projects')!;
    const sidebarRoutes: SideBarRouteStore = {
      selectedItem: null,
      contextItem: null,
      navigatedEndpoint: null,
      projects: routes || [
        {
          id: 'api',
          name: 'api',
          type: 'folder',
          isOpen: true,
          children: [{ id: 'api/index', name: 'index', type: 'file' }]
        }
      ]
    };

    const exportingData = {endpoints, sidebar: sidebarRoutes, connections: apiConnections, data: endpointsData}

    const url = URL.createObjectURL(
      new Blob([encryptTextWithRounds(JSON.stringify(exportingData), 1)], 
      { type: 'text/plain' })
    );
    const link = document.createElement('a');
    link.href = url;
    link.download = 'restpond.rest'; // Default filename
    link.click();

    // Avoids memory leaks
    URL.revokeObjectURL(url);
    
  } catch (error) {
    
  }


}