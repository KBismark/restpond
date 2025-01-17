import { FolderPlus, FilePlus, X, Trash2 } from 'lucide-react';
import { 
  DropdownMenuTrigger, 
  DropdownMenu, 
  DropdownMenuContent,
  DropdownMenuItem
} from '../ui/dropdown-menu';
import BluryContainer from '../commons/blury-container';
import { Input } from '@headlessui/react';
import { useCallback, useState } from 'react';

interface TreeActionsProps {
  onCreateFile: () => void;
  onCreateFolder: () => void;
}

export const TreeActions: React.FC<TreeActionsProps> = ({
  onCreateFile,
  onCreateFolder,
}) => {
   const [type, setType] = useState<'File'|'Folder'>('File');

   const createFile = useCallback(()=>{
    setType('File');
    // onCreateFile()
   },[type]);


   const createFolder = useCallback(()=>{
    setType('Folder');
    // onCreateFile()
   },[type])


  return (
    <DropdownMenu>
      <div className="flex items-center justify-end space-x-2 p-2 border-b">
      
      <DropdownMenuTrigger onClick={createFile} asChild>
        <button
          onClick={createFile}
          className="p-1 hover:bg-gray-100 rounded"
          title="New File"
        >
          <FilePlus size={16} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuTrigger onClick={createFolder} asChild>
        <button
          onClick={createFolder}
          className="p-1 hover:bg-gray-100 rounded"
          title="New Folder"
        >
          <FolderPlus size={16} />
        </button>
      </DropdownMenuTrigger>

      </div>

      <DropdownMenuContent align="start" className="w-52 p-0 border-none overflow-hidden rounded-lg -ml-7 shadow-lg bg-transparent">
        <BluryContainer 
          outerContainer={{
            className: 'w-full'
          }} 
          innerContainer={{
            className: 'w-full py-1'
          }}
        >
            <div className='p-4'><Input type='text' placeholder={`${type} name`} className='w-full px-2 bg-white/70 rounded-sm' /></div>
            
            <button
              className={`flex w-full items-center px-4 py-2 text-sm text-red-600 bg-red-50/10 hover:bg-red-50/20 transition-all duration-300`}
              onClick={undefined}
            >
              <Trash2 size={14} className="mr-2" aria-hidden={'true'} />
              Cancel
            </button>
          
        </BluryContainer>
      </DropdownMenuContent>
    
    {/* <div className="flex items-center justify-end space-x-2 p-2 border-b">
      <button
        onClick={onCreateFile}
        className="p-1 hover:bg-gray-100 rounded"
        title="New File"
      >
        <FilePlus size={16} />
      </button>
      <button
        onClick={onCreateFolder}
        className="p-1 hover:bg-gray-100 rounded"
        title="New Folder"
      >
        <FolderPlus size={16} />
      </button>
    </div> */}
    </DropdownMenu>
  );
};