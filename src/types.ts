// Enhanced Types
  export interface Endpoint {
    id: string;
    path: string;
    description: string;
    createdAt: string;
    lastUpdated: string;
    status: 'Active' | 'Inactive';
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    createdBy: string;
    tags: string[];
    version: string;
    deprecated: boolean;
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