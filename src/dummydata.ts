
  // dummyData.ts
  import { Project, Endpoint } from './types';
  
  export const HTTP_METHODS = ['GET', 'POST', 'PUT', 'DELETE'];
  export const PATHS = [
    '/api/v1/users',
    '/api/v1/users/{userId}',
    '/api/v1/products',
    '/api/v1/products/{productId}',
    '/api/v1/orders',
    '/api/v1/orders/{orderId}',
    '/api/v1/categories',
    '/api/v1/auth/login',
    '/api/v1/auth/register',
    '/api/v1/cart',
    '/api/v1/checkout',
    '/api/v1/reviews',
    '/api/v1/wishlist',
    '/api/v1/settings',
  ];
  
  export const DESCRIPTIONS = [
    'Retrieve user information',
    'Update user profile',
    'Get list of products',
    'Create new order',
    'Process payment',
    'Manage cart items',
    'User authentication',
    'Get order history',
    'Update product inventory',
    'Manage user preferences',
  ];
  
  export const CREATORS = [
    'John Doe',
    'Jane Smith',
    'Alex Johnson',
    'Sarah Williams',
    'Mike Brown',
  ];
  
  export const TAGS = [
    'users',
    'products',
    'orders',
    'auth',
    'payments',
    'inventory',
    'analytics',
  ];
  
  export const generateRandomDate = (start: Date, end: Date): string => {
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return date.toISOString().split('T')[0];
  };
  
  export const generateRandomId = ({type, name}:{type:string, name: string}): string => {
    return `${type}__${name.split(/\s/).join('-')}`
    // Math.random().toString(36).substring(2, 15);
  };
  
  export const getRandomElement = <T>(array: T[]): T => {
    return array[Math.floor(Math.random() * array.length)];
  };
  
 export  const getRandomElements = <T>(array: T[], count: number): T[] => {
    return array
      .sort(() => Math.random() - 0.5)
      .slice(0, count);
  };
  
 export  const generateEndpoint = (): Endpoint => {
    const method = getRandomElement(HTTP_METHODS);
    const path = getRandomElement(PATHS);
    const createdAt = generateRandomDate(new Date(2023, 0, 1), new Date());
  
    return {
      id: generateRandomId({type: 'endpoint', name: path}),
      path,
      method,
      description: getRandomElement(DESCRIPTIONS),
      createdAt,
      lastUpdated: generateRandomDate(new Date(createdAt), new Date()),
      status: Math.random() > 0.2 ? 'Active' : 'Inactive',
      createdBy: getRandomElement(CREATORS),
      tags: getRandomElements(TAGS, Math.floor(Math.random() * 3) + 1),
      version: `v${Math.floor(Math.random() * 2) + 1}`,
      deprecated: Math.random() > 0.9,
      authentication: Math.random() > 0.3,
      rateLimit: Math.floor(Math.random() * 900) + 100,
    } as any;
  };
  
 export  const generateProject = (name: string): Project => {
    const createdAt = generateRandomDate(new Date(2023, 0, 1), new Date());
    // const endpointsCount = Math.floor(Math.random() * 20) + 5; // 5-25 endpoints
    
    return {
      id: generateRandomId({type: 'project', name}),
      name,
      description: `${name} API endpoints and documentation`,
      endpoints: [],
      createdAt,
      updatedAt: generateRandomDate(new Date(createdAt), new Date()),
      owner: getRandomElement(CREATORS),
      team: getRandomElements(CREATORS, Math.floor(Math.random() * 3) + 1),
      status: Math.random() > 0.1 ? 'Active' : 'Archived',
      environment: getRandomElement(['Development', 'Staging', 'Production']),
    } as any;
  };
  
  export const generateDummyProjects = (): Project[] => {
    return [
      generateProject('E-commerce Platform'),
      generateProject('Customer Portal'),
      generateProject('Admin Dashboard'),
      generateProject('Mobile App Backend'),
      generateProject('Analytics Service'),
    ];
  };
  
