// types.ts


type SidebarItem = {
  icon: React.ReactNode;
  label: string;
  path: string;
};

// components/Sidebar.tsx
import React from 'react';
import { router } from '../router';
import polygonBg from '../../assets/polygon.svg';
import { IconWebhook } from '../commons/icons';
import { ReadmeContent } from '../how-to/home';
import { JsonContent } from '../how-to/json';


// components/WelcomeCard.tsx
const WelcomeCard: React.FC<{username?: string}> = ({username}) => {
  return (
    <div className="relative bg-black p-6 rounded-lg mb-8 overflow-hidden">
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${polygonBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      <div className="relative z-10 flex flex-row justify-start items-center">
        <div className='flex items-center flex-col justify-center mr-5'>
            <IconWebhook width={45} height={45} />
        </div>

        <div>
            <h1 className="text-2xl font-bold mb-0 capitalize text-primary">
            Welcome {username || 'user'}!
          </h1>
          <p className="text-gray-200 mb-8">
            You have 2 new projects to manage. Let's get started!
          </p>
          <button className="bg-white text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors">
            Manage your projects
          </button>
        </div>

        
      </div>
    </div>
  );
};

// pages/Dashboard.tsx
const Dashboard = (props: {tab: string}) => {
    const {tab} = router.getParams( ) as any;
  
    
  return (
    <div className="flex min-h-screen bg-white px-6 pt-3 pb-6 max-w-7xl mx-auto sm:ml-16 lg:ml-52">
      <div className="flex-1 p-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <WelcomeCard username={tab} />
            
            <div className='hidden'>
              <h2 className="text-xl font-semibold mb-4">Recent Projects</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold mb-4">Project 1</h3>
                  <p className="text-gray-500 mb-4">Description of project 1</p>
                  <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors">
                    View Project
                  </button>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold mb-4">Project 2</h3>
                  <p className="text-gray-500 mb-4">Description of project 2</p>
                  <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors">
                    View Project
                  </button>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold mb-4">Project 3</h3>
                  <p className="text-gray-500 mb-4">Description of project 3</p>
                  <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors">
                    View Project
                  </button>
                </div>
              </div>
            </div>

            <div>
              <ReadmeContent />
            </div>

            <div>
              <JsonContent />
            </div>

          </div>

          <div></div>
          
        </div>
      </div>
    </div>
  );
};

export default Dashboard;