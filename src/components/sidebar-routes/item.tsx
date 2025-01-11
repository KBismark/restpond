import { ChevronRight, ChevronDown, Folder, FolderOpen, File } from 'lucide-react';
import { TreeNode } from './types'

interface TreeItemProps {
  item: TreeNode;
  level: number;
  onToggle: (id: string) => void;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onContextMenu?: (e: React.MouseEvent, node: TreeNode) => void;
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
  
  return (
    <div
      className={`
        flex items-center px-2 py-1 cursor-pointer hover:bg-gray-100
        ${isSelected ? 'bg-blue-100' : ''}
      `}
      style={{ paddingLeft: `${indent}px` }}
      onClick={() => onSelect(item.id)}
      onContextMenu={(e) => {
        e.preventDefault();
        onContextMenu?.(e, item);
      }}
    >
      {item.type === 'folder' && (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onToggle(item.id);
          }}
          className="p-1"
        >
          {item.isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>
      )}
      
      {item.type === 'folder' ? (
        item.isOpen ? <FolderOpen size={16} /> : <Folder size={16} />
      ) : (
        <File size={16} />
      )}
      
      <span className="ml-2 text-sm">{item.name}</span>
    </div>
  );
};