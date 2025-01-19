import { TreeNode } from "../components/sidebar-routes/types";

export type RouteType = { type: 'dynamic' | 'static'; name: string };

export function getRouteNames(route: string) {
    // Remove all leading and trailing slashes
    route = route
        .trim()
        .replace(/^[\/]+/, '')
        .replace(/([\/]+)$/, '');

    const routes: RouteType[] = [];

    route.split('/').forEach((name) => {
        name = name.trim();
        if (name.startsWith(':')) {
            if (name.length > 1) {
                // Dynamic Routes
                routes.push({
                  type: 'dynamic',
                  name: `{${name.slice(1)}}`
                });
            }
            return;
        }
        if (name.length > 0) {
            routes.push({
                type: 'static',
                name: name
            });
        }
    });

    return routes;
}


export const actOnProjectRouteItem = (nodes: TreeNode[], targetId: string, cb: (node: TreeNode)=>TreeNode): TreeNode[] => {
  return nodes.map((node) => {
    if (node.id === targetId) {
      return cb(node)
    }

    // If node has children, recursively search them
    if (node.children?.length) {
        node.children = actOnProjectRouteItem(node.children, targetId, cb);
      return node
    }

    // Return unchanged node if no match
    return node;
  });
};