import { memo, useCallback, useMemo, useState } from "react";
import { Selector, SelectorOptions } from "../selector";
import { Plus, Trash2 } from "lucide-react";
import { getEndpointViewStore, updateEndpointViewStore, useEndpointViewStore } from "../store";




export const ResponseHeaders = memo(({routeName}: {routeName: string})=>{
    const {response: {headers}} = useEndpointViewStore({watch: ['response']})!

    // Sort headers by name
  const headerNames = useMemo(()=>Object.keys(headers).sort((a, b)=>{
    // Sort empty strings to the end
    if(a==='') return 1; 
    if(b==='') return -1;

    // Sort alphabetically
    return a>b?1:-1; 
    
  }),[headers]);

  const onNewHeaderName = useCallback(()=>{
    if(!headers['']){
        const store = getEndpointViewStore();
        if(store){
            updateEndpointViewStore({
            actors: ['response'],
            store: {response: {...store.response, headers: {...store.response.headers, '': ''}  }}
            });
        }
    }
  },[headers]);

  const onRemoveHeader = useCallback((headerName: string)=>{
    if(headerName!==''){
        const store = getEndpointViewStore();
        if(store){
            headers[headerName] = '' as any;
            delete headers[headerName];

            updateEndpointViewStore({
            actors: ['response'],
            store: {response: {...store.response, headers: {...headers}  }}
            });
        }
    }
  },[headers]);

  const onBlur = useCallback((text: string, headerName: string)=>{
    text = text.trim();
    if(text.length < 1 || headers[text] || headers[headerName]=== undefined){
        return
    };

    const headerValue = headers[headerName];

    // Delete header name
    headers[headerName] = undefined as any; 
    delete headers[headerName];

    // Update headers
     const store = getEndpointViewStore();
    if(store){
        updateEndpointViewStore({
        actors: ['response'],
        store: {response: {...store.response, headers: {...store.response.headers, [text]: headerValue}  }}
        });
    }
  },[headers]);

  const onBlurHeaderValue = useCallback((text: string, headerName: string)=>{
    text = text.trim();
    if(text.length < 1 || typeof headers[headerName] === 'undefined' || headers[headerName]=== text){
        return
    };

    

    // Delete header name
    // headers[headerName] = ''; 
    // delete headers[headerName];

    // Update headers
    const store = getEndpointViewStore();
    if(store){
        updateEndpointViewStore({
        actors: ['response'],
        store: {response: {...store.response, headers: {...store.response.headers, [headerName]: text}  }}
        });
    }
  },[headers]);

    return(
        <section className="mb-8 w-full bg-white py-3 px-4">
            <div className="w-full mb-4">
                <h3 className="text-lg font-bold mb-1">Response Headers</h3>
            </div>

            {
                headerNames.map((headerName)=>{
                    const value = headers[headerName];
                    return (
                        <div key={headerName} className="flex flex-row justify-between items-center mb-4 border-b border-b-gray-100 pb-3">
                            <input
                                title="Response header name"
                                className={
                                    `w-full text-sm font-medium outline-none border-none bg-transparent mr-6 `+
                                    `${headerName.length>0?'placeholder-black':''}`
                                }
                                placeholder={headerName||'Add header name. Type here...'}
                                maxLength={36}
                                onBlur={(e)=>{
                                    onBlur(e.target.value, headerName)
                                }}
                                onFocus={(e) => e.target.value = headerName}
                            />
                            
                            <input
                                title="Header value"
                                className={
                                    `w-full text-sm font-medium outline-none border-none bg-transparent mr-6 `+
                                    `${value.length>0?'placeholder-black':''}`
                                }
                                placeholder={value||'Add header value. Type here...'}
                                maxLength={36}
                                onBlur={(e)=>{
                                    onBlurHeaderValue(e.target.value, headerName)
                                }}
                                // onFocus={(e) => e.target.value = headerName}
                            />
                            <div>
                                <button onClick={()=>onRemoveHeader(headerName)} title="Remove header" type="button" className='group w-7 h-7 rounded-lg border bg-gray-50 flex items-center justify-center cursor-pointer hover:bg-red-100/15'>
                                    <Trash2 size={18} className="text-gray-600 group-hover:text-red-600 transition-all duration-300 " />
                                </button>
                            </div>
                        </div>
                    )
                })
            }

            <button 
                type="button"
                className={
                    `mt-11 rounded-md py-2 px-3 border hover:bg-blue-100/15 transition-all duration-500 border-gray-100 shadow-sm flex flex-row justify-center items-center w-full outline-none cursor-pointer `
                }
                onClick={onNewHeaderName}
            >
                <Plus size={20} className="text-gray-800" />
                <span className="text-sm font-medium ml-2">Add new header</span>
                    
            </button>
            
          
        </section>
    )
})