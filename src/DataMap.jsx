import {useEffect, useRef} from "react";
import L from "leaflet";
import {formatDate} from "./util.js";

let ready = false;

function DataMap() {
    const mapRef = useRef(null);
    const mapContainerRef = useRef(null);
    const workerRef = useRef(null);
    const markersRef = useRef(null);
    const borderSignsRef = useRef(null);

    useEffect(() => {
        if (!mapRef.current) {
            mapRef.current = L.map(mapContainerRef.current).setView([48.5, 28.0], 7);

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: '&copy; OpenStreetMap contributors',
            }).addTo(mapRef.current);

            mapRef.current.on('moveend', update);

            borderSignsRef.current = L.layerGroup(null).addTo(mapRef.current);

            const clusterGeoJson = L.geoJson(null, {
                pointToLayer: createClusterIcon,
                onEachFeature: onEachFeature
            });
            markersRef.current = clusterGeoJson.addTo(mapRef.current)

            markersRef.current.on('click', (e) => {
                if (e.layer.feature.properties.cluster_id) {
                    workerRef.current.postMessage({
                        getClusterExpansionZoom: e.layer.feature.properties.cluster_id,
                        center: e.latlng
                    });
                }
            });
        }

        return () => {
            mapRef.current?.remove();
            mapRef.current = null;
        };
    }, []);

    useEffect(() => {
        workerRef.current = new Worker(new URL('./worker.js', import.meta.url), {type: 'module'})

        workerRef.current.onmessage = function (e) {
            if (e.data.clustersReady || e.data.borderSignsReady) {
                ready = true;
                update();
            } else if (e.data.expansionZoom) {
                mapRef.current.flyTo(e.data.center, e.data.expansionZoom);
            } else {
                markersRef.current.clearLayers();
                markersRef.current.addData(e.data.clusters);
                borderSignsRef.current.clearLayers();
                e.data.borderSigns.forEach(borderSign => borderSignsRef.current.addLayer(createBorderSignIcon(borderSign)));
            }
        };

        return () => {
            workerRef.current.terminate(); // Cleanup worker on unmount
        };
    }, []);

    function update() {
        if (!ready) return;
        const bounds = mapRef.current.getBounds();
        workerRef.current.postMessage({
            bbox: [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()],
            zoom: mapRef.current.getZoom()
        });
    }

    function createClusterIcon(feature, latlng) {
        if (!feature.properties.cluster) return L.marker(latlng, {
            icon: L.divIcon({
                html: `<div></div>`,
                className: `marker`,
                iconSize: L.point(30, 30)
            })
        });

        const count = feature.properties.point_count;
        const size =
            count < 100 ? 'small' : 'large';
        const icon = L.divIcon({
            html: `<div><span>${feature.properties.point_count_abbreviated}</span></div>`,
            className: `marker-cluster marker-cluster-${size}`,
            iconSize: L.point(40, 40)
        });

        return L.marker(latlng, {icon});
    }

    function createBorderSignIcon(borderSign) {
        const icon = L.divIcon({
            html: `<span>${borderSign.title}</span>`,
            className: `border-sign`
        });
        return L.marker([borderSign.lat, borderSign.lng], {icon, interactive: false})
    }

    function onEachFeature(feature, layer) {
        if (feature.properties && feature.properties.date) {

            const casesHtml = feature.properties.cases.map(courtCase =>
                `<br/>
                <a target="noescape_${courtCase.id}" rel="nofollow" title="Судове рішення"
                  href="https://reyestr.court.gov.ua/Review/${courtCase.id}">Судове рішення</a><br/>
                Дата оприлюднення:&nbsp;${formatDate(courtCase.pub) ?? '?'}<br/>
                Штраф:&nbsp;${courtCase.fine ?? '?'} грн<br/>`)
                .join('\n');

            layer.bindPopup(
                `<div>
                Приблизне місце затримання<br/><br/>
                Дата затримання:&nbsp;${formatDate(feature.properties.date) ?? '?'}<br/>
                Відстань до кордону:&nbsp;${feature.properties.distance ?? '?'} м<br/>
                ${casesHtml}
                </div>`);
        }
    }

    return <div ref={mapContainerRef} style={{height: "100%", width: "100%"}}/>;
}

export default DataMap;
