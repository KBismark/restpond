import { ChevronRight, ChevronDown, Folder, FolderOpen, File } from 'lucide-react';
import { TreeNode } from './types'
import { useState } from 'react';
import { updateSideBarRouteStore } from './store';

interface TreeItemProps {
  item: TreeNode;
  level: number;
  onToggle: (id: string) => void;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onContextMenu: (e: React.MouseEvent, node: TreeNode, level: number) => void;
}

export const TreeItem: React.FC<TreeItemProps> = ({
  item,
  level,
  onToggle,
  isSelected,
  onSelect,
  onContextMenu
}) => {
  const indent = level * 12;
  // const [isOpen, setOpenStatus] = useState(item.isOpen)
  
  return (
    <button
      className={`
        flex items-center px-2 py-1 cursor-pointer hover:bg-gray-100 border-none w-full
        ${isSelected ? 'bg-blue-100' : ''}
      `}
      style={{ paddingLeft: `${indent}px` }}
      onClick={() => {
        onSelect(item.id);
        onToggle(item.id);
        // updateSideBarRouteStore({actors: ['selectedItem']})
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        onContextMenu(e, item, level);
        updateSideBarRouteStore({actors: ['contextItem'], store: {contextItem: item}});
      }}
    >
      {item.type === 'folder' && (
        <span 
          // onClick={(e) => {
          //   e.stopPropagation();
          //   onToggle(item.id);
          // }}
          className="p-1"
        >
          {item.isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </span>
      )}
      
        {item.type === 'folder' ? (
          item.isOpen ? <FolderOpen size={16} fill='#546e7a' stroke='#263238' /> : <Folder fill='#546e7a' stroke='#263238' size={16} />
        ) : (
          <File fill='#b0bec5' stroke='#263238' size={16} />
        )}
        
        <span className="ml-2 text-sm font-sans-f font-medium truncate">{item.name}</span>
    </button>
  );
};