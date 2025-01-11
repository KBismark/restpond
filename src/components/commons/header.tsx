import { memo} from "react";
import logo from '../../assets/logo.png'
import { updateAppStore, useAppStore } from "../../services/app.service";
import SwitchDarkMode from "../../SwitchDarkMode";
// import SelectLanguage from "../../SelectLanguage";
import AppBar from "../../AppBar";
import SidePanelNavigation from "./sidebar";
import { useSideBarStore } from "../../services/sidebar.service";

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
        <div className={
            `draggable z-50 pt-2 px-4 border-b-0 border-b-neutral-200 flex flex-row justify-between items-center sticky top-0 bg-white/70 backdrop-blur-md supports-[backdrop-filter]:bg-white/85`
        }>
            <div className="flex flex-row items-center">
                <img alt="Logo" src={logo} className="block w-8 h-8 rounded" />
                <div className="text-zinc-900 font-hedvig-f text-[1.8rem] ml-2 font-extrabold">Tritospot</div>
            </div>
            <div className="ml-4 mr-4 mt-4 items-center justify-between hidden">
                <SwitchDarkMode />
            </div>

                {
                    <SidePanelNavigation moveToTop={true} />
                }
            
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
    )
})