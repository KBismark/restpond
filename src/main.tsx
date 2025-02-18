
import ReactDOM from 'react-dom';
import './index.css';
import './plugins/i18n';
import App from './App';
import React, { memo, StrictMode, useLayoutEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {configureForReact} from 'statestorejs'
import { useAppStore } from './services/app.service'
import { BrowserRouter } from 'react-router';

configureForReact(React);

const AppMemo = memo(App)
const AppWithTheme = ()=>{
  const {theme} = useAppStore({watch: ['theme']})!

  useLayoutEffect(()=>{
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(theme);
      window.localStorage.setItem('theme', theme);
  },[theme])
  
  return <AppMemo />
}


// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AppWithTheme/>
    </BrowserRouter>
  </StrictMode>,
)
