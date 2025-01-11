import React from 'react';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './components/ui/dropdown-menu';
import { updateProjectsStore, useCurrentProjectData, useProjectService, useProjectsStore } from './components/projects/projects.service';
import { getStorageProvider} from 'statestorejs';

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
        <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          <span className="font-medium">
            {currentProject?.name || 'Select Project'}
          </span>
          <ChevronDown size={16} />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-56">
        {projectIds.map((projectId: string) => {
          return <DropdownItem key={projectId} 
            projectId={projectId} 
            currentProjectId={currentProjectId} 
          />
        })}
      </DropdownMenuContent>

    </DropdownMenu>
  );
};



const DropdownItem: React.FC<{currentProjectId:string; projectId: string; }> = ({currentProjectId,projectId})=>{
  
  const project = useProjectService({projectId, watch: ['name']})
  const projectEndpointIds = Object.keys(getStorageProvider(project.id)||{})

  return (
    <DropdownMenuItem
      
      onClick={() => updateProjectsStore({actors: ['currentProjectId'], store: {currentProjectId: project.id}})}
      className="cursor-pointer flex items-center justify-between"
    >
      <div>
        <div className="font-medium font-hedvig-f">{project.name}</div>
        <div className="text-xs text-gray-500">
          {projectEndpointIds.length} endpoints
        </div>
      </div>
      {currentProjectId === project.id && (
        <div className="w-2 h-2 bg-pink-500 rounded-full" />
      )}
    </DropdownMenuItem>
  )

}



export default ProjectSelector;


