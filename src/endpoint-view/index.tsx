import { router } from '../components/router';
import { Button } from '../components/ui/button';
import { FileView } from './files';
import { data, useParams } from 'react-router';
import ResponseView from './response-view';
import { Selector } from './selector';
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import { G } from 'react-router/dist/development/fog-of-war-CCAcUMgB';
import { APIModel, EndpointViewSettings, RequestMethod, RequestMethodColor, ResponseStatus } from './types';
import { defaultResponseRouteValues, requestMethodColors, requestMethods } from './utils/model';
import { projectsCacheStorage } from './store';

const EndpointViewOldVersion = () => {
    const {file, id, routeName} = useParams<{id: string, file?: string, routeName: string}>()
    // router.getParams( ) as {id: string, file?: string, routeName: string};
    alert( routeName )
    
  return (
    <div className='2xl:justify-center 2xl:flex-row 2xl:flex'>
      <div className="flex min-h-screen px-6 pt-3 pb-6 max-w-7xl sm:ml-16 md:ml-52 2xl:w-[1200px]">
        <div className="flex-1 px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Mian content */}
            <div className="lg:col-span-3">
              
            {
              routeName&&file&&<FileView id={id||''} file={file} routeName={routeName} />
            }

            </div>

          {/* Right Side panel - Rather in App.tsx since it's a fixed element */}
            <div></div>
            
          </div>
        </div>
      </div>
    </div>
  );
};


type RouteDataType = APIModel['apis'][string];

const EndpointView = ()=> {
    const {file, id, routeName} = useParams<{id: string, file?: string, routeName: string}>();
    const [apiData, setApiData] = useState<RouteDataType|null>(null);
    const [settings, setSettings] = useState<EndpointViewSettings>({status: 200, method: 'GET'});


    const resolvedFileName = (file||'').replace(/~/g,'/').replace(/\/index$/g,'');
    const resolvedRouteName = (routeName||'').replace(/~/g,'/').replace(/\/index$/g,'');

    useEffect(()=>{
      fetchResponse(resolvedRouteName);
    },[resolvedRouteName]);

    const fetchResponse = useCallback(async (endpoint: string) => {
      // Get response from cache
      let cachedResponse = await projectsCacheStorage.getItem<RouteDataType>(endpoint);
      if(!cachedResponse.data){
        cachedResponse = await projectsCacheStorage.setItem<RouteDataType>(endpoint, defaultResponseRouteValues);
      }
      if(cachedResponse.data){
        setApiData(cachedResponse.data);
        setSettings({status: 200, method: 'GET'});
      }else{
        setApiData(null); // No data - Shouldn't happen anyway
      }
    }, [resolvedRouteName]);

  return (
    <div className='2xl:justify-center 2xl:flex-row 2xl:flex'>
      <div className="flex min-h-screen px-6 pt-3 pb-6 max-w-7xl sm:ml-16 md:ml-52 2xl:w-[1200px]">
        <div className="flex-1 px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Mian content */}
            <div className="lg:col-span-3">
              
            {
              routeName&&file&& 
              <>
                <ViewTitleOptions settings={settings} updateSettings={setSettings} apiData={apiData} title={resolvedFileName} serverEndpoint={resolvedRouteName} />
                <ResponseView settings={settings} updateSettings={setSettings} serverEndpoint={resolvedRouteName} apiData={apiData} />
              </>
            }

            </div>

          {/* Right Side panel - Rather in App.tsx since it's a fixed element */}
            <div></div>
            
          </div>
        </div>
      </div>
    </div>
  )
}


export default EndpointView;



const requestMethodStyle: {[k in RequestMethod]: string} = {
  GET: 'text-[#2e90fa]',
  POST: 'text-[#ef6820]',
  PUT: 'text-[#2fbe76]',
  DELETE: 'text-[#f55252]',
  PATCH: 'text-[#e87e1a]',
  OPTIONS: 'text-[#9373ee]',
  HEAD: 'text-[#0ea4b7]'
}

const viewTitleDynamicStyles = {
  container: {
    GET: 'has-[input:focus]:border-[#2e90fa]',
    POST: 'has-[input:focus]:border-[#ef6820]',
    PUT: 'has-[input:focus]:border-[#2fbe76]',
    DELETE: 'has-[input:focus]:border-[#f55252]',
    PATCH: 'has-[input:focus]:border-[#e87e1a]',
    OPTIONS: 'has-[input:focus]:border-[#9373ee]',
    HEAD: 'has-[input:focus]:border-[#0ea4b7]'
  },
  selectorContainer: {
    GET: 'group-has-[input:focus]:bg-[#2e90fa]',
    POST: 'group-has-[input:focus]:bg-[#ef6820]',
    PUT: 'group-has-[input:focus]:bg-[#2fbe76]',
    DELETE: 'group-has-[input:focus]:bg-[#f55252]',
    PATCH: 'group-has-[input:focus]:bg-[#e87e1a]',
    OPTIONS: 'group-has-[input:focus]:bg-[#9373ee]',
    HEAD: 'group-has-[input:focus]:bg-[#0ea4b7]'
  }
}


type ViewTitleOptionsProps = {
  title: string, 
  serverEndpoint: string, 
  onConnect?: ()=>void
  apiData: RouteDataType|null
  settings: EndpointViewSettings;
  updateSettings?:  Dispatch<SetStateAction<EndpointViewSettings>>;
};
const ViewTitleOptions = ({title, apiData, settings, updateSettings, serverEndpoint, onConnect}: ViewTitleOptionsProps) => {
  // const [selectedMethod, setSelectedMethod] = useState<RequestMethod>('GET');
  const selectedMethod = settings.method;
  // alert(selectedMethod)
  // alert(settings.status)

  if(!apiData) return null;

  const isConnected = apiData[selectedMethod][200].connected;

  const onMethodChange = (method: string|number) => {
    
    // method!==selectedMethod&&setSelectedMethod(method as RequestMethod);
    updateSettings&&updateSettings((prev: EndpointViewSettings)=>{
      return {...prev, method: method as RequestMethod}
    });
  }
  
  return (
    <div className="flex items-center justify-between gap-4">
       <div className={
          'group transition-all duration-500 flex items-center w-full bg-white border-[1.5px] border-gray-100 rounded-sm has-[input:focus]:border-[1.5px] '+
          viewTitleDynamicStyles.container[selectedMethod]
       }>
           {/* <Button onClick={undefined} size={'sm'} variant={'ghost'} className="transition-all duration-150 w-24 h-7 text-[12px] border-none text-[#2fbe76] bg-[#2fbe7609] group-has-[input:focus]:rounded-none group-has-[input:focus]:bg-[#2fbe76] group-has-[input:focus]:text-white" >
            GET
          </Button> */}
          <Selector 
            stateful={false}
            onChange={onMethodChange}
            align='start'
            options={requestMethods}
            selectedKey={selectedMethod}
            selectedStyle={{width: '8rem', color: requestMethodColors[selectedMethod]}}
            className= {
              'shadow-none transition-all duration-150 w-20 h-7 text-[12px] border-none bg-[#2fbe7609] group-has-[input:focus]:rounded-none ' +
              viewTitleDynamicStyles.selectorContainer[selectedMethod]
            }
            dropdownMenuClassName='w-10'
            dropdownClassName='bg-white'
            dropdownItemClassName='font-bold'
            dropdownItemContainerClassName='focus:bg-blue-100/10 hover:bg-blue-100/10'
            dropdownSpecificItemClassName={requestMethodStyle}
            selectedKeyTextClassName='bg-[#2fbe7609] group-has-[input:focus]:text-white'
            // selectedChevronIconStyle={{color: '#000000'}}
            selectedChevronIconClassName='group-has-[input:focus]:text-white'
          />
          <input title={title} type="text" className="w-full mx-4 pr-3 h-7 outline-none text-[12px] font--code truncate " value={title} />
       </div>
        <Button onClick={undefined} size={'sm'} variant={'default'} 
          className={
            !isConnected ?
            'transition-colors duration-500 px-5 h-8 bg-blue-500 active:bg-blue-300  hover:bg-blue-700'
            :
            'transition-colors duration-500 h-8 bg-red-400 active:bg-red-300  hover:bg-red-600'
          }
        >
         <span className='text-[12px] text-white'>{!isConnected?'Connect':'Disconnect'}</span>
        </Button>
    </div>
  )
}

