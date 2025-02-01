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
    <div className="prose prose-slate w-full">
      <div className="bg-transparent p-0 rounded-lg font-mono text-[12px] overflow-x-auto pr-4">
        <JsonView data={exampleData} />
      </div>
    </div>
  );
};