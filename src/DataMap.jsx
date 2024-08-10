import {Map} from '@vis.gl/react-google-maps';
import {useCallback, useState} from "react";
import Cluster from "./Cluster.jsx";
import SelectedMarker from "./SelectedMarker.jsx";
import BorderMarker from "./BorderMarker.jsx";

function DataMap({selectedCase, onSelectCase, cases, borderSigns}) {
    const [showBorderSigns, setShowBorderSigns] = useState(false);

    const handleZoomChanged = useCallback(({map}) => {
        setShowBorderSigns(map.zoom > 13);
    }, [])

    return (
        <Map id="map" mapId="DEMO_MAP_ID" defaultCenter={{lat: 48.50, lng: 28.00}} defaultZoom={7} language="uk"
             region="UA" reuseMaps={true} streetViewControl={false} streetViewControlclassName="map"
             onZoomChanged={handleZoomChanged}>

            <SelectedMarker selectedCase={selectedCase}/>

            {showBorderSigns && borderSigns.map((borderSign) => (
                <BorderMarker key={borderSign.country + borderSign.title}
                              borderSign={borderSign}/>
            ))}
            <Cluster cases={cases} onSelectCase={onSelectCase}/>
        </Map>
    );
}

export default DataMap;
