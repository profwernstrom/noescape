import Supercluster from 'supercluster';
import KDBush from 'kdbush';

const now = Date.now();
let clusterIndex;
let borderSignIndex;
let borderSigns = [];

self.onmessage = function (e) {
    if (e.data) {
        const supercluster = clusterIndex[e.data.period];
        if (!supercluster) return;
        if (e.data.getClusterExpansionZoom) {
            postMessage({
                expansionZoom: supercluster.getClusterExpansionZoom(e.data.getClusterExpansionZoom),
                center: e.data.center
            });
        } else {
            // Expand bbox beyond visible screen to reduce flickering while dragging
            const [minLng, minLat, maxLng, maxLat] = e.data.bbox;
            const width = maxLng - minLng;
            const height = maxLat - minLat;
            const bbox = [minLng - width / 2, minLat - height / 2, maxLng + width / 2, maxLat + height / 2]

            const message = {borderSigns: [], clusters: new Map()};
            if (clusterIndex) {
                const clusters = supercluster.getClusters(bbox, e.data.zoom);
                for (const cluster of clusters) {
                    message.clusters.set(cluster.id, cluster);
                }
            }

            if (borderSignIndex && e.data.zoom > 13) {
                const foundIds = borderSignIndex.range(bbox[0], bbox[1], bbox[2], bbox[3]);
                message.borderSigns = foundIds.map(i => borderSigns[i]);
            }
            postMessage(message);
        }
    }
};


fetch('/data/arrests.json')
    .then(response => response.json())
    .then(geojson => {
        console.log(`loaded ${geojson.features.length} points JSON in ${(Date.now() - now) / 1000}s`);
        const options = {
            log: true,
            radius: 48,
            extent: 256,
            maxZoom: 17
        };
        const last12months = new Supercluster(options).load(geojson.features.filter(feature => {
            const arrestDate = new Date(feature.properties.date);
            const twelveMonthsAgo = new Date();
            twelveMonthsAgo.setMonth(new Date().getMonth() - 12);
            return arrestDate >= twelveMonthsAgo;
        }));
        const last3months = new Supercluster(options).load(geojson.features.filter(feature => {
            const arrestDate = new Date(feature.properties.date);
            const threeMonthsAgo = new Date();
            threeMonthsAgo.setMonth(new Date().getMonth() - 3);
            return arrestDate >= threeMonthsAgo;
        }));
        const year2025 = new Supercluster(options).load(geojson.features.filter(feature => feature.properties.date.startsWith('2025')));
        const year2024 = new Supercluster(options).load(geojson.features.filter(feature => feature.properties.date.startsWith('2024')));
        const year2023 = new Supercluster(options).load(geojson.features.filter(feature => feature.properties.date.startsWith('2023')));
        const year2022 = new Supercluster(options).load(geojson.features.filter(feature => feature.properties.date.startsWith('2022')));
        const all = new Supercluster(options).load(geojson.features);
        clusterIndex = {
            last12months,
            last3months,
            year2025,
            year2024,
            year2023,
            year2022,
            all,
        };
        postMessage({clustersReady: true});
    })
    .catch(error => console.error('Error fetching JSON:', error));

fetch('/data/signs.txt')
    .then(r => r.text())
    .then(tsv => {
        let lines = tsv.trim().split('\n');
        const index = new KDBush(lines.length);
        lines.map(line => line.split('\t'))
            .map(values => {
                const borderSign = {
                    country: values[0],
                    title: values[1],
                    lat: parseFloat(values[2]),
                    lng: parseFloat(values[3]),
                    generated: values[4] === 'true',
                };
                index.add(borderSign.lng, borderSign.lat);
                borderSigns.push(borderSign);
            });
        index.finish();
        borderSignIndex = index;
        postMessage({borderSignsReady: true});
    });
