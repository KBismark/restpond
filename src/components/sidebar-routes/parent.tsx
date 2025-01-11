import { useState } from 'react';
import { TreeItem } from './item';
import { TreeNode } from './types';
import { TreeActions } from './actions';

interface FolderTreeProps {
  data: TreeNode[];
  onUpdate: (nodes: TreeNode[]) => void;
  onContextMenu?: (e: React.MouseEvent, node: TreeNode) => void;
  filter?: string;
}

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

export const FolderTree: React.FC<FolderTreeProps> = ({ data, onUpdate }) => {
  const [selectedId, setSelectedId] = useState<string>();

  const renderTree = (nodes: TreeNode[], level: number = 0) => {
    return nodes.map((node) => (
      <div key={node.id}>
    <TreeItem
      item={node}
      level={level}
      onToggle={(id) => {
        const updated = toggleNode(data, id);
        onUpdate(updated);
      }}
      isSelected={selectedId === node.id}
      onSelect={setSelectedId}
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




