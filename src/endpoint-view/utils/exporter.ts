import { getSideBarStoreField } from "../../components/sidebar-routes/stores"
import { TreeNode } from "../../components/sidebar-routes/types"
import { encryptTextWithRounds } from "../../helpers/crypt";
import { findAllEndpoints } from "../../helpers/routes"
import { projectsCacheStorage } from "../store";
import { RouteDataType } from "../types";


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

    const exportingData = {endpoints, data: endpointsData}

    const url = URL.createObjectURL(
      new Blob([encryptTextWithRounds(JSON.stringify(exportingData), 1)], 
      { type: 'text/plain' })
    );
    const link = document.createElement('a');
    link.href = url;
    link.download = 'restpond.rest'; // Default filename
    link.click();

    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(url);
    
  } catch (error) {
    
  }


}