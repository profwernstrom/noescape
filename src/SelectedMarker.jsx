import {useEffect} from "react";
import L from 'leaflet';
import {Marker, Popup, useMap} from "react-leaflet";
import {formatDate} from "./util.js";

function SelectedMarker({selectedArrest}) {
    const map = useMap();

    useEffect(() => {
        if (selectedArrest && selectedArrest.position && map) {
            map.panTo([selectedArrest.position.lat, selectedArrest.position.lng])
        }
    }, [selectedArrest, map]);

    const customIcon = L.divIcon({
        className: "custom-marker",
        html: `<div style="
    background-color: yellow;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid white;
  "></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
    });

    return (
        <>
            {selectedArrest && (
                <>
                    <Marker position={[selectedArrest.position.lat, selectedArrest.position.lng]} icon={customIcon}>
                        <Popup>
                            <div className="leaflet-popup-header">Приблизне місце затримання</div>
                            <>
                                <p>Дата затримання:&nbsp;
                                    {selectedArrest.arrestDate ? formatDate(selectedArrest.arrestDate) : '?'}</p>
                                <p>Відстань до кордону:&nbsp;
                                    {selectedArrest.distance ? selectedArrest.distance + ' м' : '?'}</p>
                            </>
                            {selectedArrest && selectedArrest.cases && selectedArrest.cases.map(courtCase => (
                                <div key={courtCase.caseId}>
                                    <br/>
                                    <p><a target={'noescape_' + courtCase.caseId} rel="nofollow" title="Судове рішення"
                                          href={'https://reyestr.court.gov.ua/Review/' + courtCase.caseId}>Судове
                                        рішення</a>
                                        <p>Дата оприлюднення:&nbsp;
                                            {courtCase.publicationDate ? formatDate(courtCase.publicationDate) : '?'}</p>
                                        <p>Штраф:&nbsp;
                                            {courtCase.fine ? courtCase.fine + ' грн' : '?'}</p>
                                    </p>
                                </div>
                            ))}
                        </Popup>
                    </Marker>
                </>
            )}
        </>
    )
}

export default SelectedMarker;