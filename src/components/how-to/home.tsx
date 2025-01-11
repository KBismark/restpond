import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ClipboardCopy } from 'lucide-react';

export const ReadmeContent = () => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="prose prose-slate w-full mt-8">
      <h2 className="text-2xl font-bold mb-4">Getting Started with Restpond</h2>
      
      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-3">Creating Endpoints</h3>
        <p className="mb-4">Create static and dynamic endpoints easily:</p>
        
        <div className="relative">
          <button type='button' title='Copy to clipboard'
            onClick={() => copyToClipboard(`POST /api/endpoints
{
  "path": "/users",
  "method": "GET",
  "response": {
    "status": 200,
    "body": { "users": [] }
  }
}`)}
            className="absolute top-2 right-2 p-2 hover:bg-gray-700 rounded"
          >
            <ClipboardCopy size={16} className="text-gray-400" />
          </button>
          <SyntaxHighlighter language="json" style={oneDark}>
{`POST /api/endpoints
{
  "path": "/users",
  "method": "GET",
  "response": {
    "status": 200,
    "body": { "users": [] }
  }
}`}
          </SyntaxHighlighter>
        </div>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-3">Dynamic Routes</h3>
        <p className="mb-4">Create dynamic routes using path parameters:</p>
        
        <div className="relative">
          <SyntaxHighlighter language="json" style={oneDark}>
{`POST /api/endpoints
{
  "path": "/users/:id",
  "method": "GET",
  "response": {
    "status": 200,
    "body": {
      "id": ":id",
      "name": "John Doe"
    }
  }
}`}
          </SyntaxHighlighter>
        </div>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-3">Custom Headers</h3>
        <p className="mb-4">Add custom headers to your endpoints:</p>
        
        <div className="relative">
          <SyntaxHighlighter language="json" style={oneDark}>
{`POST /api/endpoints
{
  "path": "/secure",
  "method": "GET",
  "headers": {
    "Authorization": "Bearer token",
    "Content-Type": "application/json"
  },
  "response": {
    "status": 200,
    "body": { "secure": true }
  }
}`}
          </SyntaxHighlighter>
        </div>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-3">Update Endpoints</h3>
        <p className="mb-4">Modify existing endpoints:</p>
        
        <div className="relative">
          <SyntaxHighlighter language="json" style={oneDark}>
{`PUT /api/endpoints/:id
{
  "response": {
    "status": 201,
    "body": { "updated": true }
  }
}`}
          </SyntaxHighlighter>
        </div>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-3">Delete Endpoints</h3>
        <p className="mb-4">Remove endpoints you no longer need:</p>
        
        <div className="relative">
          <SyntaxHighlighter language="json" style={oneDark}>
{`DELETE /api/endpoints/:id`}
          </SyntaxHighlighter>
        </div>
      </section>
    </div>
  );
};