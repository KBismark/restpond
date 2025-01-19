import { useState } from 'react';
import { TreeItem } from './item';
import { TreeNode } from './types';
import { TreeActions } from './actions';
import { updateSideBarRouteStore } from './store';

interface FolderTreeProps {
  data: TreeNode[];
  onUpdate: (nodes: TreeNode[]) => void;
  onContextMenu: (e: React.MouseEvent, node: TreeNode, level: number) => void;
  filter?: string;
}


export const FolderTree: React.FC<FolderTreeProps> = ({ data, onUpdate, onContextMenu }) => {
  const [selectedId, setSelectedId] = useState<string>();

  const renderTree = (nodes: TreeNode[], level: number = 0) => {
    return nodes.map((node) => (
      <div key={node.id}>
        <TreeItem
          item={node}
          level={level}
          onToggle={(id) => {
            const updatedData = toggleNode(data, id);
            updateSideBarRouteStore({actors: ['projects'], store: {projects: updatedData}});
          }}
          isSelected={selectedId === node.id}
          onSelect={setSelectedId}
          onContextMenu={onContextMenu}
        />
        {node.type === 'folder' && node.isOpen && node.children && (
          renderTree(node.children, level + 1)
        )}
      </div>
    ));
  };

  return (
    <div className="w-full h-full bg-white">
      <TreeActions
        onCreateFile={() => {/* implement */}}
        onCreateFolder={() => {/* implement */}}
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

