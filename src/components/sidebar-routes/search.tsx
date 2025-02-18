import { Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '../ui/button';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  return (
    <div className="px-3 py-2 border-b flex items-center justify-between">
      <div className="flex flex-row items-center gap-2">
          <Button onClick={undefined} size={'sm'} variant={'outline'} className="transition-all duration-500 w-full h-7" >
            Import
          </Button>

          <Button onClick={undefined} size={'sm'} variant={'default'} className="transition-all duration-500 w-full h-7 bg-blue-500" >
            Export
          </Button>

          
        </div>
      <div className="relative hidden">
        <Search size={16} className="absolute left-2 top-2.5 text-gray-400" />
        <input
          type="text"
          placeholder="Search files..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            onSearch(e.target.value);
          }}
          className="w-full pl-8 pr-3 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
};