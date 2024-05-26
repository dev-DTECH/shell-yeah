import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {BrowserRouter} from "react-router-dom";
import AuthContextProvider from "./context/AuthContext.tsx";
import SnackbarContextProvider from "./context/SnackbarContext.tsx";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <SnackbarContextProvider>
            <AuthContextProvider>
                <App/>
            </AuthContextProvider>
        </SnackbarContextProvider>
    </BrowserRouter>
)
