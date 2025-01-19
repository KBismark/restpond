import { createStore, createStoreHook, createStoreUpdater, getStore } from "statestorejs";
import { appProvider } from "../../store/global";
import { TreeNode } from "./types";
import { actOnProjectRouteItem, RouteType } from "../../helpers/routes";


const storeName = 'sidebar-routes';

createStore<SideBarRouteStore>(appProvider, storeName, {
    selectedItem: null,
    contextItem: null,
    projects: [
        {
        id: '1',
        name: 'api',
        type: 'folder',
        isOpen: true,
        children: [
            { id: '2', name: 'users', type: 'folder', children: [] },
            {
            id: '3',
            name: 'products',
            type: 'folder',
            children: [
                { id: '4', name: ':id', type: 'file' },
                { id: '5', name: 'index', type: 'file' }
            ]
            },
            { id: '6', name: 'index', type: 'file' }
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

export const addSideBarRoute = ({routes, parentId, level, type}: { routes: RouteType[], parentId: string, level?: number, type: 'file'|'folder' }) => {
  if (routes.length < 1) return;
  const contextItem = getSideBarStoreField('contextItem');
  if (!contextItem || parentId !== contextItem.id) return; // TODO: Alert that an error occured while creating route

  const firstRoute = routes.shift()!;

  const itemExists = contextItem.children!.findIndex((node) => node.name === firstRoute.name) >= 0;
  if (itemExists) return; // TODO: Alert that item exists

  const sidebarRoute: TreeNode = {
    id: firstRoute.name,
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
        id: route.name,
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
        id: lastRoute.name,
        name: lastRoute.name,
        isDynamic: firstRoute.type === 'dynamic',
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

  contextItem.children?.sort((node1, node2) => {
    // Files are rendered below folders
    if (node1.type === 'file') {

      // Index files are always the last file
      if (node2.type === 'folder' || node1.name === 'index') return 1;
    
      
      
      if (node1.isDynamic) {

        if (!node2.isDynamic) {
            if (node2.name === 'index') return -1;
            return 1;
        };

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
  });

  // Force update to reflect on UI
  updateSideBarRouteStore({ actors: ['projects'], store: {} }); 
};

const filterNodes = (nodes: TreeNode[]): TreeNode[] =>
  nodes.filter((node) => {
    
    // if (node.id === item.id) return false;
    if (node.children) {
      node.children = filterNodes(node.children);
    }

    return true;
  });



export interface SideBarRouteStore {
  selectedItem: TreeNode | null;
  contextItem: TreeNode | null;
  projects: TreeNode[];
}