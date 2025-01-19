import React from 'react';
import { ChevronDown, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './components/ui/dropdown-menu';
import { updateProjectsStore, useCurrentProjectData, useProjectService, useProjectsStore } from './components/projects/projects.service';
import { getStorageProvider} from 'statestorejs';
import BluryContainer from './components/commons/blury-container';
import ActionBar from './components/commons/action-tabs';

interface ProjectSelectorProps {
  currentProjectId: string;
}

const ProjectSelector: React.FC<ProjectSelectorProps> = ({
  currentProjectId,
}) => {
  const {projectIds} = useProjectsStore({watch: ['currentProjectId','projectIds']})!
  const currentProject = useCurrentProjectData({projectId: currentProjectId, watch: []})
  
  
  return (
    <DropdownMenu>

      <DropdownMenuTrigger asChild>
        <button title='Select new project' className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          <span className="font-medium">
            {currentProject?.name || 'Select Project'}
          </span>
          <ChevronDown size={16} />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-72 p-0 border-none overflow-hidden rounded-lg ml-16 shadow-lg max-h-80 overflow-y-auto relative">
        <BluryContainer 
          outerContainer={{
            className: 'w-full'
          }} 
          innerContainer={{
            className: 'w-full'
          }}
        >
          
           {/* <div className='flex justify-end mr-1'>
              <button onClick={undefined} title='Close' className='border-none py-1.5 px-2 hover:bg-white rounded-sm' >
                <X size={13} />
              </button>
            </div> */}
          {projectIds.map((projectId: string) => {
            return <DropdownItem key={projectId} 
              projectId={projectId} 
              currentProjectId={currentProjectId} 
            />
          })}

          {/* <ActionBar onClose={()=>{}}></ActionBar> */}
          {/* <DropdownMenuItem  className='group bg-white hover:bg-red-50 hover:border-t-transparent transition-all duration-600 focus:bg-red-50 flex justify-center border-t mt-4 sticky bottom-0 rounded-none'>
              <button
                className={`flex w-[calc(100%-32px)] items-center px-4 py-2 text-sm group-hover:text-red-600 bg-white rounded-lg group-hover:bg-transparent  group-hover:rounded-none group-hover:w-full transition-all duration-500`}
                onClick={undefined}
              >
                <X size={14} className="mr-2" aria-hidden={'true'} />
                Close
              </button>
          </DropdownMenuItem> */}
        </BluryContainer>
      </DropdownMenuContent>

    </DropdownMenu>
  );
};



const DropdownItem: React.FC<{currentProjectId:string; projectId: string; }> = ({currentProjectId,projectId})=>{
  
  const project = useProjectService({projectId, watch: ['name']})!
  const projectEndpointIds = Object.keys(getStorageProvider(project.id)||{});
  const isSelected = currentProjectId === project.id;

  return (
    <DropdownMenuItem
      
      onClick={() => updateProjectsStore({actors: ['currentProjectId'], store: {currentProjectId: project.id}})}
      className="cursor-pointer py-0 px-0 m-0"
    >
      <div className={
        `flex items-center justify-between ${isSelected&&'bg-blue-gray-50/50'} hover:bg-white w-full px-4 py-2.5 transition-all duration-300`
      }>
        <div>
          <div className="font-medium font-hedvig-f truncate">{project.name}</div>
          <div className="text-xs text-gray-500">
            {projectEndpointIds.length} endpoints
          </div>
        </div>
        {isSelected && (
          <div className="w-2 h-2 bg-pink-500 rounded-full" />
        )}
      </div>
    </DropdownMenuItem>
  )

}



export default ProjectSelector;


