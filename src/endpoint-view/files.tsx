import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Bookmark, BookmarkCheck, ChevronDown, Edit2, FireExtinguisher, Pin, PinIcon, Plus, Save, SaveAll, Trash2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/ui/tooltip";
import { JsonEditor } from "./json-editor";
import { Selector, SelectorOptions } from "./selector";
import { RequestHeaders } from "./file-content/resquest-headers";
import { EndpointData, updateEndpointViewStore, useEndpointViewStore, BODY_TYPES, RESPONSE_STATUSES, RESPONSE_BODY_TYPES, storeName, cachestorage, setInitialEndpointData, getEndpointViewStore } from "./store";
import SyntaxHighlighter from "react-syntax-highlighter";
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { getDerivedStore, getStore } from "statestorejs";
import { appProvider } from "../store/global";
import { ResponseHeaders } from "./file-content/response-headers";
import { Button } from "../components/ui/button";
import { matchRouter, RequestObject, ResponseObject, sendActivatedRouteResponse } from "../helpers/server-app-bridge";
import { StorageResult } from "@codigex/cachestorage";
import { IoCog, IoSaveOutline } from "react-icons/io5";
import { parseResponseBody } from "./utils";

const METHOD_TYPES: SelectorOptions = {
    'GET': true,
    'POST': false,
    'PATCH': false,
    'PUT': false,
    'DELETE': false
}


const BODY_TYPE = Object.keys(BODY_TYPES);
const METHODS = Object.keys(METHOD_TYPES);
const RESPONSES: {[k:string]: number} = {}
const RESPONSE_STATUS = RESPONSE_STATUSES.map((status)=>{
    RESPONSES[`STATUS: ${status}`] = status;
    return `STATUS: ${status}`;
});

export const FileView = ({file, id, routeName}: { id: string; file: string, routeName: string })=>{
  const [hasRetrievedItem, setRetrieveStatus] = useState(false);
  const resolvedRouteName = useMemo(()=>routeName.replace(/~/g, "/").replace(/^[\/]/,'').replace(/(\/index)$/,'') as `/${string}`,[routeName]);
  const resolvedFile = useMemo(()=>file.replace(/~/g, "/"),[file]);
  // Get endpoint data from cache storage if not retrived
  cachestorage.getItem<EndpointData>(resolvedFile||'')
    .then((item)=>{
      setInitialEndpointData(resolvedFile||'', resolvedRouteName, item.data);
    })
    .catch((err)=>{
      console.log('Error:', err);
      
    }) // Handle possible error
    .finally(()=> setRetrieveStatus(true))

  // useEffect(()=>{
  //   !hasRetrievedItem && 
  //     cachestorage.getItem<EndpointData>(props.file||'')
  //     .then((item)=>{
  //       setInitialEndpointData(item.data);
  //     })
  //     .catch((err)=>{}) // Handle possible error
  //     .finally(()=> setRetrieveStatus(true))

  // }, [hasRetrievedItem])

  return hasRetrievedItem? <FileViewContent id={id}  />: null;
}

const FileViewContent = (props: { id: string; }) => {
  // const actualFile = props.file;
  // const endpointName = actualFile.replace(/~/g, "/")//.replace(/^\//, "");
  // const {file: endpointName, routeName} = props;
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const requestBodyRef = useRef<SyntaxHighlighter>(null);
  const {isActive, file: endpointName, routeName, info, request: {method, body, bodyType}} = useEndpointViewStore({watch: ['isActive', 'routeName', 'file', 'info', 'request']})!;
  const status = isActive ? "Active" : 'Inactive';
  // const info = useEndpointViewStoreInfo({ watch: ['description', 'summary'] })!;
  // const {method, body, bodyType} = useEndpointViewStoreRequest({watch: ['method', 'bodyType', 'body']})!;
//   const {status:responseStaus, bodyType: responseBodyType, body: responseBody} = useEndpointViewStoreResponse({watch: ['status', 'bodyType','body']})!;

    const resolvedEndpointName = useMemo(()=>endpointName.replace(/(\/index)$/,''),[endpointName])

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      const adjustHeight = () => {
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
      };
      textarea.addEventListener("input", adjustHeight);
      adjustHeight();
      return () => textarea.removeEventListener("input", adjustHeight);
    }
  }, []);

  useEffect(() => {
    if(!['POST'].includes(method)) return;
    if(!['Array[]', 'Object{}', 'Multipart/Formdata'].includes(bodyType||'')) return;
    const requestBody = requestBodyRef.current as unknown as HTMLPreElement|null
    if(requestBody){
        requestBody.contentEditable = 'true'
        // requestBody is a PRE element with a CODE element as first child element
        // const codeElement = (requestBody.firstElementChild as HTMLElement) ;
        
        

        const onBlur = (e: FocusEvent)=>{
          const value = requestBody.innerText.trim();
          const store = getEndpointViewStore();
          if(store){
            updateEndpointViewStore({
              actors: ['request'],
              store: {request: {...store.request, body: value}}
            });
            requestBody.innerText = value;
          }
        }
       requestBody.addEventListener('blur', onBlur,false);

        return ()=>{
            requestBody.removeEventListener('blur', onBlur, false);
        }
    }

  }, [method, bodyType, body]);
  

  const handleInputTextChange = (text: string, key: keyof Pick<EndpointData['info'], 'description'|'summary'>)=>{
    // Update silently
    // This is to prevent re-renders on every selection change
    const store = getEndpointViewStore();
    if(store){
      updateEndpointViewStore({
        actors: ['info'],
        store: {info: {...store.info, [key]: text}}
      });
    }
  }

    const handleMethodSelection = useCallback((selected: string)=>{
      const store = getEndpointViewStore();
      if(store){
        updateEndpointViewStore({
          actors: ['request'],
          store: {request: {...store.request, method: selected as EndpointData['request']['method']}}
        });
      }
    }, [])

    const handleBodyTypeSelection = useCallback((selected: string)=>{
       const store = getEndpointViewStore();
      if(store){
        updateEndpointViewStore({
          actors: ['request'],
          store: {request: {...store.request, bodyType: selected as EndpointData['request']['bodyType']}}
        });
      }
    }, [])

    
   

    const onConnectionButtonClick = useCallback( async ()=>{
      if(isActive){
        // Disconnect route
        matchRouter.deactivateRoute(routeName as `/${string}`)
      }else{
        // Register route to receive requests
        matchRouter.registerRoute(routeName as `/${string}`, async (requestData: RequestObject, params)=>{
          let routeItem: StorageResult<EndpointData>;
          const defaultResponseStatus = 200;
          let responseStatus: keyof typeof responseBody = defaultResponseStatus;
          try {
            routeItem = await cachestorage.getItem<EndpointData>(endpointName||'')
          } catch (error) {
            
            return sendActivatedRouteResponse({
              request: requestData,
              response: {
                status: 500,
                body: 'Internal Server Error',
                responseType: 'text',
                headers: {}
              }
            });
          }
          
    
          if(
            !routeItem||!routeItem.data ||
            // Check if the request method is the same as the route method
            routeItem.data.request.method?.toLowerCase() !== requestData.method?.toLowerCase()

          ){
            responseStatus = 404;
          }
          
          

          const { response } = routeItem.data!;
          // const {method, body, bodyType, headers} = request;
          const {status, bodyType: responseBodyType, body: responseBody, headers: responseHeaders} = response;
          const {pathname} = requestData;
          // const {headers: requestHeaders, method: requestMethod, body: requestBody} = requestData;
          const {query} = params;

          // Use current expected response status
          responseStatus = responseStatus !== defaultResponseStatus ? responseStatus : status;
          
          const bodyString = parseResponseBody(responseBody[responseStatus], params);

          

          sendActivatedRouteResponse({
              request: requestData,
              response: {
                status: responseStatus,
                body: bodyString,
                responseType: responseBodyType[responseStatus].toLowerCase() as 'json' | 'text',
                headers: responseHeaders
              }
            });

          

          
        })
      }
      updateEndpointViewStore({
        actors:  ['isActive'],
        store: {isActive: !isActive}
      })
    },[isActive, routeName])
    
    


  return (
    <div className="prose prose-slate w-full mt-4">
      <div className="flex flex-row items-center justify-between mb-6">
        <div className="flex flex-row items-center mr-6">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <h2 className="text-2xl mb-4 font-mono-f font-bold truncate mr-4 cursor-default ">
                  {resolvedEndpointName}
                </h2>
              </TooltipTrigger>
              <TooltipContent
                aria-hidden="true"
                className={`text-[12px] font-mono-f py-1 ${
                  status === "Active" ? "bg-emerald-50 text-emerald-700" : ""
                }`}
              >
                {resolvedEndpointName}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                {status === "Active" ? (
                  <div
                    aria-label="Endpoint status: Active"
                    className="-mt-3 rounded-full flex justify-center items-center flex-col"
                  >
                    <div className="animate-ping duration-1000 w-3 h-3 bg-green-400 rounded-full absolute"></div>
                    <div className="animate-pin w-2.5 h-2.5 bg-green-400 rounded-full absolute"></div>
                  </div>
                ) : (
                  <div
                    aria-label="Endpoint status: Inactive"
                    className="-mt-3 rounded-full flex justify-center items-center flex-col"
                  >
                    <div className="animate-pin w-2.5 h-2.5 bg-gray-700 rounded-full absolute"></div>
                  </div>
                )}
              </TooltipTrigger>
              <TooltipContent
                aria-hidden="true"
                className={`text-[12px] font-mono py-1 ${
                  status === "Active" ? "bg-emerald-50 text-emerald-700" : ""
                }`}
              >
                {status}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex flex-row items-center gap-4">
          {/* <button type="button" className='w-10 h-10 rounded-full border bg-gray-50 flex items-center justify-center cursor-pointer hover:bg-blue-100/15'>
            {
              true? <IoSaveOutline size={22} className="text-gray-600" /> : <BookmarkCheck size={22} className="text-gray-600" />
            }
          </button> */}

          <Button onClick={onConnectionButtonClick} size={'sm'} variant={isActive?'outline':'default'} className="transition-all duration-500 w-28" >
            {isActive? 'Disconnect': 'Connect'}
          </Button>

          
        </div>
      </div>

      <section className="mb-8 w-full rounded-lg border border-gray-100 shadow-sm bg-white py-3 px-4 flex flex-row">
        <div>
          <div
              className="flex items-center justify-center mr-3 w-10 h-10 rounded-full bg-gradient-to-b from-[#FFD3E3] to-[#FFEFF7] -mt-6 -ml-6 "
          >
              <Pin size={24} className="text-primary" />
          </div>
        </div>
        <div className="w-full mb-4">
          <h3 className="text-lg font-bold mb-1">Description</h3>
          <textarea
            ref={textareaRef}
            title="API description"
            className={
              `resize-none overflow-auto max-h-96 h-full w-full text-sm font-medium outline-none border-none bg-transparent `+
              `${info.description.length>0?'placeholder-black':''}`
            }
            
            placeholder={info.description||'Add information about this endpoint. Type here...'}
            onBlur={(e)=>handleInputTextChange(e.target.value, 'description')}
            onFocus={(e) => e.target.value = info.description}
          />

          <h4 className="font-semibold mb-1 mt-6">Summary</h4>
          <input
            title="API purpose"
            className={
              "w-full text-sm font-medium outline-none border-none bg-transparent "+
              `${info.summary.length>0?'placeholder-black':''}`
            }
            placeholder={info.summary||'Add a summary of this endpoint. Type here...'}
            maxLength={52}
            onBlur={(e) => handleInputTextChange(e.target.value, 'summary')}
            onFocus={(e) => e.target.value = info.summary}
          />
        </div>
      </section>

      <section className="mb-8 w-full bg-white py-3 px-4">
          <div className="w-full mb-4">
              <h3 className="text-lg font-bold mb-1">Request Method</h3>
          </div>
          <Selector 
              options={METHODS} 
              selectedKey={method} 
              stateful={!true} 
              onChange={handleMethodSelection}
          />
        
      </section>

        {
          method === 'POST' &&
          <section className="mb-8 w-full bg-white py-3 px-4">
              <div className="w-full mb-4">
                  <h3 className="text-lg font-bold mb-1">Request Body</h3>
              </div>
              <Selector 
                  options={BODY_TYPE} 
                  selectedKey={bodyType||'Select response body type'} 
                  stateful={!true} 
                  onChange={handleBodyTypeSelection}
              />

              {
                  ['Array[]', 'Object{}', 'Multipart/Formdata'].includes(bodyType as string)  &&
                  <div className="relative mt-5">
                  <SyntaxHighlighter 
                      ref={requestBodyRef} 
                      customStyle={{outline: 'none', border: 'none', maxHeight: 500, overflow: 'auto'}} 
                      language="json" 
                      style={oneDark}
                  >
                      {
                          body as string ||
                          '// Let your team know the request structure. Paste here...' 
                      }
                  </SyntaxHighlighter>
                  </div>
              }
          
          </section>
        }

      <RequestHeaders routeName={routeName} />

      <ResponseStatus routeName={routeName} />

      <ResponseType routeName={routeName} />

      <ResponseBody routeName={routeName} />

      <ResponseHeaders routeName={routeName} />

      {/* <JsonEditor /> */}
    </div>
  );
};




const ResponseStatus = ({routeName}: {routeName: string})=>{
    const {response: {status}} = useEndpointViewStore({watch: ['response']})!;

     const handleStatusSelection = useCallback((selected: string)=>{
      const store = getEndpointViewStore();
      if(store){
        updateEndpointViewStore({
          actors: ['response'],
          store: {response: {...store.response, status: (RESPONSES[selected]) as EndpointData['response']['status'] }}
        });
      }
    }, []);

    return(
        <section className="mb-8 w-full bg-white py-3 px-4">
            <div className="w-full mb-4">
                <h3 className="text-lg font-bold mb-1">Response Status</h3>
            </div>
            <Selector 
                options={RESPONSE_STATUS} 
                selectedKey={`STATUS: ${status}`} 
                stateful={!true} 
                onChange={handleStatusSelection}
            />
          
        </section>
    )
}


const ResponseType = ({routeName}: {routeName: string})=>{
    const {response: {status, bodyType}} = useEndpointViewStore({watch: ['response']})!;
    
     const handleResponseBodyTypeSelection = useCallback((selected: string)=>{
        const store = getEndpointViewStore();
        if(store){
          updateEndpointViewStore({
            actors: ['response'],
            store: {response: {...store.response, bodyType: {...store.response.bodyType, [store.response.status]: selected}  }}
          });
        }
    }, []);

    return(
        <section className="mb-8 w-full bg-white py-3 px-4">
            <div className="w-full mb-4">
                <h3 className="text-lg font-bold mb-1">Response Type</h3>
            </div>
            <Selector 
                options={RESPONSE_BODY_TYPES} 
                selectedKey={bodyType[status]} 
                stateful={!true} 
                onChange={handleResponseBodyTypeSelection}
            />
          
        </section>
    )
}



const ResponseBody = ({routeName}: {routeName: string})=>{
    const {response: {status, bodyType, body}} = useEndpointViewStore({watch: ['response']})!;
     const responseBodyRef = useRef<SyntaxHighlighter>(null);

    useEffect(() => {
        // if(bodyType[status]!=='JSON') return;

        const responseBody = responseBodyRef.current as unknown as HTMLPreElement|null
        if(responseBody){
            responseBody.contentEditable = 'true'

            const onBlur = (e: FocusEvent)=>{
                const value = responseBody.innerText.trim();
                const store = getEndpointViewStore();
                if(store){
                  updateEndpointViewStore({
                    actors: ['response'],
                    store: {response: {...store.response, body: {...store.response.body, [store.response.status]: value}  }}
                  });
                }
                responseBody.innerText = value;
                
            }
            responseBody.addEventListener('blur', onBlur,false);

            return ()=>{
                responseBody.removeEventListener('blur', onBlur, false);
            }
        }

    }, [status, body]);


    // if(bodyType[status]!=='JSON') return null;

    return(
        <section className="mb-8 w-full bg-white py-3 px-4">
            <div className="w-full mb-4">
                <h3 className="text-lg font-bold mb-1">Response Body</h3>
            </div>
            <div className="relative mt-5">
                {
                    [status].map((status)=>{

                        return (
                            <SyntaxHighlighter 
                                key={status}
                                ref={responseBodyRef} 
                                customStyle={{outline: 'none', border: 'none', maxHeight: 500, overflow: 'auto'}} 
                                language="json" 
                                style={oneDark}
                            >
                                {
                                    body[status] as string ||
                                    '// Let your team know the response structure. Paste here...'
                                }
                            </SyntaxHighlighter>
                        )
                    })
                }
            </div>
        
        </section>
    )
}