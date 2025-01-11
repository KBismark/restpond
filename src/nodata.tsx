import { motion} from 'framer-motion';
import { Plus } from 'lucide-react';

export const NoDataView = () => {
  return (
    <motion.div 
      className="flex flex-col items-center justify-center h-[70vh] space-y-6"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-64 h-64">
        <img 
          src="/api/placeholder/256/256" 
          alt="No data illustration" 
          className="w-full h-full object-contain opacity-75"
        />
      </div>
      <motion.h3 
        className="text-xl font-medium text-gray-600"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        No Projects Available
      </motion.h3>
      <motion.button 
        className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-all hover:scale-105"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Plus size={20} />
        Create Project
      </motion.button>
    </motion.div>
  );
};