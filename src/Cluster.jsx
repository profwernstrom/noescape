import {Marker} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";

function getMarkerOpacity(date) {
    if (!date) return 0.5;
    const age = (new Date() - new Date(date)) / (1000 * 60 * 60 * 24);
    if (age > 180) return 0.33;
    if (age > 90) return 0.66;
    return 1;
}

function Cluster({arrests, onSelectArrest}) {
    return (
        <MarkerClusterGroup>
            {arrests.filter(arrest => arrest.position).map(arrest => (
                <Marker
                    key={arrest.id}
                    position={[arrest.position.lat, arrest.position.lng]}
                    opacity={getMarkerOpacity(arrest.arrestDate)}
                    eventHandlers={{
                        click: () => onSelectArrest(arrest),
                    }}
                >
                </Marker>
            ))}
        </MarkerClusterGroup>
    );
}

export default Cluster;
