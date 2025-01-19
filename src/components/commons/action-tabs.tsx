import { X } from "lucide-react"
import React from "react";


const ActionBar: React.FC<ActionBarProps> = ({children, onClose, closeText = 'Cancel' })=>{

    return (
        <div className="flex items-center justify-between space-x-2 p-2 border-b">
      
        <div>
         {
          onClose && (
            <button
              type='button'
              className={`flex w-full justify-center items-center px-4 py-2 text-sm hover:text-red-600 hover:bg-white/70 rounded-lg transition-all duration-300`}
              onClick={onClose}
            >
              <X size={14} className="mr-1" aria-hidden={'true'} />
              {closeText}
            </button>
          )
         }
        </div>
        
         {children}
      </div>
    )
}

interface ActionBarProps {
    onClose?: ()=>void;
    children?: React.ReactNode|React.JSX.Element;
    closeText?: ({}&string)|'Cancel';
}


export default ActionBar;