import { useCallback, useMemo, useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import BluryContainer from "../components/commons/blury-container";

export type SelectorOptions = {[k: string]: boolean;}
export interface SelectorProps{
    onChange?: (selectedKey: string)=>void;
    options: string[];
    selectedKey?: string;
    /** Set to true to make selector matains it own state. Default true */
    stateful?: boolean
    className?: React.JSX.IntrinsicElements['button']['className']
}

export const Selector = ({options, selectedKey, stateful = true, onChange, className}: SelectorProps)=>{
    // const optionKeys = useMemo(()=>Object.keys(options),[options])
    const [selected, setSelectionKey] = useState(selectedKey);
    
    const onSelection = useCallback((optionKey: string)=>{
        if(stateful){
            setSelectionKey(optionKey)
        }
        onChange&&onChange(optionKey);
        
    },[selected, stateful]);

    selectedKey = stateful? selected: selectedKey;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button 
                    className={
                        `group rounded-md py-2 px-3 hover:bg-blue-100/15 transition-all duration-500 border border-gray-100 shadow-sm flex flex-row justify-between items-center w-full outline-none cursor-pointer `+
                        `${className||''}`
                    }
                >
                    <span className="text-sm font-medium">{selectedKey}</span>
                    <ChevronDown size={20} />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56 p-0 border-none overflow-hidden rounded-lg ml-2 mt-3 mr-4 shadow-lg bg-transparent">
                <BluryContainer 
                outerContainer={{
                    className: 'w-full'
                }} 
                innerContainer={{
                    className: 'w-full py-1'
                }}
                >
                {
                    options.map((option)=>{
                        return (
                            <DropdownMenuItem key={option} className='hover:bg-white transition-all duration-300 focus:bg-white'>
                                <button
                                className={`flex w-full items-center px-4 py-2 text-sm`}
                                onClick={()=>onSelection(option)}
                                >
                                    {/* <Edit2 size={14} className="mr-4" aria-hidden={'true'} /> */}
                                    {option}
                                </button>
                            </DropdownMenuItem>
                        )
                    })
                }

                </BluryContainer>
            </DropdownMenuContent>
            
        </DropdownMenu>
    )
}