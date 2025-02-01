export class MatchRouter {
  private root: TrieNode;

  constructor() {
    this.root = new TrieNode();
  }

  private getActualRoutePath(pathname: `/${string}`) {
    pathname = pathname.replace(/\/$/, '').replace(/[\/][\/]+/g, '/') as `/${string}`;
    return pathname as any === '' ? '/' : pathname;
  }

  private parsePath(pathname: `/${string}`): string[] {
    return pathname.split('/').filter((segment) => segment !== '');
  }

  registerRoute(pathname: `/${string}`, callback?: RegistrationCallback) {
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

  activateRoute(pathname: `/${string}`, errorCallback: (err: Error) => void) {
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
        if (params.hasOwnProperty(paramName)) {
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

  deactivateRoute(pathname: `/${string}`) {
    pathname = this.getActualRoutePath(pathname);
    const segments = this.parsePath(pathname);
    let currentNode = this.root;

    // Traverse to the target node
    for (const segment of segments) {
      if (currentNode.staticChildren.has(segment)) {
        currentNode = currentNode.staticChildren.get(segment)!;
      } else if (currentNode.dynamicChild) {
        currentNode = currentNode.dynamicChild.node;
      } else {
        // Path not found, nothing to deactivate
        return;
      }
    }

    // Remove the callback and params
    currentNode.callback = undefined;
    currentNode.params = [];
  }
}

class TrieNode {
  staticChildren: Map<string, TrieNode>;
  dynamicChild: { paramName: string; node: TrieNode } | null;
  callback?: (...args: any[]) => void;
  params: string[];

  constructor() {
    this.staticChildren = new Map();
    this.dynamicChild = null;
    this.params = [];
  }
}

type RegistrationCallback = ((params: { [k: string]: string | string[] }) => void) | (() => void);


