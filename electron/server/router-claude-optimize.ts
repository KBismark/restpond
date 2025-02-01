type RegistrationCallback = ((params: { [k: string]: string | string[] }) => void) | (() => void);

class TrieNode {
  staticChildren: Map<string, TrieNode>;
  dynamicChild: { paramName: string; node: TrieNode } | null;
  callback?: RegistrationCallback;
  params: string[];

  constructor() {
    this.staticChildren = new Map();
    this.dynamicChild = null;
    this.params = [];
  }
}

export class MatchRouter {
  private root: TrieNode;

  constructor() {
    this.root = new TrieNode();
  }

  private getActualRoutePath(pathname: `/${string}`): `/${string}` {
    pathname = pathname.replace(/\/$/, '').replace(/[\/][\/]+/g, '/') as `/${string}`;
    return pathname as any === '' ? '/' : pathname;
  }

  private parsePath(pathname: `/${string}`): string[] {
    return pathname.split('/').filter((segment) => segment !== '');
  }

  registerRoute(pathname: `/${string}`, callback?: RegistrationCallback): void {
    pathname = this.getActualRoutePath(pathname);
    const segments = this.parsePath(pathname);
    let currentNode = this.root;
    const params: string[] = [];

    for (const segment of segments) {
      if (segment.startsWith(':')) {
        // Dynamic segment
        const paramName = segment.slice(1);
        params.push(paramName);

        if (!currentNode.dynamicChild) {
          currentNode.dynamicChild = {
            paramName,
            node: new TrieNode()
          };
        } else if (currentNode.dynamicChild.paramName !== paramName) {
          // Handle case where different parameter names are used at the same position
          currentNode.dynamicChild.paramName = paramName;
        }
        currentNode = currentNode.dynamicChild.node;
      } else {
        // Static segment
        if (!currentNode.staticChildren.has(segment)) {
          currentNode.staticChildren.set(segment, new TrieNode());
        }
        currentNode = currentNode.staticChildren.get(segment)!;
      }
    }

    // Store callback and parameter names at the final node
    currentNode.callback = callback;
    currentNode.params = params;
  }

  activateRoute(pathname: `/${string}`, errorCallback: (err: Error) => void): void {
    pathname = this.getActualRoutePath(pathname);
    const segments = this.parsePath(pathname);
    let currentNode = this.root;
    const params: { [key: string]: string | string[] } = {};

    for (const segment of segments) {
      // Try static match first
      if (currentNode.staticChildren.has(segment)) {
        currentNode = currentNode.staticChildren.get(segment)!;
      } else if (currentNode.dynamicChild) {
        // Dynamic match
        const paramName = currentNode.dynamicChild.paramName;
        const value = decodeURIComponent(segment);

        // Handle multiple values for the same parameter
        if (paramName in params) {
          const existing = params[paramName];
          params[paramName] = Array.isArray(existing) ? [...existing, value] : [existing, value];
        } else {
          params[paramName] = value;
        }

        currentNode = currentNode.dynamicChild.node;
      } else {
        // No match found
        errorCallback(new Error('No endpoint matched route'));
        return;
      }
    }

    if (currentNode.callback) {
      try {
        currentNode.callback(params);
      } catch (error) {
        errorCallback(error as Error);
      }
    } else {
      errorCallback(new Error('No endpoint matched route'));
    }
  }

  deactivateRoute(pathname: `/${string}`): void {
    pathname = this.getActualRoutePath(pathname);
    const segments = this.parsePath(pathname);
    let currentNode = this.root;
    const path: TrieNode[] = [currentNode];

    // Traverse to the target node
    for (const segment of segments) {
      let nextNode: TrieNode | undefined;

      if (currentNode.staticChildren.has(segment)) {
        nextNode = currentNode.staticChildren.get(segment);
      } else if (currentNode.dynamicChild) {
        nextNode = currentNode.dynamicChild.node;
      }

      if (!nextNode) {
        return; // Path not found, nothing to deactivate
      }

      currentNode = nextNode;
      path.push(currentNode);
    }

    // Clean up the node
    currentNode.callback = undefined;
    currentNode.params = [];

    // Clean up empty branches
    for (let i = path.length - 1; i > 0; i--) {
      const node = path[i];
      const parentNode = path[i - 1];

      if (node.staticChildren.size === 0 && !node.dynamicChild && !node.callback) {
        // Remove from static children
        for (const [key, value] of parentNode.staticChildren.entries()) {
          if (value === node) {
            parentNode.staticChildren.delete(key);
            break;
          }
        }

        // Remove from dynamic child if applicable
        if (parentNode.dynamicChild && parentNode.dynamicChild.node === node) {
          parentNode.dynamicChild = null;
        }
      } else {
        break; // Stop if we find a non-empty node
      }
    }
  }
}
