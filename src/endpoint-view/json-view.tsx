import { useEffect, useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';

interface JsonViewProps {
  data: any;
  level?: number;
  isLastProp?:boolean
}

export const JsonView: React.FC<JsonViewProps> = ({ data, level = 0, isLastProp }) => {
  const [isExpanded, setIsExpanded] = useState(level===0);
  const [flash, setFlash] = useState(false);

  useEffect(()=>{
    if(data && typeof data !== 'object'){

      setFlash(true);
      const timeout = setTimeout(()=>{
        setFlash(false);
      }, 800);

      return ()=>clearTimeout(timeout);
    }
  },[data])
  // const isExpanded = true
  const indent = level * 20;

  if (typeof data !== 'object' || data === null) {
    return <span className={`${flash&&'flash-bg'} text-[#512DA8] font--code`}>{JSON.stringify(data)}<span className='text-[#676464]'>{!isLastProp&&','}</span></span>;
  }

  const isArray = Array.isArray(data);
  const dataLength =  Object.keys(data).length;
  const dataLengthLess1 = dataLength-1;
  const isEmpty = dataLength === 0;
  const bracketType = isArray ? ['[', ']'] : ['{', '}'];

  return (
    <div className={`font-mono-f text-[12px] ml-1 font-[600] ${!isExpanded? 'flex items-center':''}`} >
      <span 
        role='button'
        onClick={() => setIsExpanded(!isExpanded)}
        className="cursor-pointer inline-flex items-center text-blue-400 hover:text-blue-600"
      >
        {!isEmpty && (
          <span className="mr-[1px]">
            {isExpanded ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
          </span>
        )}
        <span className="text-[#676464] font-mono-f font-normal">{bracketType[0]}</span>
      </span>

      {isExpanded ? (
        <div className="ml-2">
          {Object.entries(data).map(([key, value], index) => (
            <div key={key} className="flex font-mono-f font-medium">
              <span className="text-[#c2184a] ml-1 font--code">
                {isArray ? '' : `"${key}": `}
              </span>
              <JsonView data={value} level={level + 1} isLastProp={index===dataLengthLess1} />
            </div>
          ))}
        </div>
      ) : (
        <span role='button' onClick={() => setIsExpanded(!isExpanded)} className="text-gray-500 font-mono-f font-normal cursor-pointer ">...</span>
      )}
      <span className={`text-[#676464] font-mono-f font-normal ${isExpanded&&'ml-1'}`}>{bracketType[1]}{level!==0&&!isLastProp&&','} </span>
    </div>
  );
};