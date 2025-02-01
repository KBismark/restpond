import { createStore, createStoreHook, createStoreUpdater, getStore } from 'statestorejs';
import { appProvider } from '../../../store/global';
import { ContextMenuPosition, TreeNode } from '../types';
import { actOnProjectRouteItem, RouteType } from '../../../helpers/routes';

export const componentStoreName = 'components:sidebar-routes';

createStore<ComponentsContexts>(appProvider, componentStoreName, {
    SideBar: {} as SidebarState
});


export interface ComponentsContexts {
    SideBar: SidebarState
}


export interface SidebarState {
  contextPosition: ContextMenuPosition | null;
  onContextMenu: (position: ContextMenuPosition) => void;
}