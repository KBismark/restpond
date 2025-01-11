
import { motion} from 'framer-motion';
import { TbTrash } from "react-icons/tb";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";
// import { Endpoint } from '../../types';
import { useStateStore } from 'statestorejs';
import { Endpoint } from './types';



export const EndpointItem: React.FC<{
    endpointId: string;
    projectId: string
    onAction: (action: 'view' | 'edit' | 'delete', endpoint: Endpoint, projectId: string) => void;
  }> = (props) => {

    // console.log(props);
    if(!props){
      console.error('Props not found');
      console.trace();
      return null;
    }

    const { endpointId, projectId, onAction } = props;
    const endpoint = useStateStore<Endpoint>(projectId, endpointId, undefined/* Watches every prop */)!

    const methodColors = {
      GET: 'bg-blue-100 text-blue-700',
      POST: 'bg-green-100 text-green-700',
      PUT: 'bg-yellow-100 text-yellow-700',
      DELETE: 'bg-red-100 text-red-700',
    };
  
    return (
      <motion.div
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="group grid grid-cols-2 lg:grid-cols-3 gap-4 py-4  hover:bg-gray-50 transition-all relative cursor-pointer"
        role='listitem'
      >
        <div className="flex items-center justify-start">
          <div className='w-16'>
            <span aria-description='HTTP method of endpoint' className={`px-1 py-[0.15rem] rounded-md text-[0.65rem] mx-2 font-bold ${methodColors[endpoint.method]}`}>
              {endpoint.method}
            </span>
          </div>
          <div aria-description='Endpoint URL' className="text-[0.75rem] text-gray-700 font-mono-f">{endpoint.path}</div>
        </div>
  
        <div aria-description='Purpose of Endpoint' className="hidden lg:block text-[0.8rem] text-gray-600 font-serif-f">{endpoint.description}</div>
  
        <div className='flex justify-end pr-3 items-center'>
          <div aria-description='Date of creation' className="hidden md:block text-[0.75rem] text-gray-500 ml-7 mr-3">{endpoint.createdAt.split('-').reverse().join('/')}</div>
          {/* Action buttons - appear on hover */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 justify-end"
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  {
                    endpoint.status === 'Active'?
                    <div aria-label='Endpoint status: Active' className='ml-7 mr-3 sm:mr-0 rounded-full flex justify-center items-center flex-col'>
                      <div className='animate-ping duration-1000 w-2 h-2 bg-green-400 rounded-full absolute'></div>
                      <div className='animate-pin w-2 h-2 bg-green-400 rounded-full absolute'></div>
                    </div>:
                    <div aria-label='Endpoint status: Inactive' className='ml-7 mr-3 sm:mr-0 rounded-full flex justify-center items-center flex-col'>
                      <div className='animate-pin w-2 h-2 bg-gray-700 rounded-full absolute'></div>
                    </div>
                  }
                </TooltipTrigger>
                <TooltipContent  aria-hidden="true" className={`text-[12px] font-mono py-1 ${endpoint.status === 'Active'?'bg-emerald-50 text-emerald-700':''}`} >
                  {
                    endpoint.status
                  }
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    title='Delete'
                    aria-label='Delete edpoint'
                    onClick={() => onAction('delete', endpoint, projectId)}
                    className="hidden sm:block ml-7 p-1 shadow-sm border-[1px] hover:bg-red-100 hover:text-red-600 rounded text-slate-500 "
                  >
                    <TbTrash size={13} />
                  </button>
                </TooltipTrigger>
                <TooltipContent aria-hidden="true" className='text-[12px] font-mono py-1' >Delete Endpoint</TooltipContent>
              </Tooltip>
  
              <button
                onClick={() => onAction('edit', endpoint, projectId)}
                className="hidden sm:flex ml-3 shadow-none px-2 py-[2px] border-[1px] hover:bg-gray-100 bg-slate-50 rounded text-slate-600 items-center justify-center"
              >
                <span className='mr-0 font-mono text-[12px] text-black'>Edit</span>
              </button>
  
            </TooltipProvider>
          </motion.div>
        </div>
      </motion.div>
    );
  };