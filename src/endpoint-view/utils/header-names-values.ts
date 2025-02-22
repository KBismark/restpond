const COMMON_RESPONSE_HEADERS = {
  // Content headers
  'Content-Type': [
    'application/json',
    'application/xml',
    'text/html',
    'text/plain',
    'text/css',
    'text/javascript',
    'application/x-www-form-urlencoded',
    'multipart/form-data',
    'application/octet-stream',
    'image/jpeg',
    'image/png',
    'image/gif'
  ],

  // Cache Control
  'Cache-Control': [
    'no-cache',
    'no-store',
    'public',
    'private',
    'must-revalidate',
    'proxy-revalidate',
    'no-transform'
  ],

  // Security Headers
  'X-Content-Type-Options': ['nosniff'],
  'X-Frame-Options': ['DENY', 'SAMEORIGIN'],
  'X-XSS-Protection': ['0', '1', '1; mode=block'],
  'Content-Security-Policy': ["default-src 'self'", "script-src 'self'", "style-src 'self'"],
  'Strict-Transport-Security': ['includeSubDomains', 'preload'],

  // CORS Headers
  'Access-Control-Allow-Origin': ['*'],
  'Access-Control-Allow-Methods': ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  'Access-Control-Allow-Headers': ['*', 'Content-Type', 'Authorization', 'X-Requested-With'],
  'Access-Control-Max-Age': ['86400'], 
  'Access-Control-Allow-Credentials': ['true', 'false'],
  'Access-Control-Expose-Headers': ['Content-Length', 'X-My-Custom-Header'],

  // Authentication
  'WWW-Authenticate': ['Basic', 'Bearer', 'Digest', 'HOBA', 'Mutual', 'AWS4-HMAC-SHA256'],

  // Content Encoding and Language
  'Content-Encoding': ['gzip', 'compress', 'deflate', 'br'],
  'Content-Language': ['en', 'es', 'fr', 'de', 'it', 'ja', 'zh'],
  'Content-Disposition': ['inline', 'attachment', 'form-data', 'filename="example.json"'],

  // Custom Application Headers
  'X-Requested-With': ['XMLHttpRequest'],
  'X-Do-Not-Track': ['1', '0'],
  'Max-Forwards': ['10', '5'],
  'X-Forwarded-For': ['client1, proxy1, proxy2'],
  'x-api-key': [],

  // Response Information
  Allow: ['GET', 'POST', 'HEAD', 'OPTIONS'],
  Server: ['Apache/2.4.1', 'nginx/1.19.3', 'Microsoft-IIS/10.0'],
  'Accept-Ranges': ['bytes', 'none'],
  Vary: ['Accept', 'Accept-Encoding', 'Accept-Language', 'Origin'],

  // Date and Time
  Date: [],
  'Last-Modified': [],
  Expires: [],
  Age: [],
  'Max-age': [],

  // Location and Redirection
  Location: [],
  'Retry-After': [],

  // Proxy Headers
  Via: ['1.1 vegur', '1.1 varnish', '1.1 squid'],
  Forwarded: ['for=client;by=proxy;host=example.com;proto=https'],

  // Trailer Headers
  Trailer: ['Max-Forwards', 'Content-MD5'],
  'Transfer-Encoding': ['chunked', 'compress', 'deflate', 'gzip'],

  // Custom Application Status
  'X-RateLimit-Limit': [],
  'X-RateLimit-Remaining': [],
  'X-RateLimit-Reset': [],
  'X-Request-ID': [],
  'X-Correlation-ID': []
};


export const getHeaderValues = (headerName: keyof typeof COMMON_RESPONSE_HEADERS | (string&{})) => {
  return COMMON_RESPONSE_HEADERS[headerName as keyof typeof COMMON_RESPONSE_HEADERS] || [];
};

export const getAllHeaderNames = () => {
  return Object.keys(COMMON_RESPONSE_HEADERS);
};
