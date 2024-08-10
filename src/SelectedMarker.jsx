import {useEffect, useState} from "react";
import {AdvancedMarker, InfoWindow, Pin, useAdvancedMarkerRef, useMap} from "@vis.gl/react-google-maps";
import {formatDate} from "./util.js";

function SelectedMarker({selectedCase}) {
    const [infoOpen, setInfoOpen] = useState(false);
    const [markerRef, marker] = useAdvancedMarkerRef();
    const map = useMap();

    useEffect(() => {
        if (selectedCase && selectedCase.position && map) {
            map.panTo(selectedCase.position)
        }
        setInfoOpen(selectedCase);
    }, [selectedCase, map]);

    return (
        <>
            {selectedCase && (
                <>
                    <AdvancedMarker
                        ref={markerRef}
                        position={selectedCase.position}
                        title={formatDate(selectedCase.arrestDate)}
                        zIndex={Number.MAX_SAFE_INTEGER}
                        onClick={() => setInfoOpen(true)}>
                        <Pin background={"yellow"} borderColor={"brown"} glyphColor={"orange"}></Pin>
                    </AdvancedMarker>

                    {infoOpen && (
                        <InfoWindow anchor={marker} onClose={() => setInfoOpen(false)}
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
                </>
            )}
        </>
    )
}

export default SelectedMarker;