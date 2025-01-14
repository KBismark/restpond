import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus,Filter, ArrowUpDown, X, FilterX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TbSortDescending2 } from "react-icons/tb";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '../../components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import ProjectSelector from '../../project';
// import { Endpoint, SortConfig } from '../../types';
import { FilterPanel } from '../../components/endpoints/filter';
import { useFilterStore } from '../../components/endpoints/filter.service';
import { EndpointItem } from '../../components/endpoints/item';
import { useCurrentProjectData, useProjectsLoaderService, useProjectsStore } from '../../components/projects/projects.service';
import { getAllEndpointsData, useCurrentProjectEndpointLoader} from '../../components/endpoints/endpoints.service';
import { NoDataView } from '../../nodata';
import { Endpoint, SortConfig } from './types';
import en from '../../locales/en';



const EndpointsDashboard = () => {
  const {projectIds, currentProjectId} = useProjectsStore({watch: ['currentProjectId','projectIds']})!;
  const currentProject = useCurrentProjectData({projectId: currentProjectId, watch: []})
  const currentProjectEndpoints = getAllEndpointsData({projectId: currentProjectId})
  const filters = useFilterStore({watch: ['method','status']})!
  
  // Fetch projects from database
  useProjectsLoaderService()
  useCurrentProjectEndpointLoader()


  const [searchQuery, setSearchQuery] = useState('');

  

  const [sortConfig, setSortConfig] = useState({
    key: 'createdAt',
    direction: 'desc'
  } as SortConfig);

  // Filtered and sorted endpoints
  const filteredEndpoints = useMemo(() => {
    if (!currentProjectEndpoints.length) return [];
    
    return currentProjectEndpoints
      .filter(endpoint => {
        const matchesSearch = 
          endpoint.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
          endpoint.description.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesMethod = 
          !filters.method?.length || 
          filters.method.includes(endpoint.method);
        
        const matchesStatus = 
          !filters.status?.length || 
          filters.status.includes(endpoint.status);

        return matchesSearch && matchesMethod && matchesStatus;
      })
      .sort((a: any, b: any) => {
        const multiplier = sortConfig.direction === 'asc' ? 1 : -1;
        return multiplier * String(a[sortConfig.key]).localeCompare(String(b[sortConfig.key]));
      });
  }, [currentProject, currentProjectEndpoints, searchQuery, filters, sortConfig]);

  console.log('Filtered endpoints:', filteredEndpoints);
  

  const handleSort = (key: keyof Endpoint) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleEndpointAction = (action: 'view' | 'edit' | 'delete', endpoint: Endpoint, projectId: string) => {
    switch (action) {
      case 'view':
        // Implement view logic
        console.log('Viewing endpoint:', endpoint);
        break;
      case 'edit':
        // Implement edit logic
        console.log('Editing endpoint:', endpoint);
        break;
      case 'delete':
        // Implement delete logic
        console.log('Deleting endpoint:', endpoint);
        break;
    }
  };

  if (!projectIds.length) {
    return <NoDataView />;
  }

  return (
    <div className="px-6 pt-3 pb-6 max-w-7xl mx-auto sm:ml-16 lg:ml-52">
        <motion.div 
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-4">
            {/* <h1 className="text-xl font-semibold font-hedvig-f">My E-commerce app</h1> */}
            <ProjectSelector
              currentProjectId={currentProjectId}
            />
          </div>

          <div className="hidden md:flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
              <input
                type="text"
                placeholder="Search endpoints..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-1 border rounded-lg w-10 focus:w-64 transition-all outline-none focus:ring-2 focus:ring-neutral-100 focus:border-transparent"
              />
              {searchQuery && (
                <button 
                  title='Clear'
                  aria-label='Clear text'
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <button title='Filter' aria-label='Filter endpoints' className="py-2 px-3 bg-primary/5 hover:bg-gray-100 rounded-md flex flex-row items-center justify-center ">
                  <Filter size={15} className='text-primary' />
                  <span className='text-primary text-sm font-medium ml-2'>Filter</span>
                </button>
              </DialogTrigger>
              <DialogContent>
                <FilterPanel />
              </DialogContent>
            </Dialog>

            {/* <button className="hidden px-6 py-2 bg-primary font-serif-f text-white rounded-sm hover:bg-primary/90 transition-all active:scale-[.98] flex items-center gap-2">
              <Plus size={17} className='hidden' />
              <span className='text-sm font-semibold'>New endpoint</span>
            </button> */}
          </div>
        </motion.div>

        <motion.div 
          className="bg-white rounded-lg shadow font-hedvig-f"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 p-4 border-b bg-gray-50 font-medium text-sm text-gray-600">
            <div className="flex items-center justify-start">
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleSort('path')}>
                API endpoint
                <ArrowUpDown size={16} />
              </div>
            </div>
            
            <div className="hidden lg:flex items-center gap-2 cursor-pointer" onClick={() => handleSort('description')}>
              Description
              <ArrowUpDown size={16} />
            </div>

            <div className='flex justify-end pr-3 items-center'>
              <div className="hidden md:flex items-center gap-2 cursor-pointer ml-7 mr-7" onClick={() => handleSort('createdAt')}>
                
                <TbSortDescending2 size={20} />
              </div>
              <div className="flex items-center gap-2 cursor-pointer ml-7 -mr-3 sm:mr-[6rem]" onClick={() => handleSort('status')}>
                
                <TbSortDescending2 size={20} />
              </div>
              {/* <div className="text-right ml-7">Actions</div> */}
            </div>
            
          </div>
          
          <AnimatePresence>
            <div className="divide-y" role="list">
              {filteredEndpoints.map((endpoint) => {
                if(!endpoint){
                  console.log('No Endpoint found - Caused by a bug in the code'); 
                   return null;
                }
                return (
                  <EndpointItem
                    key={endpoint.id}
                    endpointId={endpoint.id}
                    projectId={currentProjectId}
                    onAction={handleEndpointAction}
                  />
                )
              })}
              <li style={{display:'none'}} className='hidden'></li>
            </div>
          </AnimatePresence>

          {filteredEndpoints.length === 0 && (
            <motion.div 
              className="p-8 text-center text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
            No endpoints found matching your criteria
          </motion.div>
        )}

        <motion.div 
          className="p-4 border-t bg-gray-50 flex items-center justify-between"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-sm text-gray-600">
            Showing {filteredEndpoints.length} of {currentProject?.endpoints.length} endpoints
          </div>
          
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-200 rounded-md transition-colors"
              onClick={() => {/* Handle previous page */}}
            >
              Previous
            </button>
            <div className="flex items-center gap-1">
              {[1, 2, 3].map((page) => (
                <button
                  key={page}
                  aria-description={`Go to page ${page}`}
                  className="px-3 py-1.5 text-sm hover:bg-gray-200 rounded-md transition-colors"
                  style={{
                    backgroundColor: page === 1 ? 'rgb(219 39 119)' : undefined,
                    color: page === 1 ? 'white' : undefined
                  }}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-200 rounded-md transition-colors"
              onClick={() => {/* Handle next page */}}
            >
              Next
            </button>
          </div>
        </motion.div>
      </motion.div>

      {/* Quick Actions Menu */}
      <motion.div
        className="fixed bottom-8 right-8"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button aria-label='View quick actions' className="w-12 h-12 bg-pink-500 text-white rounded-full shadow-lg hover:bg-pink-600 transition-colors flex items-center justify-center">
              <Plus size={24} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="mb-2">
            <DropdownMenuItem className="cursor-pointer">
              New Endpoint
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              Import Endpoints
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              Export Endpoints
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-red-500">
              Delete All Inactive
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </motion.div>

      {/* Endpoint Details Dialog */}
      <Dialog>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Endpoint Details</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <label className="text-sm font-medium">Path</label>
              <input
                className="w-full px-3 py-2 border rounded-md mt-1"
                placeholder="/api/v1/user/{userId}"
              />
            </div>
            <div>
              <div className="text-sm font-medium">Description</div>
              <textarea
                aria-label='Description'
                className="w-full px-3 py-2 border rounded-md mt-1"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium">Method</div>
                <select title='Select HTTP method' name='method' className="w-full px-3 py-2 border rounded-md mt-1">
                  <option>GET</option>
                  <option>POST</option>
                  <option>PUT</option>
                  <option>DELETE</option>
                </select>
              </div>
              <div>
                <div className="text-sm font-medium">Status</div>
                <select title='Select status' name='status' className="w-full px-3 py-2 border rounded-md mt-1">
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Toast Notifications Container */}
      {/* <div className="fixed bottom-4 right-4 space-y-2">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2"
          >
            <div className="flex-1">Endpoint updated successfully</div>
            <button className="p-1 hover:bg-green-600 rounded">
              <X size={16} />
            </button>
          </motion.div>
        </AnimatePresence>
      </div> */}
    </div>
);
};

// Custom Hooks
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default EndpointsDashboard;