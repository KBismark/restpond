import { memo} from "react";
import logo from '../../assets/logo.png'
import { updateAppStore, useAppStore } from "../../services/app.service";
import SwitchDarkMode from "../../SwitchDarkMode";
// import SelectLanguage from "../../SelectLanguage";
import AppBar from "../../AppBar";
import SidePanelNavigation from "./sidebar";
import { useSideBarStore } from "../../services/sidebar.service";
import { IconWebhook } from "./icons";

export default memo(function MainHeader(){
    const {theme} = useAppStore({watch: ['theme']})!
    //  const { currentTab } = useSideBarStore({ watch: ['currentTab'] })!;
    
    //   const currentTabLowerCase = currentTab.toLowerCase();
    //   const showTopBarNavigation = currentTabLowerCase === 'projects' || currentTabLowerCase === 'endpoints';

    // Toggle theme function
    const toggleTheme = () => {
        updateAppStore({actors: ['theme'], store: {theme: theme === 'dark'? 'light': 'dark'}})
    };

    

    return (
        <div className="bg-black/90 sticky top-0 z-50">
            <div className={
                `draggable pt-2 pb-1 px-4 border-b-0 border-b-neutral-200 flex flex-row justify-between items-center bg-white/70 backdrop-blur-md supports-[backdrop-filter]:bg-white/5`
            }>
                <div className="flex flex-row items-center">
                    {/* <img alt="Logo" src={logo} className="block w-8 h-8 rounded" /> */}
                    {/* <div aria-hidden={true} className='flex items-center flex-col justify-center'> */}
                        <IconWebhook width={36} height={36} />
                    {/* </div> */}
                    <div className="text-zinc-900 font-hedvig-f text-[1.8rem] ml-2 font-extrabold text-white ">RESTpond</div>
                </div>

                {/* <SidePanelNavigation moveToTop={true} /> */}
                
                <div>
                    {
                        window.Main ? 
                        (
                            <div className="flex-none">
                                <AppBar />
                            </div>
                        ) : 
                        (

                            <span className="text-primary text-sm font-serif-f">Switch to live mode</span>
                        )
                    }
                    
                </div>
            </div>
        </div>
    )
})