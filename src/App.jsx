import {useCallback, useEffect, useState} from 'react'
import Sidebar from "./Sidebar.jsx";
import PageHeader from "./PageHeader.jsx";
import DataMap from "./DataMap.jsx";
import {loadBorderSigns, loadArrests} from "./api.js";
import {APIProvider} from "@vis.gl/react-google-maps";


function App() {
    const [arrests, setArrests] = useState([]);
    const [borderSigns, setBorderSigns] = useState([]);
    const [selectedArrest, setSelectedArrest] = useState(null);

    useEffect(() => {
        loadBorderSigns().then(setBorderSigns);
        loadArrests().then(setArrests);
    }, []);


    const handleSelectArrest = useCallback((selected) => {
        setSelectedArrest(selected);
    }, []);

    return (
        <div className="container">
            <PageHeader></PageHeader>
            <div className="content">
                <APIProvider apiKey={import.meta.env.VITE_MAPS_API_KEY}>
                    <DataMap arrests={arrests} selectedArrest={selectedArrest} onSelectArrest={handleSelectArrest} borderSigns={borderSigns}/>
                </APIProvider>
                <Sidebar arrests={arrests} selectedArrest={selectedArrest} onSelectArrest={handleSelectArrest}></Sidebar>
            </div>
        </div>
    );
}

export default App
