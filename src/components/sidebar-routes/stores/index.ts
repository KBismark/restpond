import { createStore, createStoreHook, createStoreUpdater, getStore } from "statestorejs";
import { appCachestorage, appProvider } from "../../../store/global";
import { TreeNode } from "../types";
import { actOnProjectRouteItem, RouteType } from "../../../helpers/routes";



const storeName = 'sidebar-routes';

createStore<SideBarRouteStore>(appProvider, storeName, {
    selectedItem: null,
    contextItem: null,
    projects: [
        {
        id: 'api',
        name: 'api',
        type: 'folder',
        isOpen: true,
        children: [
          { id: 'index', name: 'index', type: 'file' }
        ]
        }
    ]
});

export const useSideBarRouteStore = createStoreHook<SideBarRouteStore>({
  provider: appProvider,
  storeId: storeName
});

export const updateSideBarRouteStore = createStoreUpdater<SideBarRouteStore>({
  provider: appProvider,
  storeId: storeName,
});

export const getSideBarStoreField = <K extends keyof SideBarRouteStore>(fieldName: K) =>
  getStore<SideBarRouteStore, SideBarRouteStore[K]>(appProvider, storeName, (store) => store[fieldName]);

export const restoreSideBarRouteStore = async ()=>{
  try {
    const store = await appCachestorage.getItem<SideBarRouteStore>(storeName);
    if(store.data){
      updateSideBarRouteStore({actors: [], store: store.data})
    }
  } catch (error) { /** No data was found */ }
}


/** Cache store data */
export const saveSideBarRouteStore = ()=>{
  // Store current state of the store in the cache
  getStore<SideBarRouteStore, void>(appProvider, storeName, async (store) => {
    try {
      await appCachestorage.setItem<SideBarRouteStore>(storeName, { ...store , selectedItem: null, contextItem: null});
    } catch (error) {
      // Cache update wasn't successfull
      return;
    }
  });
}

export const addSideBarRoute = ({routes, parentId, level, type}: { routes: RouteType[], parentId: string, level?: number, type: 'file'|'folder' }) => {
  if (routes.length < 1) return;
  const contextItem = getSideBarStoreField('contextItem') || getSideBarStoreField('selectedItem');
  if (!contextItem || parentId !== contextItem.id) return; // TODO: Alert that an error occured while creating route

  const firstRoute = routes.shift()!;

  const itemExists = contextItem.children!.findIndex((node) => node.name === firstRoute.name) >= 0;
  if (itemExists) return; // TODO: Alert that item exists

  const sidebarRoute: TreeNode = {
    id: `${parentId}/${firstRoute.name}`,
    name: firstRoute.name,
    isDynamic: firstRoute.type === 'dynamic',
    type: 'folder',
    children: []
  };

  const lastRoute = routes.length === 0 ? firstRoute : routes.pop()!;

  // Build routes between first and last routes
  let cursor: TreeNode = sidebarRoute;
  let next: TreeNode;
  routes.forEach((route) => {
    cursor.children = [
      (next = {
        id: `${cursor.id}/${route.name}`,
        name: route.name,
        isDynamic: route.type === 'dynamic',
        type: 'folder',
        children: []
      })
    ];

    cursor = next;
  });

  if (lastRoute !== firstRoute) {
    cursor.children = [
      {
        id: `${cursor.id}/${lastRoute.name}`,
        name: lastRoute.name,
        isDynamic: lastRoute.type === 'dynamic',
        type: type,
        children: []
      }
    ];
  } else {
    // No nested routes, so uses selected type
    sidebarRoute.type = type;
  }

  // Append created node and sort nodes
  contextItem.children?.push(sidebarRoute);

  contextItem.children?.sort(sortNodes);

  // Force update to reflect on UI
  updateSideBarRouteStore({ actors: ['projects'], store: {} });

  saveSideBarRouteStore() // save store data in cache storage
};




const filterNodes = (nodes: TreeNode[]): TreeNode[] =>
  nodes.filter((node) => {
    
    // if (node.id === item.id) return false;
    if (node.children) {
      node.children = filterNodes(node.children);
    }

    return true;
  });





  const sortNodes = (node1: TreeNode, node2: TreeNode) => {
    // Files are rendered below folders
    if (node1.type === 'file') {
      // Index files are always the last file
      if (node2.type === 'folder' || node1.name === 'index') return 1;

      if (node1.isDynamic) {
        if (!node2.isDynamic) {
          if (node2.name === 'index') return -1;
          return 1;
        }

        // Sort dynamic file names
        return [node1.name, node2.name].sort().indexOf(node1.name) - 1;
      }

      if (node2.name === 'index') return -1;

      if (node2.isDynamic) return -1; // Dynamic files are rendered after static files

      // Sort static file names
      return [node1.name, node2.name].sort().indexOf(node1.name) - 1;
    }

    if (node2.type === 'file') return -1; // Files are always rendered after folders

    //-- From here, both nodes are folders --

    if (node1.isDynamic) {
      if (!node2.isDynamic) return 1;

      // Sort dynamic file names
      return [node1.name, node2.name].sort().indexOf(node1.name) - 1;
    }

    if (node2.isDynamic) return -1; // Dynamic files are rendered after static files

    // Sort static file names
    return [node1.name, node2.name].sort().indexOf(node1.name) - 1;
  };




export interface SideBarRouteStore {
  selectedItem: TreeNode | null;
  contextItem: TreeNode | null;
  projects: TreeNode[];
}