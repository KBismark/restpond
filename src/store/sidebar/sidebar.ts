import { createStore, createStoreHook } from "statestorejs";
import { appProvider } from "../global";

const config = {
    currentTab: 'Home',
    tabs: ['Home','Projects','Endpoints','Analysis','Logs','Help'],
}
createStore(appProvider, 'sidebar', config);

export const useSideBarStore = createStoreHook<SideBar>({
    provider: appProvider,
    storeId: 'sidebar'
});


export interface SideBar{
    currentTab: string;
    tabs: string[]
}