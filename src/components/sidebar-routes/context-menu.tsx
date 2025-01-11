import { Menu } from '@headlessui/react';
import { Edit2, Trash2, Copy, FolderPlus, FilePlus } from 'lucide-react';
import { ContextMenuPosition } from './types';

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
    <div 
      className="fixed z-50 bg-white shadow-lg rounded-md py-1 w-48"
      style={{ top: position.y, left: position.x }}
    >
      <Menu>
        <Menu.Item>
          {({ active }) => (
            <button
              className={`${active ? 'bg-gray-100' : ''} flex w-full items-center px-3 py-2 text-sm`}
              onClick={onRename}
            >
              <Edit2 size={14} className="mr-2" />
              Rename
            </button>
          )}
        </Menu.Item>
        <Menu.Item>
          {({ active }) => (
            <button
              className={`${active ? 'bg-gray-100' : ''} flex w-full items-center px-3 py-2 text-sm text-red-600`}
              onClick={onDelete}
            >
              <Trash2 size={14} className="mr-2" />
              Delete
            </button>
          )}
        </Menu.Item>
      </Menu>
    </div>
  );
};