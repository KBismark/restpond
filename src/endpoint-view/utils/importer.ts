import { createStore, deleteStore } from "statestorejs";
import { getSideBarStoreField, restoreSideBarRouteStore, sidebarRoutesStoreId, SideBarRouteStore } from "../../components/sidebar-routes/stores";
import { decryptTextWithRounds } from "../../helpers/crypt";
import { matchRouter } from "../../helpers/server-app-bridge";
import { appCachestorage, appProvider } from "../../store/global";
import { projectsCacheStorage } from "../store";
import { RouteDataType } from "../types";
import { apiConnections, createEndpointConnection, resetAPIconnections } from "./model";
import { findAllEndpoints } from "../../helpers/routes";
import { removeAPIrecents } from "../../store/recents";

export const importData = async ()=>{
    try {
        const file = await new Promise<File>((resolve, reject) => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.rest';
            input.onchange = () => {
                if (input.files && input.files.length > 0) {
                    resolve(input.files[0]);
                } else {
                    reject('No file selected');
                }
            };
            input.click();
        });
    
        const data = await new Promise<string>((resolve, reject) => {

            const reader = new FileReader();

            reader.onload = () => {
                if (typeof reader.result === 'string') {
                    resolve(reader.result);
                } else {
                    reject('Invalid file');
                }
            };

            reader.readAsText(file);
        });
        
        const { text, isTrusted } = decryptTextWithRounds(data, 1);
        if (!isTrusted) {
            throw new Error('Invalid file');
        }

        const decryptedData = JSON.parse(text) as {
          endpoints: string[];
          connections: typeof apiConnections;
          data: RouteDataType[];
          sidebar: SideBarRouteStore
        };

        if (decryptedData) {
            // Deactivate current endpoints
            const projects = getSideBarStoreField('projects');

            findAllEndpoints(projects||[], (node, endpoint) => {
                matchRouter.deactivateRoute(endpoint as `/${string}`);
                removeAPIrecents(endpoint);
            });

            // Update app with imported data

            const { endpoints, sidebar, connections, data: endpointsData } = decryptedData;
            
            // Update sidebar routes
            appCachestorage.setItem<SideBarRouteStore>(sidebarRoutesStoreId, sidebar);
            deleteStore(appProvider, sidebarRoutesStoreId);
            createStore<SideBarRouteStore>(appProvider, sidebarRoutesStoreId, sidebar);
            
            // Re-set API connections with imported data's connections
            resetAPIconnections(connections);

            // Clear current projects storage
            await projectsCacheStorage.clear();

            // Update projects storage with imported data
            for (let index = 0; index < endpoints.length; index++) {
                await projectsCacheStorage.setItem(endpoints[index], endpointsData[index]);
            }

            // Register connected endpoints from imported data
            const entries = Object.entries(connections);
            for(const [endpoint, connection] of entries){
                if(connection){
                    if(/[1-5][0-9][0-9]/.test(Object.values(connection).join(' '))){
                        createEndpointConnection(endpoint);
                    }
                }
            };

            
        }
    } catch (error) {
        throw error;
    }
}