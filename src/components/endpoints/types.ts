export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' 
// | 'PATCH' | 'HEAD' | 'OPTIONS';

export interface QueryParam {
  name: string;
  type: 'string' | 'number' | 'boolean';
  required: boolean;
  description?: string;
}

export interface RequestBody {
  type: 'json' | 'form-data' | 'x-www-form-urlencoded';
  schema: Record<string, unknown>;
  required: boolean;
}

export interface Response {
  status: number;
  description: string;
  body?: Record<string, unknown>;
}

export interface Endpoint {
  id: string;
  projectId: string;
  method: HTTPMethod;
  path: string;
  description: string;
  queryParams?: QueryParam[];
  requestBody?: RequestBody;
  responses: Response[];
  headers?: Record<string, string>;
  tags?: string[];
  deprecated?: boolean;

  createdAt: string;
  lastUpdated?: string;
  status: 'Active' | 'Inactive';
  createdBy: string;
  version: string;
  authentication: boolean;
  rateLimit: number;
}

  
  export interface Project {
    id: string;
    name: string;
    description: string;
    endpoints: string[];
    createdAt: string;
    updatedAt: string;
    owner: string;
    team: string[];
    status: 'Active' | 'Archived';
    environment: 'Development' | 'Staging' | 'Production';
  }
   
  export interface SortConfig {
    key: keyof Endpoint;
    direction: 'asc' | 'desc';
  }