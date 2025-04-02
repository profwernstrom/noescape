import Supercluster from "supercluster";

const now = Date.now();
let index;

self.onmessage = function (e) {
    if (e.data) {
        if (e.data.getClusterExpansionZoom) {
            postMessage({
                expansionZoom: index.getClusterExpansionZoom(e.data.getClusterExpansionZoom),
                center: e.data.center
            });
        } else if (index) {
            postMessage(index.getClusters(e.data.bbox, e.data.zoom));
        }
    }
};


fetch('/data/arrests.json')
    .then(response => response.json())
    .then(geojson => {
        console.log(`loaded ${geojson.features.length} points JSON in ${(Date.now() - now) / 1000}s`);
        const supercluster = new Supercluster({
            log: true,
            radius: 48,
            extent: 256,
            maxZoom: 17
        });
        index = supercluster.load(geojson.features);
        postMessage({ready: true});
    })
    .catch(error => console.error('Error fetching JSON:', error));
