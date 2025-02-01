import { router } from '../components/router';
import { FileView } from './files';

const EndpointView = () => {
    const {file, id, routeName} = router.getParams( ) as {id: string, file?: string, routeName: string};
    
    
  return (
    <div className='2xl:justify-center 2xl:flex-row 2xl:flex'>
      <div className="flex min-h-screen bg-white px-6 pt-3 pb-6 max-w-7xl sm:ml-16 md:ml-52 2xl:w-[1200px]">
        <div className="flex-1 px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Mian content */}
            <div className="lg:col-span-3">
              
            {
              routeName&&file&&<FileView id={id} file={file} routeName={routeName} />
            }

            </div>

          {/* Right Side panel - Rather in App.tsx since it's a fixed element */}
            <div></div>
            
          </div>
        </div>
      </div>
    </div>
  );
};


export default EndpointView;