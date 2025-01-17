import { Menu, MenuItem } from '@headlessui/react';
import { Edit2, Trash2, Copy, FolderPlus, FilePlus, X } from 'lucide-react';
import { ContextMenuPosition } from './types';
import BluryContainer from '../commons/blury-container';

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
  return (
    <BluryContainer outerContainer={{
      className: 'fixed z-50 rounded-lg shadow-lg overflow-hidden',
      style: {top: position.y, left: position.x }
    }} innerContainer={{
      className: 'py-1 px-0 w-48 rounded-lg',
      
    }}>
        {/* <div 
        className="fixed z-50 bg-white shadow-lg rounded-md py-1 w-48"
        style={{ top: position.y, left: position.x }}
      > */}
        <div className='flex justify-end'>
          <button onClick={onClose} title='Close' className='border-none py-1.5 px-2 hover:bg-white rounded-sm' >
            <X size={13} aria-hidden={'true'} />
          </button>
        </div>
        <Menu>
          <MenuItem>
            {({ active }) => (
              <button
                className={`${active ? 'bg-white' : ''} flex w-full items-center px-3 py-2 text-sm hover:bg-white/70 transition-all duration-300`}
                onClick={undefined}
              >
                <FilePlus size={14} className="mr-2" aria-hidden={'true'} />
                Create File
              </button>
            )}
          </MenuItem>
          <MenuItem>
            {({ active }) => (
              <button
                className={`${active ? 'bg-white' : ''} flex w-full items-center px-3 py-2 text-sm hover:bg-white/70 transition-all duration-300`}
                onClick={undefined}
              >
                <FolderPlus size={14} className="mr-2" aria-hidden={'true'} />
                New Folder
              </button>
            )}
          </MenuItem>
          <MenuItem>
            {({ active }) => (
              <button
                className={`${active ? 'bg-white' : ''} flex w-full items-center px-3 py-2 text-sm hover:bg-white/70 transition-all duration-300`}
                onClick={onRename}
              >
                <Edit2 size={14} className="mr-2" aria-hidden={'true'} />
                Rename
              </button>
            )}
          </MenuItem>
          <MenuItem>
            {({ active }) => (
              <button
                className={`${active ? 'bg-gray-100' : ''} flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-white/70 transition-all duration-300`}
                onClick={onDelete}
              >
                <Trash2 size={14} className="mr-2" aria-hidden={'true'} />
                Delete
              </button>
            )}
          </MenuItem>
        </Menu>
      {/* </div> */}
    </BluryContainer>
  );
};