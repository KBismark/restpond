import { useState, useCallback, MouseEvent } from 'react';
import { updateSideBarStore, useSideBarStore } from '../../services/sidebar.service';
import { FolderTree } from './parent';
import { SearchBar } from './search';
import { ContextMenu } from './context-menu';
import { TreeNode, ContextMenuPosition } from './types';
import { useRouteParams } from '../router';
import { useSideBarRouteStore } from './store';

export default function Sidebar({ moveToTop }: { moveToTop?: boolean }) {
//   const {id} = useRouteParams();
  const { tabs, currentTab } = useSideBarStore({ watch: ['currentTab'] })!;
  const [activeView, setActiveView] = useState<'files' | 'tabs'>('files');
  const [contextMenu, setContextMenu] = useState<{
    position: ContextMenuPosition;
    item: TreeNode | string;
    type: 'file' | 'tab';
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const {projects: treeData} = useSideBarRouteStore({watch: ['projects']})!

  // const [treeData, setTreeData] = useState<TreeNode[]>([
  //   {
  //     id: '1',
  //     name: 'Project',
  //     type: 'folder',
  //     isOpen: true,
  //     children: [
  //       { id: '2', name: 'src', type: 'folder', children: [] },
  //       { id: '3', name: 'config.json', type: 'file' }
  //     ]
  //   }
  // ]);

  const handleContextMenu = useCallback((e: React.MouseEvent, item: TreeNode | string, type: 'file' | 'tab') => {
    e.preventDefault();
    setContextMenu({
      position: { x: e.clientX, y: e.clientY },
      item,
      type: 'file'
    });
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleDelete = useCallback((item: TreeNode | string) => {
    if (typeof item === 'string') {
      // Handle tab deletion
      // updateSideBarStore({
      //   actors: ['tabs'],
      //   store: { tabs: tabs.filter(tab => tab !== item) }
      // });
    } else {
      // Handle file/folder deletion
      const filterNodes = (nodes: TreeNode[]): TreeNode[] =>
        nodes.filter(node => {
          if (node.id === item.id) return false;
          if (node.children) {
            node.children = filterNodes(node.children);
          }
          return true;
        });

      // setTreeData(filterNodes(treeData));
    }
    setContextMenu(null);
  }, [tabs, treeData]);

  return (
    <div className={'sm:mt-16 sm:pt-2 z-20 lg:w-56 flex flex-col sm:fixed top-0 left-0 bottom-0 bg-white transition-all border-r border-r-gray-100 shadow-sm'}>
      {/* <div className="flex border-b">
        <button
          className={`flex-1 py-2 ${activeView === 'files' ? 'bg-gray-100' : ''}`}
          onClick={() => setActiveView('files')}
        >
          Files
        </button>
        <button
          className={`flex-1 py-2 ${activeView === 'tabs' ? 'bg-gray-100' : ''}`}
          onClick={() => setActiveView('tabs')}
        >
          Tabs
        </button>
      </div> */}

      <SearchBar onSearch={handleSearch} />

      <div className="flex-1 overflow-auto">
          <FolderTree
            data={treeData}
            onUpdate={ /*setTreeData */()=>{}}
            onContextMenu={(e: React.MouseEvent, node: string | TreeNode) => handleContextMenu(e, node, 'file')}
            filter={searchQuery}
          />
      </div>

      {contextMenu && (
        <ContextMenu
          position={contextMenu.position}
          onClose={() => setContextMenu(null)}
          onRename={() => {/* implement rename logic */}}
          onDelete={() => handleDelete(contextMenu.item)}
          isFolder={contextMenu.type === 'file' && (contextMenu.item as TreeNode).type === 'folder'}
        />
      )}
    </div>
  );
}