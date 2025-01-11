import { createContext, useContext, useState } from "react";
import { themeObject, type Modes, type Theme } from "./theme";

const THEME = createContext(themeObject.lightColors)

export const useTheme = (): Theme =>{
    return useContext(THEME);
}

export const useMode = ()=>{
   return useContext(THEME).mode
}

// This function will be re-assigned state setter function
// When called, the theme provider component rerenders to apply new theme mode
let globalThemeEventTrigger = (theme: Theme)=>{}

let currentThemeMode: Modes = 'light' // Keeps track of current theme

export const setThemeMode = (mode: Modes)=>{
    if(currentThemeMode===mode) return
    if(mode==='dark'){
        currentThemeMode = 'dark'
        globalThemeEventTrigger(themeObject.darkColors)
    }else{
        currentThemeMode = 'light'
        globalThemeEventTrigger(themeObject.lightColors)
    }
}

export const ThemeProvider = (props: any)=>{
    let theme: Theme;
    [theme, globalThemeEventTrigger] = useState(themeObject.lightColors) as any
    return (
        <THEME.Provider value={theme}>
            {props.children}
        </THEME.Provider>
    )
}

