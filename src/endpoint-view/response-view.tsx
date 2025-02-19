import React from 'react';
import { Button } from '../components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { Clock, MoreHorizontal } from 'lucide-react';
import BluryContainer from '../components/commons/blury-container';

interface TabItemProps {
  label: string;
  count?: number;
}

const TabItem = ({ label, count }: TabItemProps) => (
  <div className='mr-4'>
    <TabsTrigger value={label.toLowerCase()} className="text-sm">
        {label} {count && `(${count})`}
    </TabsTrigger>
  </div>
);

const ResponseView = () => {
  const responseData = ["John", "James", "Emmanuel", "kbis"];

  return (
    <div className="w-full mt-6">
      <Tabs defaultValue="body" className="w-full">
        <div className="border-b border-gray-200 mb-4 mx-2">
          <TabsList className="flex items-center gap-4 px-2">
            <TabItem label="Body" />
            <TabItem label="Cookies" />
            <TabItem label="Headers" count={5} />
            <TabItem label="Test Results" />
          </TabsList>
        </div>

        <TabsContent value="body" className="p-0 bg-white ">
          <div className="flex items-center justify-between px-2 py-1 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded">
                <span className="text-sm">JSON</span>
              </div>
              <Button variant="ghost" size="sm" className="text-sm text-gray-600">
                Preview
              </Button>
              <Button variant="ghost" size="sm" className="text-sm text-gray-600">
                Visualize
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-2 py-1 bg-green-50 text-green-600 rounded">
                <span className="text-sm">200 OK</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Clock size={14} />
                <span>33 ms</span>
              </div>
              <span className="text-sm text-gray-600">189 B</span>
              <Button variant="ghost" size="sm" className="p-1">
                <MoreHorizontal size={16} />
              </Button>
            </div>
          </div>

            <BluryContainer
                outerContainer={{
                    className: ''
                }} 
                innerContainer={{
                    className: 'p-4 font--code text-[12px]'
                }}
            >
                <div className="flex">
              <div className="text-gray-400 select-none pr-4">
                {responseData.map((_, i) => (
                  <div key={i} className="leading-6">{i + 1}</div>
                ))}
              </div>
              <div className="flex-1">
                <div className="leading-6">[</div>
                {responseData.map((item, i) => (
                  <div key={i} className="leading-6 pl-4">
                    "{item}"{i < responseData.length - 1 ? "," : ""}
                  </div>
                ))}
                <div className="leading-6">]</div>
              </div>
            </div>
            </BluryContainer>
          {/* <div className="p-4 font-mono text-sm bg-red-200">
            
          </div> */}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResponseView;