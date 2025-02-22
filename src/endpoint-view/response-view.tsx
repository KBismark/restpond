import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '../components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { Clock, MoreHorizontal, Settings, Settings2 } from 'lucide-react';
import BluryContainer from '../components/commons/blury-container';
import { Selector } from './selector';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { generateContentAsJSON } from './utils/ai-response-generator';
import ResponseHeaderSetting from './set-hearders';
import { APIModel, EndpointViewSettings, ResponseStatus, RouteDataType } from './types';
import { projectsCacheStorage } from './store';
import { defaultResponseRouteValues, defaultRouteModel, requestMethods, responseStatuses } from './utils/model';

interface TabItemProps {
  label: string;
  count?: number;
}

const TabItem = ({ label, count }: TabItemProps) => (
  <div className='mr-4'>
    <TabsTrigger value={label.toLowerCase()} className="text-sm">
        {label} {count && `(${count})`}
    </TabsTrigger>
  </div>
);





const dropdownSpecificItemClassName: {[k in ResponseStatus]: string} = {
  '200': 'text-[#2fbe76]',
  '201': 'text-[#2fbe76]',
  '203': 'text-[#2fbe76]',
  '301': 'text-[#2e90fa]',
  '302': 'text-[#2e90fa]',
  '401': 'text-[#f55252]',
  '403': 'text-[#f55252]',
  '404': 'text-[#f55252]',
  '500': 'text-[#e87e1a]',
}


type ResponseViewProps = {
  serverEndpoint: string, 
  apiData: RouteDataType|null, 
  settings: EndpointViewSettings;
  updateSettings: (settings: EndpointViewSettings)=>void; 
  updateRouteStatusData: <T extends keyof RouteDataType["GET"]["200"]>(key: T, value: RouteDataType["GET"]["200"][T]) => void
};

const ResponseView = ({serverEndpoint, apiData, updateRouteStatusData, settings, updateSettings}: ResponseViewProps) => {

  const selectedStatus = settings.status;
  const selectedMethod = settings.method;
  const responseBodyText = apiData? apiData[selectedMethod][selectedStatus].body : 'Paste response body here...';
  const responseType = apiData? apiData[selectedMethod][selectedStatus].responseType : 'text';
  // alert(`selectedStatus: ${selectedStatus} and method: ${settings.method}`);
  
  // const [selectedStatus, setSelectedStatus] = useState<ResponseStatus>(200);
  // const [responseBodyText, setResponseBody] = useState<string>(apiData? apiData[selectedMethod][selectedStatus].body : 'Paste response body here...');
  const [waitingAiResponse, setWaitingAiResponse] = useState<boolean>(false);
  const [showAPIKey, setShowAPIKey] = useState<boolean>(true);
  const aiPromptRef = useRef<HTMLTextAreaElement>(null);
  const responseBodyRef = useRef<HTMLPreElement>(null);
  
  
  useEffect(() => {

      const responseBody = responseBodyRef.current as unknown as HTMLPreElement|null
      if(responseBody){
          // responseBody.contentEditable = 'true'

          const onBlur = (e: FocusEvent)=>{
              const value = responseBody.innerText.trim();
              // const store = getEndpointViewStore();
              // if(store){
              //   updateEndpointViewStore({
              //     actors: ['response'],
              //     store: {response: {...store.response, body: {...store.response.body, [store.response.status]: value}  }}
              //   });
              // }
              responseBody.innerText = value;
              // setResponseBody(value);
              updateRouteStatusData('body', value);
          }
          responseBody.addEventListener('blur', onBlur,false);

          return ()=>{
              responseBody.removeEventListener('blur', onBlur, false);
          }
      }

  }, [responseBodyRef.current]);


  const onStatusChange = useCallback((status: number|string) => {
    updateSettings({...settings, status: status as ResponseStatus});
  }, [settings]);

  const onTypeChange = useCallback((type: number|string) => {
    updateRouteStatusData('responseType', String(type).toLowerCase() as 'json'|'text');
  }, [settings]);

  const onShowAPIKey = useCallback(()=>{
    setShowAPIKey(!showAPIKey);
  }, [showAPIKey]);

  const onSend = useCallback(async () => {

    if(!aiPromptRef.current||waitingAiResponse) return;

    const value = aiPromptRef.current.value.trim();
    if(!value) return;

    setWaitingAiResponse(true);
    const response = await generateContentAsJSON(value);
    setWaitingAiResponse(false);

    if(response.errored){
      alert('Error generating response');
      return;
    }

    aiPromptRef.current.value = '';

    const responseBody = responseBodyRef.current as unknown as HTMLPreElement|null;
    if(responseBody){
      responseBody.innerText = (response as any).response.trim()||'Couldn\'t generate with response';
      // setResponseBody((response as any).response.trim()||'Couldn\'t generate with response');
      updateRouteStatusData('body', (response as any).response.trim()||'Couldn\'t generate with response');
    }

  }, [selectedStatus, aiPromptRef.current, responseBodyRef.current, waitingAiResponse]);


  if(!apiData) return null;

  const apiResponseHeaders = apiData[selectedMethod][selectedStatus].headers;

  return (
    <div className="w-full mt-6">
      <Tabs defaultValue="body" className="w-full">
        <div className="border-b border-gray-200 mb-4 mx-2 flex items-center justify-between">
          <TabsList className="flex items-center gap-4 px-2">
            <TabItem label="Body" />
            <TabItem label="Headers" count={apiResponseHeaders.length} />
            <TabItem label="Cookies" />
          </TabsList>
          <div className='flex items-center gap-4'>
             <Selector 
                stateful={false}
                options={responseStatuses as unknown as string[]}
                selectedKey={selectedStatus as unknown as string}
                onChange={onStatusChange}
                className='h-8 shadow-none border-none'
                dropdownMenuClassName='w-6'
                dropdownClassName='bg-white'
                dropdownItemClassName='font-bold'
                dropdownItemContainerClassName='focus:bg-blue-100/10 hover:bg-blue-100/10'
                dropdownSpecificItemClassName={dropdownSpecificItemClassName}
                selectedKeyTextClassName={
                  'bg-[#2fbe7609] '+ dropdownSpecificItemClassName[selectedStatus]
                }
              />
              <Selector 
                stateful={false}
                options={['JSON', 'TEXT',]}
                onChange={onTypeChange}
                selectedKey={responseType.toUpperCase()}
                className='h-8 border-none'
                selectedKeyTextClassName='text-[12px] font-bold'
                dropdownMenuClassName='w-6'
                dropdownClassName='bg-white'
                dropdownItemClassName='font-bold font--code'
                dropdownItemContainerClassName='focus:bg-blue-100/10 hover:bg-blue-100/10'
              />
          </div>
        </div>

        <TabsContent value="body" className="p-0 bg-white ">

            <BluryContainer
                outerContainer={{
                    className: (waitingAiResponse ? 'animate-pulse' : '')
                }} 
                innerContainer={{
                    className: 'p-4 font--code text-[12px]'
                }}
            >
              <div className="flex">
                {/* <div className="text-gray-400 select-none pr-4">
                  {responseData.map((_, i) => (
                    <div key={i} className="leading-6">{i + 1}</div>
                  ))}
                </div>
                <div className="flex-1">
                  <div className="leading-6">[</div>
                  {responseData.map((item, i) => (
                    <div key={i} className="leading-6 pl-4">
                      "{item}"{i < responseData.length - 1 ? "," : ""}
                    </div>
                  ))}
                  <div className="leading-6">]</div>
                </div> */}
                <pre contentEditable={!waitingAiResponse}  ref={responseBodyRef} 
                  className={
                    'w-full mb-4 outline-none border-none overflow-auto max-h-[400px] ' +
                    (waitingAiResponse ? 'animate-pulse' : '')
                  } 
                >
                  {responseBodyText||'Paste response body here...'}
                </pre>
                 {/* <SyntaxHighlighter 
                    ref={responseBodyRef} 
                    customStyle={{outline: 'none', border: 'none', maxHeight: 500, overflow: 'auto', backgroundColor: 'transparent', width: '100%', marginBottom: 16}} 
                    language="json" 
                    // style={{'pre': {outline: 'none', border: 'none'}}}
                >
                    {
                      responseBodyText
                    }
                </SyntaxHighlighter> */}
              </div>
              <div className='flex flex-col items-center mt-4 bg-white px-2 py-1 rounded-md max-h-40'>
                    <textarea disabled={waitingAiResponse} ref={aiPromptRef} className="w-[calc(100%-32px)] mb-1 pt-1 outline-none text-[12px] font--code resize-none max-h-60" placeholder='Generate a sample user posts' ></textarea>
                    <div className='flex items-center justify-between gap-2 w-full'>
                      <div className='flex items-center justify-start gap-2 w-full'>
                        <Button onClick={onShowAPIKey} title={showAPIKey? 'Hide API key' : 'Set API key'} variant='ghost' size="sm" 
                         className={
                          "text-sm text-gray-600 rounded-full flex items-center justify-center w-7 h-7 transition-all duration-300 " + 
                          (showAPIKey ? '' : 'bg-gray-100')
                         }
                         style={{transform: showAPIKey ? 'rotate(0deg)' : 'rotate(90deg)'}}
                        >
                          <Settings2 size={16} />
                        </Button>
                          
                        <input placeholder='Paste Gemini API key here'
                          className={
                            'transition-all duration-300 rounded-sm bg-gray-100 py-[1px] px-2 outline-none text-[12px] font--code ' + 
                            (showAPIKey ? 'w-[calc(100%-32px)]' : 'w-0 invisible') 
                          } 
                        />
                      </div>
                      
                     
                      <Button onClick={onSend} size={'sm'} variant={'default'} className="flex justify-center items-center transition-all duration-500 w-14 h-7 bg-blue-500 active:bg-blue-gray-300  hover:bg-blue-700 text-[12px]" >
                        {
                          !waitingAiResponse ?
                          <span>Send</span>
                          :
                          <span className='animate-spin duration-300 size-5 border-2 border-white border-t-transparent rounded-full block'></span>
                        }
                      </Button>
                    </div>
              </div>
            </BluryContainer>
          {/* <div className="p-4 font-mono text-sm bg-red-200">
            
          </div> */}
        </TabsContent>
        <TabsContent value="headers" className="p-0 bg-white ">
            <ResponseHeaderSetting apiHeaders={apiResponseHeaders} updateRouteStatusData={updateRouteStatusData} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResponseView;