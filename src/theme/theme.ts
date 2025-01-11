export const themeObject: {lightColors: Theme; darkColors: Theme} = {
    lightColors: {
        mode: 'light',
        colors: {
            primary: '#2667FF', // '#5541EF'
            secondary:'#2667FF',
            dark: '#020202',
            white: '#ffffff',
            grey1: '#60636c',
            divider: '#eee',
    
            // Red gray
            grey3: '#ADD7F6',
            grey4: 'rgba(173, 216, 246, 0.12)',
            grey5: 'rgba(173, 216, 246, 0.12)',

            // danger: 'FF5252'
    
        },
    },
    darkColors: {
        mode: 'dark',
        colors: {
            primary: '#2667FF', // '#5541EF'
            secondary:'#2667FF',
            dark: '#020202',
            white: '#ffffff',
            grey1: '#60636c',
            divider: '#eee',
    
            // Red gray
            grey3: '#ADD7F6',
            grey4: 'rgba(173, 216, 246, 0.12)',
            grey5: 'rgba(173, 216, 246, 0.12)'
    
        },
    },
}




export type Theme = {
    colors: {
        primary: string;
        secondary: string;
        dark: string;
        white: string;
        grey1: string;
        divider: string;
        grey3: string;
        grey4: string;
        grey5: string;
    };
    mode: Modes
}

export type Modes =  'light'|'dark'