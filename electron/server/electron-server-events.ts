
import { IncomingMessage, ServerResponse } from 'http';

const HTTP_REQUESTS: { [k: string]: ServerResponseObjects[] } = {};

export const electronEventsAPI = {
  sendToApp(data: any) {},
  windowDestroyed() {
    return false;
  },
  activateRoute: (data: RequestObject, responseObject: ServerResponseObjects) => {
    if (electronEventsAPI.windowDestroyed()) {
      responseObject.statusCode = 500;
      responseObject.end('Internal Server Error');
      return;
    }

    const id = JSON.stringify(data);
    // getUniqueID();

    if (!HTTP_REQUESTS[id]) {
      HTTP_REQUESTS[id] = [responseObject];

      // make only one request server all same requests hitting the server time
      electronEventsAPI.sendToApp(data);
      return;
    }
    HTTP_REQUESTS[id].push(responseObject);
  }
};

// export const responseHandler = (data: ResponseObject) => {
//   // Search for the route in the router registry for the given pathname
//   // If found, call the handler function with the request and response objects
//   // If not found, return a 404 response
//   // If an error occurs, return a 500 response
//   const id = JSON.stringify(data.request);
//   const responses = HTTP_REQUESTS[id];
//   if (!responses) {
//     return;
//   }

//   // cleanup the request object from the registry
//   cleanup(id);

//   let key = '';
//   const splitter = getUniqueID();
//   const headerKeys = Object.keys(data.response.headers || {}).filter((key) => key.length > 0);
//   const contentTypeSet = headerKeys.join(splitter).toLowerCase().split(splitter).includes('content-type');

//   for (const res of responses) {
//     res.statusCode = data.response.status;
//     // set header from response object
//     for (let i = 0; i < headerKeys.length; i++) {
//       key = headerKeys[i];
//       res.setHeader(key, data.response.headers[key]);
//     }

//     if (data.response.responseType === 'text') {
//       // Set content type to text if not set
//       !contentTypeSet && res.setHeader('Content-Type', 'text/plain');

//       // send response as text
//       res.end(data.response.body as string);
//       return;
//     }
//     // Set content type to json if not set
//     !contentTypeSet && res.setHeader('Content-Type', 'application/json');

//     // send response as json
//     console.log('Sending response', data.response.body);
//     console.log(typeof data.response.body, typeof JSON.stringify(data.response.body));

    
    
//     res.write(JSON.stringify(data.response.body), (err)=>{
//       if(err){
//         console.error(err);
//       }
//     });
//     res.end();
//   }
// };


const cleanup = (id: string) => {
  HTTP_REQUESTS[id] = undefined as any
  delete HTTP_REQUESTS[id];
}

const getUniqueID = () => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export type ServerResponseObjects = ServerResponse<IncomingMessage> & {
      req: IncomingMessage;
  }

export interface RequestObject {
  headers: Record<string, string>;
  method: string;
  pathname: string;
  body: string | Record<string, any>;
  query: Record<string, string>;
}

export interface ResponseObject {
  request: RequestObject;
  response: {
    status: number;
    body: string | Record<string, any>;
    responseType: 'json' | 'text';
    headers: Record<string, string>;
  };
}