import React, { useCallback, useMemo, useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import BluryContainer from "../components/commons/blury-container";

export type SelectorOptions = {[k: string]: boolean;}
export interface SelectorProps{
    onChange?: (selectedKey: string | number) => void;
    options: string[]|number[];
    selectedKey?: string|number;
    /** Set to true to make selector matains it own state. Default true */
    stateful?: boolean
    align?: "center" | "end" | "start" | undefined
    className?: React.JSX.IntrinsicElements['button']['className'],
    dropdownMenuClassName?: React.JSX.IntrinsicElements['div']['className'],
    dropdownClassName?: React.JSX.IntrinsicElements['div']['className'],
    dropdownItemContainerClassName?: React.JSX.IntrinsicElements['button']['className']
    dropdownItemClassName?: React.JSX.IntrinsicElements['button']['className']
    dropdownSpecificItemClassName?: {[k: string]: React.JSX.IntrinsicElements['button']['className']}
    selectedKeyTextClassName?: React.JSX.IntrinsicElements['span']['className']
    selectedStyle?: React.JSX.IntrinsicElements['button']['style']
    selectedChevronIconStyle?: React.JSX.IntrinsicElements['svg']['style']
    selectedChevronIconClassName?: React.JSX.IntrinsicElements['svg']['className']

}

export const Selector = ({options, selectedKey, align, stateful = true, onChange, className, dropdownClassName, dropdownItemClassName, dropdownItemContainerClassName,dropdownMenuClassName, dropdownSpecificItemClassName, selectedKeyTextClassName, selectedStyle, selectedChevronIconStyle, selectedChevronIconClassName}: SelectorProps)=>{
    // const optionKeys = useMemo(()=>Object.keys(options),[options])
    const [selected, setSelectionKey] = useState(selectedKey);
    
    const onSelection = useCallback((optionKey: string|number)=>{ 
        if(stateful){
            setSelectionKey(optionKey)
        }
        onChange&&onChange(optionKey);
        
    },[selected, stateful, onChange]);

    selectedKey = stateful? selected: selectedKey;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button 
                    className={
                        `group rounded-md py-2 px-3 hover:bg-blue-100/15 transition-all duration-500 border border-gray-100 shadow-sm flex flex-row justify-between items-center w-full outline-none cursor-pointer bg-white `+
                        `${className||''}`
                    }
                    style={selectedStyle}
                >
                    <span className={`text-sm font-medium ${selectedKeyTextClassName||''}`}>{selectedKey}</span>
                    <ChevronDown style={selectedChevronIconStyle} className={`ml-4 -mr-2 ${selectedChevronIconClassName}`} size={15} />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align={align||'end'} className={
                "p-0 border-none overflow-hidden rounded-lg ml-1 mt-1 mr-1 shadow-lg bg-transparent "+
                `${dropdownMenuClassName||''}`
            }>
                <BluryContainer 
                outerContainer={{
                    className: dropdownClassName ? `w-full ${dropdownClassName}` : 'w-full'
                }} 
                innerContainer={{
                    className:  'w-full py-1'
                }}
                >
                {
                    options.map((option)=>{
                        return (
                            <DropdownMenuItem key={option} className={`hover:bg-white transition-all duration-300 focus:bg-white ${dropdownItemContainerClassName||''}`}>
                                <button
                                className={`flex w-full items-center px-4 py-2 text-sm ${dropdownItemClassName||''} ${dropdownSpecificItemClassName?.[option]||''}`}
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