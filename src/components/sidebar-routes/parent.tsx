import { Dispatch, SetStateAction, useContext, useState } from 'react';
import { TreeItem } from './item';
import { ContextMenuPosition, TreeNode } from './types';
import { TreeActions } from './actions';
import { addSideBarRoute, useSideBarRouteStore } from './stores';
import { RouteType } from '../../helpers/routes';
import { SideBarContext } from './stores/contexts';

interface FolderTreeProps {
  // data: TreeNode[];
  // onUpdate: (nodes: TreeNode[]) => void;
  // onContextMenu: (e: React.MouseEvent, node: TreeNode, level: number) => void;
  // filter?: string;
  // parentContextId: ContextId
  setContextPostion: Dispatch<SetStateAction<ContextMenuPosition | null>>
}


export const FolderTree: React.FC<FolderTreeProps> = ({setContextPostion}) => {
  // const [selectedId, setSelectedId] = useState<string>();
  const {projects: data, selectedItem} = useSideBarRouteStore({watch: ['projects', 'selectedItem']})!;

  // const parentContext = useContext(SideBarContext);
  // useStateContext<SidebarState>(parentContextId, []);
  const onContextMenu = (e: React.MouseEvent)=>{
    setContextPostion({x: e.clientX, y: e.clientY})
  }


  const onCreateFolder = (folderData: RouteType[])=>{
      if(selectedItem&&selectedItem.type === 'folder'){
        addSideBarRoute({routes: folderData, parentId: selectedItem.id, type: 'folder'})
      }
    }
  
    const onCreateFile = (fileData: RouteType[])=>{
      if(selectedItem&&selectedItem.type === 'folder'){
        addSideBarRoute({routes: fileData, parentId: selectedItem.id, type: 'file'})
      }
    }




  const renderTree = (nodes: TreeNode[], level: number = 0, url: string ='') => {
    return nodes.map((node) => {
      const currentUrl = `${url}/${node.name}`;
      const actualRouteName = `${url}~${node.isDynamic? node.name.replace('{',':').replace(/(\})$/, '') : node.name}`;
      return (
        <div key={node.id}>
          <TreeItem
            url={currentUrl}
            routeName={actualRouteName}
            item={node}
            level={level}
            // onToggle={(id) => {
            //   const updatedData = toggleNode(data, id);
            //   updateSideBarRouteStore({actors: ['projects'], store: {projects: updatedData}});
            // }}
            isSelected={selectedItem?.id === node.id}
            // onSelect={setSelectedId}
            onContextMenu={onContextMenu}
          />
          {node.type === 'folder' && node.isOpen && node.children && (
            renderTree(node.children, level + 1, currentUrl)
          )}
        </div>
      )
    });
  };

  return (
    <div className="w-full h-full bg-white">
      <TreeActions
        onCreateFile={onCreateFile}
        onCreateFolder={onCreateFolder}
      />
      <div className="mt-2">
        {renderTree(data)}
      </div>
    </div>
  );
};



const toggleNode = (nodes: TreeNode[], targetId: string): TreeNode[] => {
  return nodes.map(node => {
    if (node.id === targetId) {
      // Toggle the node's open state
      return {
        ...node,
        isOpen: !node.isOpen
      };
    }
    
    // If node has children, recursively search them
    if (node.children?.length) {
      return {
        ...node,
        children: toggleNode(node.children, targetId)
      };
    }
    
    // Return unchanged node if no match
    return node;
  });
};

