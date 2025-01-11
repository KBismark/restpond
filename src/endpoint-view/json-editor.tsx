import { JsonView } from "./json-view";

export const JsonEditor = () => {
  const exampleData = {
    path: "/users/:id",
    method: "GET",
    headers: {
      "Authorization": "Bearer token",
      "Content-Type": "application/json"
    },
    response: {
      status: 200,
      body: {
        id: ":id",
        name: "John Doe",
        details: ["age", "email", "phone"],
        nested: {
            path: "/users/:id",
            method: "GET",
            headers: {
            "Authorization": "Bearer token",
            "Content-Type": "application/json"
            },
            response: {
            status: 200,
            body: {
                id: ":id",
                name: "John Doe",
                details: ["age", "email", "phone"]
            }
            }
        }
      }
    }
  };

  return (
    <div className="prose prose-slate w-full mt-8">
      <div className="bg-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto pr-4">
        <JsonView data={exampleData} />
      </div>
    </div>
  );
};