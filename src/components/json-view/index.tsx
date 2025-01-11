import { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';

interface JsonViewProps {
  data: any;
  level?: number;
}

export const JsonView: React.FC<JsonViewProps> = ({ data, level = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const indent = level * 20;

  if (typeof data !== 'object' || data === null) {
    return <span className="text-green-400 font-mono-f">{JSON.stringify(data)}</span>;
  }

  const isArray = Array.isArray(data);
  const dataLength =  Object.keys(data).length;
  const isEmpty = dataLength === 0;
  const bracketType = isArray ? ['[', ']'] : ['{', '}'];

  return (
    <div className={`font-mono-f ${!isExpanded? 'flex items-center':''}`} style={{ marginLeft: 10}}>
      <span 
        onClick={() => setIsExpanded(!isExpanded)}
        className="cursor-pointer inline-flex items-center hover:text-blue-400"
      >
        {!isEmpty && (
          <span className="mr-1">
            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </span>
        )}
        <span className="text-black font-mono-f">{bracketType[0]}</span>
      </span>

      {isExpanded ? (
        <div className="ml-2">
          {Object.entries(data).map(([key, value], index) => (
            <div key={key} className="flex font-mono-f">
              <span className="text-blue-300 ml-6">
                {isArray ? '' : `"${key}": `}
              </span>
              <JsonView data={value} level={level + 1} />
              {index < dataLength - 1 && <span>,</span>}
            </div>
          ))}
        </div>
      ) : (
        <span className="text-gray-500 font-mono-f">...</span>
      )}
      <span className={`text-black font-mono-f ${isExpanded&&'ml-4'}`}>{bracketType[1]} </span>
    </div>
  );
};