import { FolderPlus, FilePlus } from 'lucide-react';

interface TreeActionsProps {
  onCreateFile: () => void;
  onCreateFolder: () => void;
}

export const TreeActions: React.FC<TreeActionsProps> = ({
  onCreateFile,
  onCreateFolder,
}) => {
  return (
    <div className="flex items-center justify-end space-x-2 p-2 border-b">
      <button
        onClick={onCreateFile}
        className="p-1 hover:bg-gray-100 rounded"
        title="New File"
      >
        <FilePlus size={16} />
      </button>
      <button
        onClick={onCreateFolder}
        className="p-1 hover:bg-gray-100 rounded"
        title="New Folder"
      >
        <FolderPlus size={16} />
      </button>
    </div>
  );
};