import {AdvancedMarker, InfoWindow, Map, Pin, useMap} from '@vis.gl/react-google-maps';
import {formatDate} from "./util.js";
import {useCallback, useEffect, useRef, useState} from "react";
import Cluster from "./Cluster.jsx";

let map = null;

function MapCapture() {
    map = useMap();
    return <></>
}


function DataMap({selectedCase, onSelectCase, cases, borderSigns}) {

    const [infowindowOpen, setInfowindowOpen] = useState(false);
    const [showBorderSigns, setShowBorderSigns] = useState(false);

    const markerRef = useRef();


    useEffect(() => {
        setInfowindowOpen(false);
        if (selectedCase && selectedCase.position && map) {
            map.panTo(selectedCase.position)
        }
        setInfowindowOpen(true);
    }, [selectedCase]);

    const handleSelectCase = useCallback((selectedCase) => {
        setInfowindowOpen(false);
        onSelectCase(selectedCase);
        setInfowindowOpen(true);
    }, []);

    const handleZoomChanged = useCallback(({map}) => {
        setShowBorderSigns(map.zoom > 13);
        console.log("zoom:" + map.zoom);
    }, [])

    return (
        <Map id="map" mapId="DEMO_MAP_ID" defaultCenter={{lat: 48.50, lng: 28.00}} defaultZoom={7} language="uk"
             region="UA" reuseMaps={true} streetViewControl={false} streetViewControlclassName="map"
             onZoomChanged={handleZoomChanged}>

            {selectedCase && (
                <>
                    {infowindowOpen && (
                        <InfoWindow anchor={markerRef.current} onClose={() => setInfowindowOpen(false)}
                                    headerContent="Приблизне місце затримання">
                            <p>Дата затримання:&nbsp;
                                {selectedCase.arrestDate ? formatDate(selectedCase.arrestDate) : '?'}</p>
                            <p>Дата оприлюднення:&nbsp;
                                {selectedCase.publicationDate ? formatDate(selectedCase.publicationDate) : '?'}</p>
                            <p>Відстань до кордону:&nbsp;
                                {selectedCase.distance ? selectedCase.distance + ' м' : '?'}</p>
                            <p>Штраф:&nbsp;
                                {selectedCase.fine ? selectedCase.fine + ' грн' : '?'}</p>
                            <p><a target="_blank" rel="nofollow" title="Судове рішення"
                                  href={'https://reyestr.court.gov.ua/Review/' + selectedCase.caseId}>Судове рішення</a>
                            </p>
                        </InfoWindow>
                    )}

                    <AdvancedMarker
                        ref={markerRef}
                        position={selectedCase.position}
                        title={formatDate(selectedCase.arrestDate)}
                        zIndex={Number.MAX_SAFE_INTEGER}
                        onClick={() => setInfowindowOpen(true)}>
                        <Pin background={"yellow"} borderColor={"brown"} glyphColor={"orange"}></Pin>
                    </AdvancedMarker>
                </>
            )}
            {showBorderSigns && borderSigns.map((borderSign) => (
                <AdvancedMarker
                    key={borderSign.country + borderSign.title}
                    position={borderSign}>
                    <div
                        style={{
                            position: 'absolute',
                            backgroundColor: '#99ff99',
                            top: 0,
                            left: 0,
                            transform: 'translate(-50%, -50%)'
                        }}>{borderSign.title}</div>
                </AdvancedMarker>
            ))}
            <MapCapture/>
            <Cluster cases={cases} onSelectCase={handleSelectCase}/>
        </Map>
    );
}

export default DataMap;
