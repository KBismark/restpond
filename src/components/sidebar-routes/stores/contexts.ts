import { createContext } from "react";
import { ContextMenuPosition } from "../types";


export interface SidebarState {
  contextPosition: ContextMenuPosition | null;
  onContextMenu: (position: ContextMenuPosition) => void;
}
export const SideBarContext = createContext<SidebarState>(null as any);

