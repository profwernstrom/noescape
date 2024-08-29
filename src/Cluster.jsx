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

function Cluster({arrests, onSelectArrest}) {
    const map = useMap();
    const markerLibrary = useMapsLibrary('marker');

    useEffect(() => {
        if (!map || !markerLibrary || !arrests) return;
        const markers = arrests
            .filter(arrest => arrest.position)
            .map(arrest => {
                const content = new markerLibrary.PinElement().element;
                content.style.opacity = getMarkerOpacity(arrest.arrestDate)
                const marker = new markerLibrary.AdvancedMarkerElement({
                    position: arrest.position,
                    title: formatDate(arrest.arrestDate) || null,
                    content: content,
                    gmpClickable: true,
                });
                marker.addListener("click", () => onSelectArrest(arrest));
                return marker;
            });
        new MarkerClusterer({map, markers});
    }, [map, markerLibrary, arrests]);

    return (
        <></>
    );
}

export default Cluster;
