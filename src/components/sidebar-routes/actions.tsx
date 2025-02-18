import { FolderPlus, FilePlus, X, Trash2 } from 'lucide-react';
import { 
  DropdownMenuTrigger, 
  DropdownMenu, 
  DropdownMenuContent,
  DropdownMenuItem
} from '../ui/dropdown-menu';
import BluryContainer from '../commons/blury-container';
import { Input } from '@headlessui/react';
import { useCallback, useRef, useState } from 'react';
import ActionBar from '../commons/action-tabs';
import { getRouteNames, RouteType } from '../../helpers/routes';
import { Button } from '../ui/button';

interface TreeActionsProps {
  onCreateFile?: (fileData: RouteType[]) => void;
  onCreateFolder?: (fileData: RouteType[]) => void;
  openRouteCreationDropDown?: boolean;
  onCloseButtonAtTopClicked?: ()=>void;
}

export const TreeActions: React.FC<TreeActionsProps> = ({
  onCreateFile,
  onCreateFolder,
  openRouteCreationDropDown,
  onCloseButtonAtTopClicked
}) => {
  const [isOpened, setIsOpened] = useState(!!openRouteCreationDropDown);
   const [type, setType] = useState<'File'|'Folder'|''>('');
   const inputRef = useRef<HTMLInputElement>(null)

   const triggeredByFile = useCallback(()=>{
    setType('File');
    setIsOpened(true);
    // alert('File');
   },[type, isOpened]);


   const triggeredByFolder = useCallback(()=>{
    setType('Folder');
    setIsOpened(true);
    // ontriggeredByFile()
    // alert('Folder')
   },[type, isOpened])


   const close = useCallback(()=>{
    setIsOpened(!isOpened);
   },[isOpened])

   // Create a route
   const save = useCallback(()=>{
    const routeNames = getRouteNames((inputRef.current?.value||''));
    if(routeNames.length<1) return;
    if(type === 'File'){
      // Create file
      onCreateFile!(routeNames);
    }else{
      // `index` is not allowed to be a folder name
      const lastRoute = routeNames[routeNames.length-1]
      if(lastRoute.name === 'index'&&lastRoute.type === 'static'){
        // TODO: Alert that 'index' can not be used as folder name
        return;
      }
      onCreateFolder!(routeNames);
    }
    
    close() // Closes action pop up

   },[type])

  

  return (
    <DropdownMenu open={isOpened} onOpenChange={close}>
      <ActionBar 
        onClose={undefined}
        renderInPlaceOfClose={
          <div className="flex flex-row items-center gap-2">
            <Button onClick={undefined} size={'sm'} variant={'outline'} className="transition-all duration-500 w-full h-7 text-[12px]" >
              Import
            </Button>

            <Button onClick={undefined} size={'sm'} variant={'default'} className="transition-all duration-500 w-full h-7 bg-blue-500  hover:bg-blue-800 text-[12px] " >
              Export
            </Button>

          
        </div>
        }
      >
        <div>
            <DropdownMenuTrigger></DropdownMenuTrigger>
            { 
              onCreateFile&&
              <button
                type='button'
                onClick={triggeredByFile}
                className="p-1 hover:bg-gray-100 rounded"
                title="New File"
              >
                <FilePlus size={16} />
              </button>
            }
           {
            onCreateFolder&&
              <button
                onClick={triggeredByFolder}
                className="p-1 hover:bg-gray-100 rounded"
                title="New Folder"
              >
                <FolderPlus size={16} />
              </button>
           }
        </div>
      </ActionBar>

      <DropdownMenuContent align="start" className="w-56 p-0 border-none overflow-hidden rounded-lg ml-2 mt-3 shadow-lg bg-transparent">
        <BluryContainer 
          outerContainer={{
            className: 'w-full'
          }} 
          innerContainer={{
            className: 'w-full py-1'
          }}
        >
          <ActionBar onClose={close}>
            <button
              type='button'
              className={`flex w-full justify-center items-center px-4 py-2 text-sm bg-white hover:bg-gray-100/70 rounded-lg transition-all duration-300`}
              onClick={save}
            >
              {/* <X size={14} className="mr-1" aria-hidden={'true'} /> */}
              Save
            </button>
          </ActionBar>
        
          <div className='p-4'><Input ref={inputRef} type='text' placeholder={`${type} name`} className='w-full px-2 bg-white/70 rounded-sm focus:outline-blue-300' /></div>
          
        </BluryContainer>
      </DropdownMenuContent>
    
    </DropdownMenu>
  );
};