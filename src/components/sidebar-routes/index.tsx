import { useState, useCallback, useEffect, useMemo, memo } from 'react';
import { FolderTree } from './parent';
import { SearchBar } from './search';
import { ContextMenu } from './context-menu';
import { TreeNode, ContextMenuPosition } from './types';
import {  useSideBarRouteStore } from './stores';
import { ContextId, createContext, destroyContext, updateContext, useStateContext } from 'statestorejs';


export interface SidebarState {
    searchQuery: string,
    contextPosition:  ContextMenuPosition|null;
    onContextMenu: (position: ContextMenuPosition) => void
}

export default function Sidebar({ moveToTop }: { moveToTop?: boolean }) {
  // const [searchQuery, setSearchQuery] = useState('');
  // const {projects: treeData} = useSideBarRouteStore({watch: ['projects']})!

  // Context stores for component-specific state
  const [contextId, context] = useMemo(()=>createContext<SidebarState>({
    searchQuery: '',
    contextPosition: null,
    onContextMenu(position){
      updateContext<SidebarState>(contextId, context, {
        actors: ['contextPosition'], 
        context: {contextPosition: position}
      })
    }
  }),[])
  
  useEffect(()=>{
    // return ()=>destroyContext(contextId, context)
  },[]);

  const handleSearch = useCallback((query: string) => {
    updateContext<SidebarState>(contextId, context, {
        actors: ['searchQuery'], 
        context: {searchQuery: query}
      })
  }, []);

  return (
    <div className={'sm:mt-16 sm:pt-2 z-20 lg:w-56 flex flex-col sm:fixed top-0 left-0 bottom-0 bg-white transition-all border-r border-r-gray-100 shadow-sm'}>

      <SearchBar onSearch={handleSearch} />

      <div className="flex-1 overflow-auto">
          <FolderTree
            // data={treeData}
            filter={context.value.searchQuery}
            parentContextId={contextId}
          />
      </div>

      <RenderContextMenu parentContextId={contextId} />
    </div>
  );
}


const RenderContextMenu = memo(({parentContextId}: {parentContextId: ContextId})=>{
  const {contextPosition} = useStateContext<SidebarState>(parentContextId, ['contextPosition'])||{};
  const {contextItem} = useSideBarRouteStore({watch: ['contextItem']})!

  if(!contextItem||!contextPosition) return null;
  return (
    <ContextMenu
      parentContextId={parentContextId}
      position={contextPosition}
      onRename={() => {/* implement rename logic */}}
      isFolder={contextItem.type === 'folder'}
    />
  )

})
