import { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';

interface JsonViewProps {
  data: any;
  level?: number;
  isLastProp?:boolean
}

export const JsonView: React.FC<JsonViewProps> = ({ data, level = 0, isLastProp }) => {
  const [isExpanded, setIsExpanded] = useState(level===0);
  const indent = level * 20;

  if (typeof data !== 'object' || data === null) {
    return <span className="text-green-400 font-mono-f font-normal">{JSON.stringify(data)}<span className='text-[#676464]'>{!isLastProp&&','}</span></span>;
  }

  const isArray = Array.isArray(data);
  const dataLength =  Object.keys(data).length;
  const dataLengthLess1 = dataLength-1;
  const isEmpty = dataLength === 0;
  const bracketType = isArray ? ['[', ']'] : ['{', '}'];

  return (
    <div className={`font-mono-f font-normal ${!isExpanded? 'flex items-center':''}`} style={{ marginLeft: 10}}>
      <span 
        onClick={() => setIsExpanded(!isExpanded)}
        className="cursor-pointer inline-flex items-center hover:text-blue-400"
      >
        {!isEmpty && (
          <span className="mr-1">
            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </span>
        )}
        <span className="text-[#676464] font-mono-f font-normal">{bracketType[0]}</span>
      </span>

      {isExpanded ? (
        <div className="ml-2">
          {Object.entries(data).map(([key, value], index) => (
            <div key={key} className="flex font-mono-f font-normal">
              <span className="text-blue-300 ml-6">
                {isArray ? '' : `"${key}": `}
              </span>
              <JsonView data={value} level={level + 1} isLastProp={index===dataLengthLess1} />
            </div>
          ))}
        </div>
      ) : (
        <span className="text-gray-500 font-mono-f font-normal">...</span>
      )}
      <span className={`text-[#676464] font-mono-f font-normal ${isExpanded&&'ml-4'}`}>{bracketType[1]}{level!==0&&!isLastProp&&','} </span>
    </div>
  );
};