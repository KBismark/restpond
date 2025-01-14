import { updateSideBarStore, useSideBarStore } from "../../services/sidebar.service";
import { LucideHandHelping } from "lucide-react";
import { FaChartColumn } from "react-icons/fa6";
import { IoChevronForward } from "react-icons/io5";
import { PiBracketsCurlyBold } from "react-icons/pi";
import { TbApiApp, TbHomeDot, TbLogs } from "react-icons/tb";
import { router } from "../router";

export default function SidePanelNavigation({moveToTop}:{moveToTop?: boolean}){
    const {tabs, currentTab} = useSideBarStore({watch: ['currentTab']})!

    return (
      <div className={
        moveToTop?
        'undraggable flex justify-around top-0 left-0 bottom-0 transition-all border-b-2 border-b-gray-200/35 shadow-none':
        'lg:w-[12.5rem] flex justify-around sm:block sm:fixed sm:pt-14 top-0 left-0 bottom-0 bg-white transition-all border-r border-r-gray-100 shadow-sm '
      }>
        {
          tabs.map((tabName)=>{
            const selected = currentTab===tabName;
            return (
              <div key={tabName} 
                onClick={()=>{
                  updateSideBarStore({actors:['currentTab'],store: {currentTab: tabName}});
                  router.push({
                    pathname: tabName==='Home'?'/':`/${tabName.toLowerCase()}`
                  });
                }}
                className={
                  moveToTop?
                  `border-2  border-transparent ${selected?'border-b-primary':''}`:
                  `border-2  border-transparent ${selected?'border-t-primary sm:border-t-transparent sm:border-r-primary':''}`
                }
              >
                <div 
                  className={
                    moveToTop?
                    `py-3 px-3 text-sm font-semibold transition-all duration-500 rounded-sm cursor-pointer flex-col sm:flex-row flex justify-between items-center m-0.5 ${selected?'bg-primary/10 text-primary':'hover:bg-white hover:shadow-sm'} `:
                    `py-3 px-3 text-sm font-semibold cursor-pointer flex-col sm:flex-row flex justify-between items-center m-0.5 ${selected?'bg-primary/10 text-primary':'bg-white hover:bg-gray-50'} `
                  }
                >
                  {
                    selected?
                      <div className='flex justify-between items-center'>
                        {tabName==='Home'&&<TbHomeDot className={'text-primary'} size={22} />}
                        {tabName==='Projects'&&<TbApiApp className={'text-primary'} size={22} />}
                        {tabName==='Endpoints'&&<PiBracketsCurlyBold className={'text-primary'} size={21} />}
                        {tabName==='Analysis'&&<FaChartColumn className={'text-primary'} size={20} />}
                        {tabName==='Logs'&&<TbLogs className='text-primary'  size={22} />}
                        {tabName==='Help'&&<LucideHandHelping className={'text-primary'} size={22} />}
                        <span className='ml-2.5 -mb-1 hidden lg:block'>{tabName}</span>
                      </div>
                    :
                      <div className='flex justify-between items-center'>
                        {tabName==='Home'&&<TbHomeDot className='text-gray-600' size={22} />}
                        {tabName==='Projects'&&<TbApiApp className='text-gray-600' size={22} />}
                        {tabName==='Endpoints'&&<PiBracketsCurlyBold className='text-gray-600' size={21} />}
                        {tabName==='Analysis'&&<FaChartColumn className='text-gray-600' size={20} />}
                        {tabName==='Logs'&&<TbLogs className='text-gray-700'  size={22} />}
                        {tabName==='Help'&&<LucideHandHelping className='text-gray-600' size={22} />}
                        <span className='ml-2.5 -mb-1 hidden lg:block '>{tabName}</span>
                      </div>
                  }
                  {!moveToTop&&<IoChevronForward className="hidden lg:block" size={11} />}
                  {/* {selected&&<IoChevronDown className="block sm:hidden" size={11} />} */}
                </div>
              </div>
            )
          })
        }
      </div>
    )
}