

export class MatchRouter {
  private staticRoutes: { [k: string]: any };
  private dynamicRoutes: { [k: string]: any };

  constructor() {
    this.staticRoutes = {};
    this.dynamicRoutes = {};
  }

  private isDynamicRoute(pathname: string) {
    return /\/:[^\s]/.test(pathname);
  }

  private isEmpty(value: string) {
    return value.length === 0 || !/[^\s]/.test(value);
  }

  private getActualRoutePath(pathname: `/${string}`) {
    pathname = pathname.replace(/\/$/, '').replace(/[\/][\/]+/g, '/') as any;
    if (this.isEmpty(pathname)) {
      pathname = '/';
    }
    return pathname;
  }

  private getDynamicIdentifiers(route: string) {
    // Split pathname into route segments
    const matches = route.split('/');
    const length = matches.length;

    const data: {
      [k: number]: { static: boolean; name: string };
      length: number;
      firstStatic: string;
      staticCount: number;
      callback?: RegistrationCallback;
    } = {
      length: length,
      firstStatic: '',
      staticCount: 0,
      callback: undefined
    };

    let match = '';
    // let isStatic = false;
    let firstDynamicSegmentFound = false;

    // Find the type (dynamic/static) od each segment in the pathname
    for (let i = 0; i < length; i++) {
      match = matches[i]; // get current segment name

      if (match.startsWith(':')) {
        firstDynamicSegmentFound = true;
        data[i] = {
          static: false,
          name: match.slice(1)
        };
      } else {
        if (!firstDynamicSegmentFound) {
          if (match) {
            data.firstStatic = `${data.firstStatic}/${match}`;
          }
          data.staticCount++;
        }
        data[i] = {
          static: true,
          name: match
        };
      }
    }
    return data;
  }

  registerRoute(pathname: `/${string}`, callback?: RegistrationCallback) {
    pathname = this.getActualRoutePath(pathname);
    if (this.isDynamicRoute(pathname)) {
      const registrationData = this.getDynamicIdentifiers(pathname);
      registrationData.callback = callback;
      const segmentsLength = registrationData.length;
      let routeContainer = this.dynamicRoutes[segmentsLength];
      if (!routeContainer) {
        routeContainer = this.dynamicRoutes[segmentsLength] = [];
      }
      routeContainer.push(registrationData);
      return;
    }
    if (!this.staticRoutes[pathname]) {
      this.staticRoutes[pathname] = { callback };
    }
  }

  activateRoute(pathname: `/${string}`, errorCallback:(err: Error)=>void) {
    pathname = this.getActualRoutePath(pathname);

    // static
    let matched = this.staticRoutes[pathname];
    if (matched) {
      if (matched.callback) {
        try {
            matched.callback({});
        } catch (error) {
            errorCallback(error as Error)
        }
        return;
      }
      // Not found - No handler
      errorCallback(new Error('No endpoint matched route'));

    } else {
      const segments = pathname.split('/');
      const length = segments.length;

      // Get all dynamic registration data in the same length as `segments` length
      const container = this.dynamicRoutes[length];
      if (container) {
        const routeDynamicParams: { [k: string]: string[] | string } = {};
        let matchedData = {
          firstStatic: '',
          staticCount: 0,
          callback: undefined,
          0: { static: true, name: '/' }
        };

        container.forEach((route: typeof matchedData) => {
          if (pathname.startsWith(route.firstStatic)) {
            if (route.staticCount > matchedData.staticCount) {
              matchedData = route;
            }
          }
        });

        if (matchedData.staticCount > 0) {
          for (let i = 0, route, params; i < length; i++) {
            route = (matchedData as any)[i];
            if (!route.static) {
              params = routeDynamicParams[route.name];
              if (!params) {
                params = routeDynamicParams[route.name] = decodeURIComponent(segments[i]);
              } else {
                // Dynamic params with non-unique identifiers are kept as group in an array
                if (Array.isArray(params)) {
                  params.push(decodeURIComponent(segments[i]));
                } else {
                  routeDynamicParams[route.name] = [params, decodeURIComponent(segments[i])];
                }
              }
            }
          }
          if (matchedData.callback) {
            try {
              (matchedData.callback as Function)(routeDynamicParams);
            } catch (error) {
              errorCallback(error as Error);
            }
            return;
          }
          // Not found - No handler
          errorCallback(new Error('No endpoint matched route'));

        } else {
          // Not found - No handler
          errorCallback(new Error('No endpoint matched route'));
        }
      } else {
        // Not found - No handler
        errorCallback(new Error('No endpoint matched route'));
      }
    }
  }

  deactivateRoute(pathname: `/${string}`) {
    pathname = this.getActualRoutePath(pathname);

    // static
    let matched = this.staticRoutes[pathname];
    if (matched) {
        matched.callback = undefined;
        delete this.staticRoutes[pathname];
    } else {
      const segments = pathname.split('/');
      const length = segments.length;

      // Get all dynamic registration data in the same length as `segments` length
      const container = this.dynamicRoutes[length];
      if (container) {
        let matchedData = {
          firstStatic: '',
          staticCount: 0,
          callback: undefined,
          0: { static: true, name: '/' }
        };

        let tracker = -1; // Track the index of the matched route

        container.forEach((route: typeof matchedData, index: number) => {
          if (pathname.startsWith(route.firstStatic)) {
            if (route.staticCount > matchedData.staticCount) {
                matchedData = route;
                tracker = index;
            }
          }
        });

        if (matchedData.staticCount > 0) {
          matchedData.callback = undefined;
          this.dynamicRoutes[length] = [...container.slice(0, tracker), ...container.slice(tracker+1)]
        }
      }
    }
  }
}

type RegistrationCallback = ((params: { [k: string]: string | string[] }) => void)|(() => void)

