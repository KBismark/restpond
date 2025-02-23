import React, { useState } from 'react';

import Icon from './assets/icons/Icon-Electron.png';
import { Box, Maximize, Maximize2, Minimize } from 'lucide-react';

function AppBar() {
  const [isMaximize, setMaximize] = useState(false);

  const handleToggle = () => {
    if (isMaximize) {
      setMaximize(false);
    } else {
      setMaximize(true);
    }
    window.Main.Maximize();
  };

  return (
    <>
      <div className="py-0 flex justify-between text-gray-600">
        <div className="inline-flex -mt-1">
          <button title='Minimize' onClick={window.Main.Minimize} className="undraggable rounded-md text-gray-400 px-[18px] py-2 hover:bg-gray-300 hover:text-gray-900">
            &#8211;
          </button>
          <button title='Maximize' onClick={handleToggle} className="undraggable rounded-md text-gray-400 px-4 lgx:px-4 py-2 hover:bg-gray-300 hover:text-gray-900">
            {/* {isMaximize ? '\u2752' : '⃞'} */}
            {!isMaximize ? <Maximize size={15}/>: <Minimize size={15} />}
          </button>
          <button title='Close' onClick={window.Main.Close} className="undraggable rounded-md text-gray-400 px-4 py-2 hover:bg-red-500 hover:text-white">
            &#10005;
          </button>
        </div>
      </div>
      <div className="text-gray-900 undraggable hidden">
        <div className="flex text-center">
          <div className="text-sm w-8  hover:bg-gray-700">File</div>
          <div className="text-sm w-8   hover:bg-gray-700">Edit</div>
          <div className="text-sm w-10  hover:bg-gray-700">View</div>
          <div className="text-sm w-14  hover:bg-gray-700 ">Window</div>
          <div className="text-sm w-9  hover:bg-gray-700 ">Help</div>
        </div>
      </div>
    </>
  );
}

export default AppBar;
