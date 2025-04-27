import {useEffect, useState} from 'react';
import PageHeader from './PageHeader.jsx';
import Sidebar from './Sidebar';
import DataMap from "./DataMap.jsx";

function App() {
    const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);

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
                <Sidebar/>
                <div className="main-content">
                    <DataMap sidebarOpen={sidebarOpen}/>
                </div>
            </div>
        </div>
    );
}

export default App;
