import { useState, useCallback, useEffect, useMemo, memo, useContext } from 'react';
import { FolderTree } from './parent';
import { SearchBar } from './search';
import { ContextMenu } from './context-menu';
import { TreeNode, ContextMenuPosition } from './types';
import {  useSideBarRouteStore } from './stores';
import { ContextId, createContext, destroyContext, updateContext, useStateContext } from 'statestorejs';
import { SideBarContext, SidebarState } from './stores/contexts';






export default function Sidebar() {
  const [position, setPosition] = useState<ContextMenuPosition|null>(null)

  return (
    <div className={'sm:mt-12 sm:pt-2 z-20 lg:w-56 flex flex-col sm:fixed top-0 left-0 bottom-0 bg-white transition-all border-r border-r-gray-100 shadow-sm'}>
        <div className="flex-1 overflow-auto">
          <FolderTree setContextPostion={setPosition} />
        </div>
        <RenderContextMenu contextPosition={position}  />
    </div>
  );
}


const RenderContextMenu = ({contextPosition}: {contextPosition: ContextMenuPosition | null})=>{
  const {contextItem} = useSideBarRouteStore({watch: ['contextItem']})!

  if(!contextItem||!contextPosition) return null;
  return (
    <ContextMenu
      position={contextPosition}
      onRename={() => {/* implement rename logic */}}
      isFolder={contextItem.type === 'folder'}
    />
  )

}
