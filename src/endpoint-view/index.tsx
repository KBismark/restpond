import { router } from '../components/router';
import { Button } from '../components/ui/button';
import { FileView } from './files';
import { useParams } from 'react-router';
import ResponseView from './response-view';
import { Selector } from './selector';
import { useState } from 'react';
import { G } from 'react-router/dist/development/fog-of-war-CCAcUMgB';

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


const EndpointView = ()=> {
    const {file, id, routeName} = useParams<{id: string, file?: string, routeName: string}>();
    const resolvedFileName = (file||'').replace(/~/g,'/').replace(/\/index$/g,'');
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
                <ViewTitleOptions title={resolvedFileName} />
                <ResponseView />
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


type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'HEAD';
const requestMethods: RequestMethod[] = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'];
const requestMethodColors: {[k in RequestMethod]: string} = {
  GET: '#2e90fa',
  POST: '#ef6820',
  PUT: '#2fbe76',
  DELETE: '#f55252',
  PATCH: '#e87e1a',
  OPTIONS: '#9373ee',
  HEAD: '#0ea4b7'
}
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

const ViewTitleOptions = ({title}: {title: string}) => {
  const [selectedMethod, setSelectedMethod] = useState<RequestMethod>('GET');
  const onMethodChange = (method: string) => {
    method!==selectedMethod&&setSelectedMethod(method as RequestMethod);
  }
// group-hover:bg-[#2fbe76] group-hover:text-white shadow-[#2fbe7662]
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
        <Button onClick={undefined} size={'sm'} variant={'default'} className="transition-all duration-500 h-7 bg-blue-500 active:bg-blue-gray-300  hover:bg-blue-700 text-[12px]" >
          Connect
        </Button>
    </div>
  )
}

