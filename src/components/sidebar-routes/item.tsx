import { ChevronRight, ChevronDown, Folder, FolderOpen, File } from 'lucide-react';
import { TreeNode } from './types'
import { useState } from 'react';
import { getSideBarStoreField, updateSideBarRouteStore } from './stores';
import { actOnProjectRouteItem } from '../../helpers/routes';
import { router } from '../router';
import { useNavigate } from 'react-router';

interface TreeItemProps {
  item: TreeNode;
  level: number;
  // onToggle: (id: string) => void;
  isSelected: boolean;
  // onSelect: (id: string) => void;
  onContextMenu: (e: React.MouseEvent) => void;
  url: string
  routeName: string
}

export const TreeItem: React.FC<TreeItemProps> = ({
  item,
  level,
  // onToggle,
  isSelected,
  // onSelect,
  onContextMenu,
  url,
  // The exact route name to match whic may include dynamic routes
  routeName
}) => {
  const navigate = useNavigate();
  const isFolder = item.type === 'folder';
  const indent = level * 12;
  
  
  return (
    <button
      title={url}
      className={`
        flex items-center px-2 py-1 cursor-pointer hover:bg-blue-100/10 border-none w-full
        ${isSelected ? 'bg-blue-100/25' : ''}
      `}
      style={{ paddingLeft: `${indent}px` }}
      onClick={() => {
        const routesData = getSideBarStoreField('projects');
        if(routesData){
          // Update selected item
          const updatedRoutesData = actOnProjectRouteItem(routesData, item.id, (node)=>{
            const updateNode = {...node,isOpen: !node.isOpen};

            // We do not want a rerender of all items, hence
            // set selected item internally for this item component only
            // setOpenStatus(updateNode.isOpen);

            // Incase part of the application has subscribed to changes in selected item, 
            // Sets selected item globally 
            updateSideBarRouteStore({store: {selectedItem: updateNode}, actors: ['selectedItem']});
            
            if(!isFolder){
              // router.push({pathname: `/projects/XHt7gdjFJsg5DgsjFgdKFfs/${url.replace(/\//g,'~')}/${routeName.replace(/\//g,'~')}`})
              navigate(`/projects/XHt7gdjFJsg5DgsjFgdKFfs/${url.replace(/\//g,'~')}/${routeName.replace(/\//g,'~')}`)
            }

            return updateNode
          });

          // Update project routes data
          updateSideBarRouteStore({store: {projects: updatedRoutesData}, actors: ['projects']});
        }

      }}
      onContextMenu={(e) => {
        e.preventDefault();
        onContextMenu(e);
        updateSideBarRouteStore({actors: ['contextItem'], store: {contextItem: item}});
      }}
    >
      {isFolder && (
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
      
        {isFolder ? (
          item.isOpen ? <FolderOpen size={16} fill='#546e7a' stroke='#263238' /> : <Folder fill='#546e7a' stroke='#263238' size={16} />
        ) : (
          <File fill='#b0bec5' stroke='#263238' size={16} />
        )}
        
        <span className="ml-2 text-sm font-sans-f font-medium truncate">{item.name}</span>
    </button>
  );
};