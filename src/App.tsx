import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AppBar from './AppBar';
import SwitchDarkMode from './SwitchDarkMode';
import SelectLanguage from './SelectLanguage';

import MainHeader from './components/commons/header';
import SidePanelNavigation from './components/commons/sidebar';
import { ReactAppRouter } from './components/router';
import { RouterConfig } from './router.config';
import EndpointsDashboard from './components/endpoints';
import Dashboard from './components/dashboard';
import Sidebar from './components/sidebar-routes';
import { useSideBarStore } from './services/sidebar.service';
import LoginForm from './components/forms/test';
import { JsonEditor } from './endpoint-view/json-editor';
import { activateRoute, RequestObject } from './helpers/server-app-bridge';
import { restoreSideBarRouteStore } from './components/sidebar-routes/stores';


function App() {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    if(!ready) {
      // Error is handled in function itself
      restoreSideBarRouteStore().finally(()=>{
        setReady(true);
      })
      return;
    }

    // Remove loading if app ready
    window.Main&&window.Main.removeLoading();

  }, [ready]);

  // useEffect(() => {
  //   if(window.Main){
  //     const onActivate = (data: RequestObject) => {
  //       console.log('Message from main:', data);
  //       const str = JSON.stringify(data)
  //       window.Main.sendMessage(str)
  //       setFromMain(str)
  //     }

  //     window.Main.receive('activate-route', onActivate);
  //     return ()=>window.Main.removeListener('activate-route', onActivate)
  //   }
  // }, []);

  useEffect(() => {
    if (ready&&window.Main){

      const onActivate = (data: RequestObject) => {
        // console.log('Message from main:', data);
        // const str = JSON.stringify(data)
        // window.Main.sendMessage(str)
        // setFromMain(str)
        activateRoute(data)
      }

      window.Main.receive('activate-route', onActivate);
      window.Main.sendMessage('From Browser');
      return ()=>window.Main.removeListener('activate-route', onActivate)
    
      
    }
      
  }, [ready]);
  
  // window.Main&&window.Main.sendMessage('common.helloElectron');

  if(!ready) return null;

  return (
    <main className={`relative font-serif-f text-sm ${window.Main?'select-none': ''}`}>
      <MainHeader />
      {/* <SidePanelNavigation /> */}
      {/* {
        currentTabLowerCase === 'projects' || currentTabLowerCase === 'endpoints' ? <Sidebar moveToTop={false} /> : <SidePanelNavigation />
      } */}
       <Sidebar moveToTop={false} />
      {/* <div className='relative w-full max-w-full flex flex-col items-center justify-center'> */}
        <ReactAppRouter config={RouterConfig} />
      {/* </div> */}
      
      {
        <div className="lgx:w-[400px] lgx:fixed lgx:right-0 lgx:top-0 lgx:bottom-0 overflow-y-auto bg-blue-100/5 px-6 box-border lgx:mt-16 lgx:pt-2 pt-14 pb-24 ">
          
          <div className="mt-6 mb-4">
              <div className="flex items-center justify-between">
                <h2  className="text-lg font-semibold">Most Recent Request</h2>
              </div>
          </div>
        

          <JsonEditor />

          <div className="mt-6 mb-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Most Recent Response</h2>
              </div>
          </div>
        

          <JsonEditor />
      </div>
      }
    </main>
  );
}

export default App;



const APIKey: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">API Key</h2>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex-1 bg-gray-50 p-3 rounded">
          eash365dnj-373m?udt-dfs23cjdu
        </div>
        <button className="bg-orange-100 text-orange-500 px-4 py-2 rounded">
          Regenerate
        </button>
      </div>
    </div>
  );
};

// components/ServerLogs.tsx

type ServerLogEntry = {
  customerName: string;
  company: string;
  phoneNumber: string;
  email: string;
  country: string;
  status: 'Active' | 'Inactive';
};

const ServerLogs: React.FC = () => {
  const logs: ServerLogEntry[] = [
    {
      customerName: 'Jane Cooper',
      company: 'Microsoft',
      phoneNumber: '(225) 555-0118',
      email: 'jane@microsoft.com',
      country: 'United States',
      status: 'Active',
    },
    {
      customerName: 'Floyd Miles',
      company: 'Yahoo',
      phoneNumber: '(205) 555-0100',
      email: 'floyd@yahoo.com',
      country: 'Kiribati',
      status: 'Inactive',
    },
  ];

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Recent server logs</h2>
        {/* <div className="flex items-center gap-4">
          <input
            type="search"
            placeholder="Search"
            className="px-4 py-2 border rounded-lg"
          />
          <select title='Select option' className="px-4 py-2 border rounded-lg">
            <option>Newest</option>
            <option>Oldest</option>
          </select>
        </div> */}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-4 text-left">Ip Address</th>
              <th className="p-4 text-left">Endpoint</th>
              <th className="p-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.email} className="border-b">
                <td className="p-4 text-sm">{log.customerName}</td>
                <td className="p-4 font-mono-f text-sm">{log.email}</td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      log.status === 'Active'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-red-100 text-red-600'
                    }`}
                  >
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};