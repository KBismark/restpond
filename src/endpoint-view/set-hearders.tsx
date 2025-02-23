import React, { useEffect, useRef, useState } from 'react';
import { Checkbox } from '../components/ui/checkbox';
import { Button } from '../components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { getAllHeaderNames, getHeaderValues } from './utils/header-names-values';
import { get } from 'http';
import { f } from 'react-router/dist/development/fog-of-war-CCAcUMgB';
import { getUniqueID } from './utils';
import { Header, RouteDataType } from './types';


interface Props{
  apiHeaders: Header[];
  resType: "json" | "text";
   updateRouteStatusData: <T extends keyof RouteDataType["GET"]["200"]>(key: T, value: RouteDataType["GET"]["200"][T]) => void
}

type ValueId = {keyId: string, valueId: string} ;

const COMMON_HEADERS = getAllHeaderNames();

const convertApiHeaders = (apiHeaders: {[k:string]: string}): Header[] => {
  return Object.keys(apiHeaders).map((key, index) => ({
    id: getUniqueID(),
    key,
    value: apiHeaders[key],
    enabled: false
  }));
}



const getValueInputId = (id: string) => {
  return {
    keyId: id,
    valueId: `${id}_value`
  }
};


const ResponseHeaderSetting = ({apiHeaders, resType, updateRouteStatusData}: Props) => {
  const [headers, setHeaders] = useState<Header[]>(apiHeaders);
  // const headers = apiHeaders;
  const [ showHeaderSuggestions, setShowHeaderSuggestions] = useState(false);
  const [currentFocus, setCurrentFocus] = useState< string | ValueId | null>(null);
  const isValueId = currentFocus && typeof currentFocus !=='string';
  const timeout_1 = useRef<any>(undefined);

  useEffect(()=>{

    return ()=>clearTimeout(timeout_1.current);
  });

  useEffect(()=>{
    setHeaders(headers.map(header =>
      header.key.trim().toLowerCase() === 'content-type' ? { ...header, value: resType === 'json'? 'application/json' : 'text/plain'  } : header
    ))
  }, [resType]);
  
  const handleHeaderChange = (id: string, field: 'key' | 'value', value: string, isSuggestion?: boolean) => {
    if(field === 'key'&&value.trim().toLowerCase()==='content-type') return;
    const newHeaders = headers.map(header =>
      header.id === id ? { ...header, [field]: value } : header
    );
    setHeaders(newHeaders);

    // Change event is fired continuously when typing in input field
    // So, we only update the parent component state when it's a suggestion
    isSuggestion && updateRouteStatusData('headers', newHeaders);
  };

  const handleRemoveHeader = (id: string) => {
    const newHeaders = headers.filter(header => header.id !== id);
    setHeaders(newHeaders);
    updateRouteStatusData('headers', newHeaders);
  };

  // const handleCheckboxChange = (id: string) => {
  //   setHeaders(headers.map(header =>
  //     header.id === id ? { ...header, enabled: !header.enabled } : header
  //   ));
  // };

  const addNewHeader = () => {
    const newHeader: Header = {
      id: getUniqueID(),
      key: '',
      value: '',
    };
    setHeaders([...headers, newHeader]);
  };

  const handleFocus = (id: string, value: string, field?: 'value') => {
    if(currentFocus === id) return;
    value = value.trim();
    setCurrentFocus(field === 'value' ? getValueInputId(id) : id);
    setShowHeaderSuggestions(true)
  };

  const handleBlur = () => {
    // Small delay to allow clicking on suggestions
    clearTimeout(timeout_1.current);
    timeout_1.current = setTimeout(() => {
      setShowHeaderSuggestions(false);
      setCurrentFocus(null);
      updateRouteStatusData('headers',[...headers]);
    }, 400);
  };

  const selectSuggestion = (id: string, field: 'key' | 'value', suggestion: string) => {
     handleHeaderChange(id, field, suggestion, true);
     
    if (field === 'key' && currentFocus === id) {
      setCurrentFocus(null);
      setShowHeaderSuggestions(false);
    }
    else if(field === 'value' && isValueId && (currentFocus as ValueId).keyId === id){
      setCurrentFocus(null);
      setShowHeaderSuggestions(false);
    }
  };

  return (
    <div className="w-full p-4">
      <div className="space-y-2">
        {headers.map((header) => {
          const disable = header.key.trim().toLowerCase()==='content-type';
          return (
            <div key={header.id} className="flex items-center gap-3">
              {/* <Checkbox 
                checked={header.enabled}
                onCheckedChange={() => handleCheckboxChange(header.id)}
                className="w-4 h-4"
              /> */}
              <div className="flex-1 grid grid-cols-2 gap-4">
                <div className="relative">
                  <input
                    type="text"
                    readOnly={disable}
                    disabled={disable}
                    value={header.key}
                    onChange={(e) => handleHeaderChange(header.id, 'key', e.target.value)}
                    onFocus={(e) => handleFocus(header.id, e.target.value)}
                    onBlur={handleBlur}
                    className="w-full px-3 py-[3px] font--code text-sm border rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Key"
                  />
                  {showHeaderSuggestions && currentFocus === header.id && (
                    <div className="absolute z-10 w-full mt-1 bg-white border rounded-sm shadow-lg max-h-[300px] overflow-y-auto">
                      {COMMON_HEADERS.filter(h => 
                        h.toLowerCase().includes(header.key.toLowerCase())
                      ).map((suggestion) => (
                        <button
                          key={suggestion}
                          className="px-3 py-2 text-sm hover:bg-blue-100/10 cursor-pointer block w-full text-left "
                          onClick={() => selectSuggestion(header.id, 'key', suggestion)}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="relative">
                    <input
                      type="text"
                      readOnly={disable}
                      disabled={disable}
                      value={header.value}
                      onFocus={(e) => handleFocus(header.id, e.target.value, 'value')}
                      onBlur={handleBlur}
                      onChange={(e) => handleHeaderChange(header.id, 'value', e.target.value)}
                      className="w-full px-3 py-[3px] font--code text-sm border rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Value"
                    />
                    {showHeaderSuggestions && isValueId && (currentFocus as ValueId).keyId === header.id && (
                    <div className="absolute z-10 w-full mt-1 bg-white border rounded-sm shadow-lg max-h-[300px] overflow-y-auto">
                      {getHeaderValues(header.key).filter(h => 
                        h.toLowerCase().includes(header.value.toLowerCase())
                      ).map((suggestion) => (
                        <button
                          key={suggestion}
                          className="px-3 py-2 text-sm hover:bg-blue-100/10 cursor-pointer block w-full text-left "
                          onClick={() => selectSuggestion(header.id, 'value', suggestion)}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div>
                  <button disabled={disable} onClick={ !disable?()=>handleRemoveHeader(header.id):undefined} title="Remove header" type="button" className='group w-6 h-6 rounded-md border bg-gray-50 flex items-center justify-center cursor-pointer hover:bg-red-100/15'>
                      <Trash2 size={15} className="text-gray-600 group-hover:text-red-600 transition-all duration-300 " />
                  </button>
              </div>
            </div>
          )
        })}
      </div>
      
      <Button
        onClick={addNewHeader}
        variant="ghost"
        size="sm"
        className="mt-4 text-blue-500 hover:text-blue-600 hover:bg-blue-50"
      >
        <Plus className="w-4 h-4 mr-1" />
        Add header
      </Button>
    </div>
  );
};

export default ResponseHeaderSetting;