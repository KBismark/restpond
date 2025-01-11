import { memo } from "react";
import { TbCheck } from "react-icons/tb";
import { updateFilterStore, useFilterStore } from "./filter.service";


const FilterCompoent: React.FC<{}> = () => {
    const {method, status} = useFilterStore({watch: ['method','status']})!
    const selectedMethodsLength = method.length
    const selectedStatusLength = status.length
    // const totalFilters = method.length+status.length;
  
    const handleMethodChange = (value: string) => {
      const newMethods = method.includes(value)
        ? method.filter(m => m !== value)
        : [...method, value];
        updateFilterStore({actors: ['method'], store: {method: newMethods}})
    };
  
    const handleStatusChange = (value: string) => {
      const newStatuses = status.includes(value)
        ? status.filter(s => s !== value)
        : [...status, value];
        updateFilterStore({actors: ['status'], store: {status: newStatuses}})
    };
  
    return (
      <div className="px-2 pt-2 bg-white rounded-lg ">
        <div className="space-y-4">
          <div>
            
            <div className="rounded-l-sm border-l-4 border-l-primary flex items-center justify-between gap-4 py-3 px-4 mb-1 bg-[#FCF8F8] font-medium text-sm text-gray-600">
                <h3 className="text-sm font-medium mb-2">HTTP Method</h3>
                <div className="text-[12px] font-normal flex items-center space-x-2">
                    <span>
                        {
                            selectedMethodsLength<1?'No filter applied':
                            selectedMethodsLength===1?'1 filter applied':
                            `${selectedMethodsLength} filters applied`
                        }
                    </span>
                    {
                        selectedMethodsLength>0&&
                        <button
                            onClick={() =>{
                                updateFilterStore({actors: ['method'], store: {method: []}})
                            }}
                            className="ml-3 shadow-none px-1 py-[1px] border-[1px] hover:bg-gray-100 bg-slate-50 rounded-full text-slate-600 flex items-center justify-center"
                        >
                            <div className='mr-0 font-mono text-[11px] text-black'>Clear</div>
                        </button> 
                    }

                    
                </div>
            </div>
            <div className="space-y-2">
              {['GET', 'POST', 'PUT', 'DELETE'].map((m) => {
                const selected = method.includes(m)
                return (
                    <div onClick={()=>handleMethodChange(m)} key={m} className="flex items-center gap-2 py-1 cursor-pointer">
                        <span className={`${selected?'bg-primary border-primary':'border-gray-300 shadow-md'} border w-4 h-4 rounded-[3px] ml-3 mr-0 flex flex-col items-center justify-center`}>
                            {selected&&<TbCheck color="#ffffff" />}
                        </span>
                        <span className="text-sm">{m}</span>
                    </div>
                  )
              })}
            </div>
          </div>
          
          <div className="mt-3">
            <div className="rounded-l-sm border-l-4 border-l-primary flex items-center justify-between gap-4 py-3 px-4 mb-1 bg-[#FCF8F8] font-medium text-sm text-gray-600">
                <h3 className="text-sm font-medium mb-2">Status</h3>
                <div className="text-[12px] font-normal flex items-center space-x-2">
                    <span>
                        {
                            selectedStatusLength<1?'No filter applied':
                            selectedStatusLength===1?'1 filter applied':
                            `${selectedStatusLength} filters applied`
                        }
                    </span>
                    {
                        selectedStatusLength>0&&
                        <button
                            onClick={() =>{
                                updateFilterStore({actors: ['status'], store: {status: []}})
                            }}
                            className="ml-3 shadow-none px-1 py-[1px] border-[1px] hover:bg-gray-100 bg-slate-50 rounded-full text-slate-600 flex items-center justify-center"
                        >
                            <div className='mr-0 font-mono text-[11px] text-black'>Clear</div>
                        </button> 
                    }

                    
                </div>
            </div>
            <div className="space-y-2">
              {['Active', 'Inactive'].map((s) => {
                const selected = status.includes(s)

                return (
                    <div onClick={()=>handleStatusChange(s)} key={s} className="flex items-center gap-2 py-1 cursor-pointer">
                        <span className={`${selected?'bg-primary border-primary':'border-gray-300 shadow-md'} border w-4 h-4 rounded-[3px] ml-3 mr-0 flex flex-col items-center justify-center`}>
                            {selected&&<TbCheck color="#ffffff" />}
                        </span>
                        <span className="text-sm">{s}</span>
                    </div>
                  )
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  export const FilterPanel = memo(FilterCompoent)