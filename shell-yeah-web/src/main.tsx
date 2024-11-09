import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {HashRouter} from "react-router-dom";
import AuthContextProvider from "./context/AuthContext.tsx";
import SnackbarContextProvider from "./context/SnackbarContext.tsx";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <HashRouter>
        <SnackbarContextProvider>
            <AuthContextProvider>
                <App/>
            </AuthContextProvider>
        </SnackbarContextProvider>
    </HashRouter>
)
