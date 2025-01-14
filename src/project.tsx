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

      <DropdownMenuContent align="start" className="w-64 p-0 border-none overflow-hidden rounded-lg ml-16">
        <BluryContainer 
          outerContainer={{
            className: 'w-full'
          }} 
          innerContainer={{
            className: 'w-full py-1'
          }}
        >
           <div className='flex justify-end mr-1'>
              <button onClick={undefined} title='Close' className='border-none py-1.5 px-2 hover:bg-white rounded-sm' >
                <X size={13} />
              </button>
            </div>
          {projectIds.map((projectId: string) => {
            return <DropdownItem key={projectId} 
              projectId={projectId} 
              currentProjectId={currentProjectId} 
            />
          })}
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
      className="cursor-pointer py-0 px-1 m-0"
    >
      <div className={
        `flex items-center justify-between ${isSelected&&'bg-white'} hover:bg-white w-full rounded-md px-2 py-2 mt-0.5 transition-all duration-300`
      }>
        <div>
          <div className="font-medium font-hedvig-f">{project.name}</div>
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


