import {useMap, useMapsLibrary} from '@vis.gl/react-google-maps';
import React, {useEffect} from 'react';
import {MarkerClusterer} from '@googlemaps/markerclusterer';
import {formatDate} from "./util.js";

function Cluster({cases, onSelectCase}) {
    const map = useMap();
    const markerLibrary = useMapsLibrary('marker');

    useEffect(() => {
        if (!map || !markerLibrary || !cases) return;
        const markers = cases
            .filter(courtCase => courtCase.position)
            .map(courtCase => {
                const marker = new markerLibrary.AdvancedMarkerElement({
                    position: courtCase.position,
                    title: formatDate(courtCase.arrestDate) || null,
                    gmpClickable: true,
                });
                marker.addListener("click", () => onSelectCase(courtCase));
                return marker;
            });
        new MarkerClusterer({map, markers});
    }, [map, markerLibrary, cases]);

    return (
        <></>
    );
}

export default Cluster;
