import { createStore } from "statestorejs";
import { createServiceHook, createServiceUpdater } from "./util";

export const appServiceProvider = 'app'

export type Theme = 'light'|'dark'
const theme: Theme = window.localStorage.getItem('theme') as Theme || 
(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')

createStore<App>(appServiceProvider,appServiceProvider,{
    theme: theme === 'dark'? 'dark': 'light',
    env: 'development',
})


const service = {provider: appServiceProvider, serviceId: appServiceProvider}
export const useAppStore = createServiceHook<App>(service)
export const updateAppStore = createServiceUpdater<App>(service)





interface App{
    env: 'production'|'development'
    theme: Theme
}