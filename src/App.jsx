import {useCallback, useEffect, useMemo, useState} from 'react';
import PageHeader from './PageHeader.jsx';
import Sidebar from './Sidebar';
import {loadArrests, loadBorderSigns} from "./api.js";
import {APIProvider} from "@vis.gl/react-google-maps";
import DataMap from "./DataMap.jsx";

function App() {
    const [allArrests, setAllArrests] = useState([]);
    const [period, setPeriod] = useState(12);
    const [borderSigns, setBorderSigns] = useState([]);
    const [selectedArrest, setSelectedArrest] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);

    useEffect(() => {
        loadBorderSigns().then(setBorderSigns);
        loadArrests().then(setAllArrests);
    }, []);

    const visibleArrests = useMemo(() => {
        const fromDate = new Date();
        fromDate.setMonth(fromDate.getMonth() - period);
        return allArrests.filter(arrest => arrest.arrestDate && new Date(arrest.arrestDate) >= fromDate);
    }, [allArrests, period]);

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
                <Sidebar isOpen={sidebarOpen} arrests={visibleArrests} selectedArrest={selectedArrest}
                         onSelectArrest={handleSelectArrest} onSelectPeriod={setPeriod}/>
                <div className="main-content">
                    <APIProvider apiKey={import.meta.env.VITE_MAPS_API_KEY}>
                        <DataMap arrests={visibleArrests} selectedArrest={selectedArrest}
                                 onSelectArrest={handleSelectArrest} borderSigns={borderSigns}/>
                    </APIProvider>
                </div>
            </div>
        </div>
    );
}

export default App;
