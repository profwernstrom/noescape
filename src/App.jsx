import {useCallback, useEffect, useState} from 'react';
import PageHeader from './PageHeader.jsx';
import Sidebar from './Sidebar';
import {loadArrests, loadBorderSigns} from "./api.js";
import {APIProvider} from "@vis.gl/react-google-maps";
import DataMap from "./DataMap.jsx";
import {useFilterParams} from "./FilterParams.context.jsx";

function App() {
    const [allArrests, setAllArrests] = useState([]);
    const [borderSigns, setBorderSigns] = useState([]);
    const [selectedArrest, setSelectedArrest] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
    const {year, month, country, fromTime, toTime} = useFilterParams();

    useEffect(() => {
        loadBorderSigns().then(setBorderSigns);
        loadArrests({year, month, country, fromTime, toTime}).then(setAllArrests);
    }, [country, month, year, fromTime, toTime]);

    const handleSelectArrest = useCallback((selected) => {
        setSelectedArrest(selected);
        if (window.innerWidth < 768) {
            setSidebarOpen(false);
        }
    }, []);

    const handleToggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    useEffect(() => {
        const handleResize = () => {
            setSidebarOpen(window.innerWidth >= 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="app">
            <PageHeader onToggleSidebar={handleToggleSidebar}/>
            <div className={sidebarOpen ? 'sidebar-open' : ''}>
                <Sidebar isOpen={sidebarOpen} arrests={allArrests} selectedArrest={selectedArrest}
                         onSelectArrest={handleSelectArrest}/>
                <div className="main-content">
                    <APIProvider apiKey={import.meta.env.VITE_MAPS_API_KEY}>
                        <DataMap arrests={allArrests} selectedArrest={selectedArrest}
                                 onSelectArrest={handleSelectArrest} borderSigns={borderSigns}/>
                    </APIProvider>
                </div>
            </div>
        </div>
    );
}

export default App;
