import React, { useState } from 'react';
import { Checkbox } from '../components/ui/checkbox';
import { Button } from '../components/ui/button';
import { Plus } from 'lucide-react';

interface Header {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

const COMMON_HEADERS = [
  'Content-Type',
  'X-Requested-With',
  'X-Do-Not-Track',
  'Max-Forwards',
  'x-api-key'
];

const ResponseHeaderSetting = () => {
  const [headers, setHeaders] = useState<Header[]>([
    {
      id: '1',
      key: 'Content-Type',
      value: 'application/json',
      enabled: true
    },
    {
      id: '2',
      key: 'X-|',
      value: '',
      enabled: true
    }
  ]);

  const [showHeaderSuggestions, setShowHeaderSuggestions] = useState(false);
  const [currentFocus, setCurrentFocus] = useState<string | null>(null);

  const handleHeaderChange = (id: string, field: 'key' | 'value', value: string) => {
    setHeaders(headers.map(header => 
      header.id === id ? { ...header, [field]: value } : header
    ));
  };

  const handleCheckboxChange = (id: string) => {
    setHeaders(headers.map(header =>
      header.id === id ? { ...header, enabled: !header.enabled } : header
    ));
  };

  const addNewHeader = () => {
    const newHeader: Header = {
      id: Date.now().toString(),
      key: '',
      value: '',
      enabled: true
    };
    setHeaders([...headers, newHeader]);
  };

  const handleFocus = (id: string) => {
    setCurrentFocus(id);
    setShowHeaderSuggestions(true);
  };

  const handleBlur = () => {
    // Small delay to allow clicking on suggestions
    setTimeout(() => {
      setShowHeaderSuggestions(false);
      setCurrentFocus(null);
    }, 200);
  };

  const selectSuggestion = (suggestion: string) => {
    if (currentFocus) {
      handleHeaderChange(currentFocus, 'key', suggestion);
      setShowHeaderSuggestions(false);
    }
  };

  return (
    <div className="w-full p-4">
      <div className="space-y-2">
        {headers.map((header) => (
          <div key={header.id} className="flex items-center gap-3">
            <Checkbox 
              checked={header.enabled}
              onCheckedChange={() => handleCheckboxChange(header.id)}
              className="w-4 h-4"
            />
            <div className="flex-1 grid grid-cols-2 gap-4">
              <div className="relative">
                <input
                  type="text"
                  value={header.key}
                  onChange={(e) => handleHeaderChange(header.id, 'key', e.target.value)}
                  onFocus={() => handleFocus(header.id)}
                  onBlur={handleBlur}
                  className="w-full px-3 py-[3px] text-sm border rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Key"
                />
                {showHeaderSuggestions && currentFocus === header.id && (
                  <div className="absolute z-10 w-full mt-1 bg-white border rounded-sm shadow-lg">
                    {COMMON_HEADERS.filter(h => 
                      h.toLowerCase().includes(header.key.toLowerCase())
                    ).map((suggestion) => (
                      <button
                        key={suggestion}
                        className="px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer block w-full text-left "
                        onClick={() => selectSuggestion(suggestion)}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <input
                type="text"
                value={header.value}
                onChange={(e) => handleHeaderChange(header.id, 'value', e.target.value)}
                className="w-full px-3 py-[3px] text-sm border rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Value"
              />
            </div>
          </div>
        ))}
      </div>
      
      <Button
        onClick={addNewHeader}
        variant="ghost"
        size="sm"
        className="mt-4 text-blue-500 hover:text-blue-600 hover:bg-blue-50"
      >
        <Plus className="w-4 h-4 mr-1" />
        Add header
      </Button>
    </div>
  );
};

export default ResponseHeaderSetting;