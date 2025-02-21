export interface RequestMethodColor {
  GET: '#2e90fa';
  POST: '#ef6820';
  PUT: '#2fbe76';
  DELETE: '#f55252';
  PATCH: '#e87e1a';
  OPTIONS: '#9373ee';
  HEAD: '#0ea4b7';
}

export type RequestMethod = keyof RequestMethodColor;

export type ResponseStatus = 200 | 201 | 203 | 301 | 302 | 401 | 403 | 404 | 500 |  ({} & number);

export interface APIModel {
    settings: {
        activeMethod: RequestMethod;
        activeStatus: ResponseStatus;
    };
    apis: {
        [key: string]: {
            [key in RequestMethod]: {
                [key in ResponseStatus]: {
                    connected: boolean;
                    body: string;
                    responseType: 'json' | 'text';
                    headers: {
                        [key: string]: string;
                    };
                };
            };
        };
    }
}



export type EndpointViewSettings = { status: ResponseStatus; method: RequestMethod };

// const model: APIModel = {
//     settings: {
//         activeMethod: 'GET',
//         activeStatus: 200
//     },
//   apis: {
//     '/users': {
//       GET: {
//         '200': {
//           connected: true,
//           body: '[]',
//           responseType: 'json',
//           headers: {
//             'Content-Type': 'application/json'
//           }
//         },
//         '404': {
//           connected: true,
//           body: 'Not Found',
//           responseType: 'text',
//           headers: {
//             'Content-Type': 'text/plain'
//           }
//         },
//         201: {
//           connected: false,
//           body: '',
//           responseType: 'json',
//           headers: {}
//         },
//         203: {
//           connected: false,
//           body: '',
//           responseType: 'json',
//           headers: {}
//         },
//         301: {
//           connected: false,
//           body: '',
//           responseType: 'json',
//           headers: {}
//         },
//         302: {
//           connected: false,
//           body: '',
//           responseType: 'json',
//           headers: {}
//         },
//         401: {
//           connected: false,
//           body: '',
//           responseType: 'json',
//           headers: {}
//         },
//         403: {
//           connected: false,
//           body: '',
//           responseType: 'json',
//           headers: {}
//         },
//         500: {
//           connected: false,
//           body: '',
//           responseType: 'json',
//           headers: {}
//         }
//       }
//     }
//   }
// };

// model.apis['/users']?.[model.settings.activeMethod]?.[model.settings.activeStatus]?.connected
