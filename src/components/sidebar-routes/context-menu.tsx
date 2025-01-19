import { Menu, MenuItem } from '@headlessui/react';
import { Edit2, Trash2, Copy, FolderPlus, FilePlus, X, ArrowRight, ChevronRight, Code2, Code } from 'lucide-react';
import { ContextMenuPosition } from './types';
import BluryContainer from '../commons/blury-container';
import { Arrow } from '@radix-ui/react-dropdown-menu';
import { TreeActions } from './actions';
import { 
  DropdownMenuTrigger, 
  DropdownMenu, 
  DropdownMenuContent,
  DropdownMenuItem
} from '../ui/dropdown-menu';
import { addSideBarRoute, getSideBarStoreField, updateSideBarRouteStore } from './store';
import { RouteType } from '../../helpers/routes';

interface ContextMenuProps {
  position: ContextMenuPosition;
  onClose: () => void;
  onRename: () => void;
  onDelete: () => void;
  isFolder: boolean;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  position,
  onClose,
  onRename,
  onDelete,
  isFolder
}) => {
  const onCreateFolder = (folderData: RouteType[])=>{
    const contextItem = getSideBarStoreField('contextItem');
    if(contextItem){
      addSideBarRoute({routes: folderData, parentId: contextItem.id, type: 'folder'})
    }
  }

  const onCreateFile = (fileData: RouteType[])=>{
    const contextItem = getSideBarStoreField('contextItem');
    if(contextItem){
      addSideBarRoute({routes: fileData, parentId: contextItem.id, type: 'file'})
    }
  }

  const close = ()=>{
    updateSideBarRouteStore({actors: ['contextItem'], store: {contextItem: null}});
    onClose();
  }
  return (
    <DropdownMenu open={true} >


        <DropdownMenuContent align="start" className='bg-transparent px-0 overflow-hidden rounded-lg'>
          <BluryContainer outerContainer={{
            className: 'fixed z-50 rounded-lg shadow-lg overflow-hidden',
            style: {top: position.y, left: position.x }
          }} innerContainer={{
            className: 'pt-1 px-0 w-52 rounded-lg',
            
          }}>
              {/* <div 
              className="fixed z-50 bg-white shadow-lg rounded-md py-1 w-48"
              style={{ top: position.y, left: position.x }}
            > */}
              {/* <div className='flex justify-end'>
                <button onClick={onClose} title='Close' className='border-none py-1.5 px-2 hover:bg-white rounded-sm' >
                  <X size={13} aria-hidden={'true'} />
                </button>
              </div> */}
              {/* <Menu> */}
                {
                  isFolder ? 
                  <TreeActions onCloseButtonAtTopClicked={close} onCreateFile={onCreateFile} onCreateFolder={onCreateFolder} />
                  : 
                  <TreeActions onCloseButtonAtTopClicked={close} />
                }
                <DropdownMenuItem className='hover:bg-white transition-all duration-300 focus:bg-white'>
                  {/* {({ active }) => ( */}
                    <button
                      className={`flex w-full justify-between items-center pl-4 pr-2 py-2 text-sm`}
                      onClick={undefined}
                    >
                      <div className='flex items-center'>
                        <Code size={14} className="mr-4" aria-hidden={'true'} />
                        Open
                      </div>
                      <ChevronRight size={14} />
                    </button>
                  {/* )} */}
                </DropdownMenuItem>
                {/* <DropdownMenuItem  className='hover:bg-white transition-all duration-300 focus:bg-white'>
                  {({ active }) => (
                    <button
                      className={`flex w-full justify-between items-center pl-4 pr-2 py-2 text-sm`}
                      onClick={undefined}
                    >
                      <div className='flex items-center'>
                        <FilePlus size={14} className="mr-4" aria-hidden={'true'} />
                        Create File
                      </div>
                      <ChevronRight size={14} />
                    </button>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem  className='hover:bg-white transition-all duration-300 focus:bg-white'>
                  {({ active }) => (
                    <button
                      className={`flex w-full justify-between items-center pl-4 pr-2 py-2 text-sm`}
                      onClick={undefined}
                    >
                      <div className='flex items-center'>
                        <FolderPlus size={14} className="mr-4" aria-hidden={'true'} />
                        New Folder
                      </div>
                      <ChevronRight size={14} />
                    </button>
                  )}
                </DropdownMenuItem> */}
                <DropdownMenuItem  className='hover:bg-white transition-all duration-300 focus:bg-white'>
                  {/* {({ active }) => ( */}
                    <button
                      className={`flex w-full items-center px-4 py-2 text-sm`}
                      onClick={onRename}
                    >
                      <Edit2 size={14} className="mr-4" aria-hidden={'true'} />
                      Rename
                    </button>
                  {/* )} */}
                </DropdownMenuItem>
                <DropdownMenuItem  className='group hover:bg-red-100/20 transition-all duration-600 focus:bg-red-100/20 flex justify-center'>
                    <button
                      className={`flex w-[calc(100%-32px)] items-center px-4 py-2 text-sm text-red-600 bg-white rounded-lg group-hover:bg-transparent  group-hover:rounded-none group-hover:w-full transition-all duration-500`}
                      onClick={onDelete}
                    >
                      <Trash2 size={14} className="mr-4" aria-hidden={'true'} />
                      Delete
                    </button>
                </DropdownMenuItem>
                
              {/* </Menu> */}
            {/* </div> */}
          </BluryContainer>
        </DropdownMenuContent>
    </DropdownMenu>
    
    
  );
};