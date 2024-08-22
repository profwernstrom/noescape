import {useMap, useMapsLibrary} from '@vis.gl/react-google-maps';
import React, {useEffect} from 'react';
import {MarkerClusterer} from '@googlemaps/markerclusterer';
import {formatDate} from "./util.js";

function getMarkerOpacity(date) {
    if (!date) return 0.5;
    const age = (new Date() - new Date(date)) / (1000 * 60 * 60 * 24);
    if (age > 180) return 0.33;
    if (age > 90) return 0.66;
    return 1;
}

function Cluster({cases, onSelectCase}) {
    const map = useMap();
    const markerLibrary = useMapsLibrary('marker');

    useEffect(() => {
        if (!map || !markerLibrary || !cases) return;
        const markers = cases
            .filter(courtCase => courtCase.position)
            .map(courtCase => {
                const content = new markerLibrary.PinElement().element;
                content.style.opacity = getMarkerOpacity(courtCase.arrestDate)
                const marker = new markerLibrary.AdvancedMarkerElement({
                    position: courtCase.position,
                    title: formatDate(courtCase.arrestDate) || null,
                    content: content,
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
