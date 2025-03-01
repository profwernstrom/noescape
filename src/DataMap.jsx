import {useCallback, useState} from "react";
import {MapContainer, Marker, TileLayer, useMapEvents} from "react-leaflet";
import L from "leaflet";
import SelectedMarker from "./SelectedMarker.jsx";
import Cluster from "./Cluster.jsx";

function DataMap({arrests, selectedArrest, onSelectArrest, borderSigns}) {
    const [showBorderSigns, setShowBorderSigns] = useState(false);

    function ZoomHandler() {
        useMapEvents({
            zoomend: (e) => setShowBorderSigns(e.target.getZoom() > 13)
        });
        return null;
    }

    const customBorderSign = useCallback((borderSign) => new L.DivIcon({
        html: `<div class="border-sign" style="background: ${borderSign.generated ? '#cccccc' : '#99ff99'}">
                ${borderSign.title}
            </div>`,
    }), []);

    return (
        <MapContainer id="map" center={[48.50, 32.00]} zoom={7} scrollWheelZoom={true}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
            <ZoomHandler/>

            <SelectedMarker selectedArrest={selectedArrest}/>

            {showBorderSigns && borderSigns.map((borderSign) => (
                <Marker key={borderSign.country + borderSign.title} position={[borderSign.lat, borderSign.lng]}
                        icon={customBorderSign(borderSign)}/>
            ))}

            <Cluster arrests={arrests} onSelectArrest={onSelectArrest}/>
        </MapContainer>
    );
}

export default DataMap;
