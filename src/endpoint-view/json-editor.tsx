import { JsonView } from "./json-view";

export const JsonEditor = ({data}: {data: any}) => {

  return (
    <div className="prose prose-slate w-full">
      <pre className="b-[#282c34] font-code whitespace-pre py-4 rounded-lg font-mono text-[12px] max-h-[350px] overflow-x-auto pr-4">
        <JsonView data={data} />
      </pre>
    </div>
  );
};