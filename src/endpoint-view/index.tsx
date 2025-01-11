import { router } from '../components/router';
import { FileView } from './files';

const EndpointView = () => {
    const {file, id} = router.getParams( ) as {id: string, file?: string};
    
    
  return (
    <div className="flex min-h-screen bg-white px-6 pt-3 pb-6 max-w-7xl mx-auto sm:ml-16 md:ml-52">
      <div className="flex-1 px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Mian content */}
          <div className="lg:col-span-3">
            
           {
            file&&<FileView id={id} file={file} />
           }

          </div>

        {/* Right Side panel - Rather in App.tsx since it's a fixed element */}
          <div></div>
          
        </div>
      </div>
    </div>
  );
};


export default EndpointView;