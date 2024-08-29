import {useCallback, useEffect, useMemo, useState} from 'react'
import Sidebar from "./Sidebar.jsx";
import PageHeader from "./PageHeader.jsx";
import DataMap from "./DataMap.jsx";
import {loadBorderSigns, loadArrests} from "./api.js";
import {APIProvider} from "@vis.gl/react-google-maps";


function App() {
    const [allArrests, setAllArrests] = useState([]);
    const [period, setPeriod] = useState(6);
    const [borderSigns, setBorderSigns] = useState([]);
    const [selectedArrest, setSelectedArrest] = useState(null);

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
    }, []);

    return (
        <div className="container">
            <PageHeader></PageHeader>
            <div className="content">
                <APIProvider apiKey={import.meta.env.VITE_MAPS_API_KEY}>
                    <DataMap arrests={visibleArrests} selectedArrest={selectedArrest}
                             onSelectArrest={handleSelectArrest} borderSigns={borderSigns}/>
                </APIProvider>
                <Sidebar arrests={visibleArrests} selectedArrest={selectedArrest}
                         onSelectArrest={handleSelectArrest} onSelectPeriod={setPeriod}></Sidebar>
            </div>
        </div>
    );
}

export default App
