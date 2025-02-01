import { memo, useCallback, useMemo, useState } from "react";
import { Selector, SelectorOptions } from "../selector";
import { Plus } from "lucide-react";
import { updateEndpointViewStoreRequest, useEndpointViewStoreRequest } from "../store";



const DEFAULT_REQUEST_HEADER_RULE_TYPES: SelectorOptions = {
    'Required': false,
    'No Restriction': true,
}

const DEFAULT_REQUEST_HEADER_RULES = Object.keys(DEFAULT_REQUEST_HEADER_RULE_TYPES)

export const RequestHeaders = memo(()=>{
    const {headers} = useEndpointViewStoreRequest({watch: ['headers']})!

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
        updateEndpointViewStoreRequest({
            actors: ['headers'],
            store: {
                headers: {...headers,'': 'No Restriction'}
            }
        });
    }
  },[headers]);

  const onBlur = useCallback((text: string, headerName: string)=>{
    text = text.trim();
    if(text.length < 1 || headers[text] || headers[headerName]===''){
        return
    };

    const headerRule = headers[headerName];

    // Delete header name
    headers[headerName] = ''; 
    delete headers[headerName];

    // Update headers
    updateEndpointViewStoreRequest({
        actors: ['headers'],
        store: {
            headers: {...headers, [text]: headerRule}
        }
    });
  },[headers]);

  const onHeaderRuleChange = useCallback((headerRule: string, headerName: string)=>{
    if(typeof headers[headerName]!=='undefined'&&headers[headerName]!==''&&headers[headerName]!==headerRule){
        // Update header rule imperatively
        // This is to prevent re-renders on every selection change
        // headers[headerName] = headerRule; 
        updateEndpointViewStoreRequest({
            actors: [],
            store: {
                headers: {...headers, [headerName]: headerRule}
            }
        });
    }
  },[headers]);


    return(
        <section className="mb-8 w-full bg-white py-3 px-4">
            <div className="w-full mb-4">
                <h3 className="text-lg font-bold mb-1">Request Headers</h3>
            </div>

            {
                headerNames.map((headerName)=>{

                    return (
                        <div key={headerName} className="flex flex-row justify-between items-center mb-4 border-b border-b-gray-100 pb-3">
                            <input
                                title="Request header name"
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
                            <Selector 
                                options={DEFAULT_REQUEST_HEADER_RULES} 
                                selectedKey={headers[headerName]} 
                                stateful={true} 
                                className="max-w-44" 
                                onChange={(selected)=>{
                                    onHeaderRuleChange(selected, headerName)
                                }}
                            />
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