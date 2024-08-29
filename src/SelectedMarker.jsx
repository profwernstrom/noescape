import {useEffect, useState} from "react";
import {AdvancedMarker, InfoWindow, Pin, useAdvancedMarkerRef, useMap} from "@vis.gl/react-google-maps";
import {formatDate} from "./util.js";
import BorderMarker from "./BorderMarker.jsx";

function SelectedMarker({selectedArrest}) {
    const [infoOpen, setInfoOpen] = useState(false);
    const [markerRef, marker] = useAdvancedMarkerRef();
    const map = useMap();

    useEffect(() => {
        if (selectedArrest && selectedArrest.position && map) {
            map.panTo(selectedArrest.position)
        }
        setInfoOpen(selectedArrest);
    }, [selectedArrest, map]);

    return (
        <>
            {selectedArrest && (
                <>
                    <AdvancedMarker
                        ref={markerRef}
                        position={selectedArrest.position}
                        title={formatDate(selectedArrest.arrestDate)}
                        zIndex={Number.MAX_SAFE_INTEGER}
                        onClick={() => setInfoOpen(true)}>
                        <Pin background={"yellow"} borderColor={"brown"} glyphColor={"orange"}></Pin>
                    </AdvancedMarker>

                    {infoOpen && (
                        <InfoWindow anchor={marker} onClose={() => setInfoOpen(false)}
                                    headerContent="Приблизне місце затримання">
                            <p>Дата затримання:&nbsp;
                                {selectedArrest.arrestDate ? formatDate(selectedArrest.arrestDate) : '?'}</p>
                            <p>Відстань до кордону:&nbsp;
                                {selectedArrest.distance ? selectedArrest.distance + ' м' : '?'}</p>

                            {selectedArrest && selectedArrest.cases && selectedArrest.cases.map(courtCase => (
                                <div key={courtCase.caseId}>
                                    <br/>
                                    <p>Дата оприлюднення:&nbsp;
                                        {courtCase.publicationDate ? formatDate(courtCase.publicationDate) : '?'}</p>
                                    <p>Штраф:&nbsp;
                                        {courtCase.fine ? courtCase.fine + ' грн' : '?'}</p>
                                    <p><a target="_blank" rel="nofollow" title="Судове рішення"
                                          href={'https://reyestr.court.gov.ua/Review/' + courtCase.caseId}>Судове
                                        рішення</a>
                                    </p>
                                </div>
                            ))}
                        </InfoWindow>
                    )}
                </>
            )}
        </>
    )
}

export default SelectedMarker;