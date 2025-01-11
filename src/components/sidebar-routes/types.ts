export type ItemType = 'file' | 'folder';

export interface TreeNode {
  id: string;
  name: string;
  type: ItemType;
  children?: TreeNode[];
  parentId?: string;
  isOpen?: boolean;
}

export interface FileOperation {
  type: 'rename' | 'delete' | 'create';
  path: string;
  newPath?: string;
}

export interface ContextMenuPosition {
  x: number;
  y: number;
}