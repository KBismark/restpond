import { Suspense, createContext, useContext, useMemo, useState } from "react";
import { createStore, getStore, updateStore, useStateStore } from 'statestorejs';
import ErrorBoundary from "./error-boundary";

const DYNAMIC_ROUTES: {[k:string|number]: any} = {};
const STATIC_ROUTES: {[k:string]: any} = {}
let ROUTE_PARAMS: {[k:string]: string} = {};
const PARTS_DYNAMIC_ROUTES: {[k:string|number]: any} = {};
const PARTS_STATIC_ROUTES: {[k:string]: any} = {}
let PARTS_ROUTE_PARAMS: {[k:string]: string} = {};
let pageSetter = (prop:any)=>{};
let hashComponentSetter = (prop:any)=>{}

const PartsContext = createContext({});

const useHashRouter = ()=>{
    const context = useContext(PartsContext);
    return 
}

type RouteRegistrationProps = {
    pathname: `/${string}`;
    Render: (...P:any)=>React.ReactNode|React.JSX.Element;
    Loader?: (...P:any)=>React.ReactNode|React.JSX.Element;
}
export function RegisterRoute({pathname,Render,Loader}:RouteRegistrationProps){
    pathname = getActualRoutePath(pathname);
    if(isDynamicRoute(pathname)){
        const pathData = getDynamicIdentifiers(pathname);
        pathData.Renderer = Render;
        pathData.Loading = Loader;
        let routeContainer =  DYNAMIC_ROUTES[pathData.length];
        if(!routeContainer){
            routeContainer = DYNAMIC_ROUTES[pathData.length] = []
        };
        routeContainer.push(pathData)
        return;
    }
    if(!STATIC_ROUTES[pathname]){
        STATIC_ROUTES[pathname] = {Renderer: Render,Loading: Loader};
    }
}

export function RegisterHashRoute({pathname,Render,Loader}:RouteRegistrationProps){
    pathname = getActualRoutePath(pathname);
    if(isDynamicRoute(pathname)){
        const pathData = getDynamicIdentifiers(pathname);
        pathData.Renderer = Render;
        pathData.Loading = Loader;
        let routeContainer =  PARTS_DYNAMIC_ROUTES[pathData.length];
        if(!routeContainer){
            routeContainer = PARTS_DYNAMIC_ROUTES[pathData.length] = []
        };
        routeContainer.push(pathData)
        return;
    }
    if(!PARTS_STATIC_ROUTES[pathname]){
        PARTS_STATIC_ROUTES[pathname] = {Renderer: Render,Loading: Loader};
    }
}

const p = '#/home/:user'

export type RouterConfigs = {
    '/': RouteRegistrationProps['Render'],
    [k:`/${string}`]: RouteRegistrationProps['Render'] | React.LazyExoticComponent<any> | {
        Component: React.LazyExoticComponent<(props?: any[]) => any>;
        /**
         * An react component to render when an error occurs while loading component dynamically
         */
        ErrorComponent?: (...P:any)=>React.ReactNode|React.JSX.Element;
        /**
         * An react component to render while loading component dynamically for the first time
         */
        LoadingComponent?: (...P:any)=>React.ReactNode|React.JSX.Element;
    };
    /**
     * An react component to render when an error occurs while loading component dynamically. 
     * Used for all routes that has no `ErrorComponent` defined.
     * 
     */
    ErrorComponent?: (...P:any)=>React.ReactNode|React.JSX.Element;
    /**
     * An react component to render while loading component dynamically for the first time. 
     * Used for all routes that has no `ErrorComponent` defined.
     * 
     */
    LoadingComponent?: (...P:any)=>React.ReactNode|React.JSX.Element;
}

export type HashRouterConfigs = {
    '=/': RouteRegistrationProps['Render'],
    [k:`=/${string}`]: RouteRegistrationProps['Render'] | React.LazyExoticComponent<any> | {
        Component: React.LazyExoticComponent<(...P: any) => any>;
        /**
         * An react component to render when an error occurs while loading component dynamically
         */
        ErrorComponent?: (...P:any)=>React.ReactNode|React.JSX.Element;
        /**
         * An react component to render while loading component dynamically for the first time
         */
        LoadingComponent?: (...P:any)=>React.ReactNode|React.JSX.Element;
    };
    /**
     * An react component to render when an error occurs while loading component dynamically. 
     * Used for all routes that has no `ErrorComponent` defined.
     * 
     */
    ErrorComponent?: (...P:any)=>React.ReactNode|React.JSX.Element;
    /**
     * An react component to render while loading component dynamically for the first time. 
     * Used for all routes that has no `ErrorComponent` defined.
     * 
     */
    LoadingComponent?: (...P:any)=>React.ReactNode|React.JSX.Element;
}

type RouterProps = {
    url?: string;
    config: RouterConfigs
}
export function ReactAppRouter({config}:RouterProps){
    createStore('react-app-router-virtual', 'react-app-router-hash-state-store', {hashRoute: ''});
    return (
        <AppRouter config={config} />
    )
}
export function AppRouter({config}:RouterProps){
    const [state,setState] = useState({});
    pageSetter = setState;
    useMemo(()=>{
        setConfigurationRoutes(config)
    },[config]);

    const url = window.location.href;
    ROUTE_PARAMS = {};
    return <PageSwitch url={url} />
}

type HashRouterProps = {
    url?: string;
    config: RouterConfigs
}

let ignoreHashRoutes = false;
export function ReactHashRouter({config}:HashRouterProps){
    const providerId = 'react-app-router-virtual';
    const storeId = 'react-app-router-hash-state-store';
    let {hashRoute} = useStateStore<{hashRoute: string}>(providerId, storeId, ['hashRoute'])!;
    useMemo(()=>{
        setConfigurationRoutes(config,true)
    },[config]);

    if(ignoreHashRoutes){
        return null;
    }

    if(!hashRoute){
        let urlSearchPart = new URLSearchParams(window.location.search).get('hash_route');
        if(!urlSearchPart){
            ignoreHashRoutes = true;
            return null;
        }
        // urlSearchPart = urlSearchPart.replace(/^\?/,'');
        // if(!urlSearchPart){
        //     ignoreHashRoutes = true;
        //     return null;
        // }
        // const splittedPath = urlSearchPart.split('&');
        // let routePath = '';
        // for(let i=0,l=splittedPath.length;i<l;i++){
        //     if(splittedPath[i].startsWith('hash_route=')){
        //         routePath = splittedPath[i];
        //         break;
        //     }
        // }
        // if(!routePath){
        //     ignoreHashRoutes = true;
        //     return null;
        // }

        // hashRoute = routePath.replace('hash_route=','');
        hashRoute = getActualRoutePath(decodeURIComponent(urlSearchPart) as any);

        updateStore<{hashRoute: string}>(providerId, storeId,{
            store: {hashRoute},
            actors: []
        });
    }
   
    PARTS_ROUTE_PARAMS = {};
    return <PageSwitch url={hashRoute} parts={true} />
}

let routeParamSetter = ()=>{};
let hashRouteParamSetter = routeParamSetter;
export function useRouteParams(){
    const [state,setState] = useState(ROUTE_PARAMS);
    routeParamSetter = setState as any;
    return state;
}
export function useHashRouteParams(){
    const [state,setState] = useState(PARTS_ROUTE_PARAMS);
    hashRouteParamSetter = setState as any;
    return state;
}

function setConfigurationRoutes(config:RouterConfigs,parts?:boolean){
    if((config as any).isSet) { return };
    (config as any).isSet = true;
    const routes = Object.keys(config).filter((route)=>route.startsWith('/'));
    const Defaults = {
        ErrorComponent: config.ErrorComponent||ErrorPage,
        LoadingComponent: config.LoadingComponent|| LoadingComponent
    };
    const RouteRegistrationMethod = parts? RegisterHashRoute : RegisterRoute;
    routes.forEach((route)=>{
        if(typeof ((config as any )[route].Component) !== 'undefined' ){
            return RouteRegistrationMethod({
                pathname: route as any,
                Render: (config as any )[route].Component,
                Loader: (config as any )[route].LoadingComponent||Defaults.LoadingComponent
            });
        }else{
            RouteRegistrationMethod({
                pathname: route as any,
                Render: (config as any )[route],
            })
        }
       
       
    })
}

function LoaderSuspense({Loading,Renderer}:{Loading: any,Renderer: any}){
    return (
        <Suspense fallback={<Loading />}>
            <Renderer loaded={true} />
        </Suspense>
    )
}

function ErrorPage({loaded}:{loaded:boolean}){
    return (
        <div style={{textAlign:'center'}}>
            <h1>(ERROR 404) PAGE NOT FOUND</h1>
            <button onClick={()=>router.push({pathname:'/'})}>Go to home page</button>
        </div>
    )
}

function DataLoader({Renderer}:{Renderer: any}){
    const loaded = 'loaded';
    // ||'errored'||'loading';

    return <Renderer loaded={true} dataLoadStatus={loaded} />
}

function LoadingComponent(){
    return null;
}

function PageSwitch({url,parts}:{url:string;parts?:boolean}){
    let pageLoaded = true;
    let pathname = '';
    let Page = ErrorPage;
    let LoadingComponent: any = undefined;
    let static_routes = STATIC_ROUTES;
    let dynamic_routes = DYNAMIC_ROUTES;
    let route_params = ROUTE_PARAMS;
    if(parts){
        static_routes = PARTS_STATIC_ROUTES;
        dynamic_routes = PARTS_DYNAMIC_ROUTES;
        route_params = PARTS_ROUTE_PARAMS;
        pathname = getActualRoutePath(url as any);
    }else{
        const parsedUrl = new URL(url);
        pathname = getActualRoutePath(parsedUrl.pathname as any);
    }
    if(static_routes[pathname]){
        Page = static_routes[pathname].Renderer;
        LoadingComponent =  static_routes[pathname].Loading;
    }else{
        const splittedPath = pathname.split('/');
        const length = splittedPath.length;
        const data = dynamic_routes[length];
        if(data){
            let routeData = {
                firstStatic: '',
                staticCount: 0,
                Renderer: undefined as any,
                Loading: undefined as any
            };
            data.forEach((route: typeof routeData) => {
                if(pathname.startsWith(route.firstStatic)){
                    if(route.staticCount>routeData.staticCount){
                        routeData = route;
                    }
                }
                
            });
            if(routeData.staticCount>0){
                Page = routeData.Renderer;
                LoadingComponent =  routeData.Loading;
                for(let i=0,route;i<length;i++){
                    route = (routeData as any)[i];
                    if(!route.static){
                        route_params[route.name] = decodeURIComponent(splittedPath[i])
                    }
                }
            }else{
                // Request
                pageLoaded = false;
                return <ErrorPage loaded={true} />;
            }
        }else{
            // Request
            pageLoaded = false;
            return <ErrorPage loaded={true} />;
        }
    }
    
    return (
      LoadingComponent ? (
        <LoaderSuspense Loading={LoadingComponent} Renderer={Page} />
      ) : (
        <ErrorBoundary>
          <Page loaded={pageLoaded} />
        </ErrorBoundary>
      )
    );
    
}


function isDynamicRoute(route:string){
    return /\/:[^\s]/.test(route)
}
function isEmpty(value:string){
    if(value.length===0) return true;
    return !(/[^\s]/.test(value))
}
function getActualRoutePath(pathname:`/${string}`){
    pathname = pathname.replace(/\/$/,'') as any;
    if(isEmpty(pathname)){
        pathname = '/'
    }
    return pathname;
}
function getDynamicIdentifiers(route:string){
    const matches = route.split('/');
    const length = matches.length;
    const data: {
        [k:number]:{static:boolean;name:string;},
        length:number;firstStatic:string;
        staticCount:number; Renderer:any; 
        Loading: any
    } = {
        length: length,
        firstStatic: '',
        staticCount: 0,
        Renderer: undefined,
        Loading: undefined
    }
    let match = '', isStatic = false;
    let firstStaticFound = false;
    for(let i = 0; i < length; i++){
        match = matches[i];
        isStatic = !match.startsWith(':');
        if(match.startsWith(':')){
            firstStaticFound = true;
            data[i] = {
                static: false,
                name: match.slice(1)
            };
        }else{
            if(!firstStaticFound){
                if(match){
                    data.firstStatic = `${data.firstStatic}/${match}`;
                }
                data.staticCount++;
            }
            data[i] = {
                static: true,
                name: match
            }
        }
        
    }
    return data;
}



export const router = {
    push({pathname}:{pathname: `/${string}`}){
        const winLocation = window.location;
        if((pathname = getActualRoutePath(pathname))!==getActualRoutePath(winLocation.pathname as any)){
            window.history.pushState(null,'',`${winLocation.origin}${pathname}${winLocation.search}${winLocation.hash}`);
            ignoreHashRoutes = false;
            pageSetter({});
        }
    },
    getParams(){
        return {...ROUTE_PARAMS}
    }
}


export const hashRouter = {
    push({pathname}:{pathname: `/${string}`}){
        const credentials = {
            providerId: 'react-app-router-virtual',
            storeId: 'react-app-router-hash-state-store',
        };
        const store = getStore<{hashRoute: string}>(credentials.providerId, credentials.storeId);
        if(store){
            const {hashRoute} = store;
            if((pathname = getActualRoutePath(pathname))!==hashRoute){
                ignoreHashRoutes = false;
                const url = new URL(window.location.href);
                url.searchParams.set('hash_route',encodeURIComponent(pathname));
                window.history.pushState(null,'',url);
                updateStore<{hashRoute: string}>(
                    credentials.providerId, credentials.storeId,
                    {
                    store: {hashRoute: pathname},
                    actors: ['hashRoute']
                })

            }
        }
       
        
    },
    getParams(){
        return {...PARTS_ROUTE_PARAMS}
    }
}

