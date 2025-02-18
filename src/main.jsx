import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {FilterParamsProvider} from "./FilterParams.context.jsx";

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <FilterParamsProvider>
            <App/>
        </FilterParamsProvider>
    </StrictMode>,
)
