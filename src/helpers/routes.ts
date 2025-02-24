import { TreeNode } from '../components/sidebar-routes/types';

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

export const actOnProjectRouteItem = (
  nodes: TreeNode[],
  targetId: string,
  cb: (node: TreeNode) => TreeNode
): TreeNode[] => {
  return nodes.map((node) => {
    if (node.id === targetId) {
      return cb(node);
    }

    // If node has children, recursively search them
    if (node.children?.length) {
      node.children = actOnProjectRouteItem(node.children, targetId, cb);
      return node;
    }

    // Return unchanged node if no match
    return node;
  });
};

export const removeNodeById = (nodes: TreeNode[], itemId: string): TreeNode[] =>
  nodes.filter((node) => {
    if (node.id === itemId) return false;
    if (node.children) {
      node.children = removeNodeById(node.children, itemId);
    }
    return true;
  });

export const findAllFileNodes = (nodes: TreeNode[], performer: (node: TreeNode) => any) =>
  nodes.forEach((node) => {
    if (node.type === 'file') {
      performer(node);
    } else if (node.children) {
      findAllFileNodes(node.children, performer);
    }
  });

export const findAllEndpoints = (nodes: TreeNode[], performer: (node: TreeNode, endpoint: string)=>void, url = '') =>{
  nodes.forEach((node) => {
    const newUrl = `${url}/${node.isDynamic ? node.name.replace('{', ':').replace(/(\})$/, '') : node.name}`;
    if (node.type === 'file') {
      // console.log(node.id);

      performer(node, newUrl.replace(/\/index$/, ''));
    }
    if (node.children) {
      findAllEndpoints(node.children, performer, newUrl);
    }
  });
}
