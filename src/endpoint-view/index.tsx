import { router } from '../components/router';
import { Button } from '../components/ui/button';
import { FileView } from './files';
import { useParams } from 'react-router';
import ResponseView from './response-view';

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



const ViewTitleOptions = ({title}: {title: string}) => {
// group-hover:bg-[#2fbe76] group-hover:text-white shadow-[#2fbe7662]
  return (
    <div className="flex items-center justify-between gap-4">
       <div className='group transition-all duration-300 flex items-center w-full bg-white border-[1.5px] border-gray-100 rounded-sm has-[input:focus]:border-[1.5px] has-[input:focus]:border-[#2fbe76]'>
           <Button onClick={undefined} size={'sm'} variant={'ghost'} className="transition-all duration-150 w-24 h-7 text-[12px] border-none text-[#2fbe76] bg-[#2fbe7609] group-has-[input:focus]:rounded-none group-has-[input:focus]:bg-[#2fbe76] group-has-[input:focus]:text-white" >
            GET
          </Button>
          <input title={title} type="text" className="w-full mx-4 pr-3 h-7 outline-none text-[12px] font--code truncate " value={title} />
       </div>
        <Button onClick={undefined} size={'sm'} variant={'default'} className="transition-all duration-500 h-7 bg-blue-500  hover:bg-blue-800 text-[12px]" >
          Connect
        </Button>
    </div>
  )
}

