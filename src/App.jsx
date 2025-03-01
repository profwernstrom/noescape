import {useCallback, useEffect, useState} from 'react';
import PageHeader from './PageHeader.jsx';
import Sidebar from './Sidebar';
import {loadArrests, loadBorderSigns} from "./api.js";
import DataMap from "./DataMap.jsx";
import {useFilterParams} from "./FilterParams.context.jsx";

function App() {
    const [allArrests, setAllArrests] = useState([]);
    const [borderSigns, setBorderSigns] = useState([]);
    const [selectedArrest, setSelectedArrest] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
    const {year, month, country, timePeriod} = useFilterParams();

    useEffect(() => {
        loadBorderSigns().then(setBorderSigns);
        const split = timePeriod.split('-');
        loadArrests({year, month, country, fromTime: split[0], toTime: split[1]}).then(setAllArrests);
    }, [country, month, year, timePeriod]);

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
                    <DataMap arrests={allArrests} selectedArrest={selectedArrest}
                             onSelectArrest={handleSelectArrest} borderSigns={borderSigns}/>
                </div>
            </div>
        </div>
    );
}

export default App;
