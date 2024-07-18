function parseData(tsv) {
    return tsv.trim().split('\n')
        .map(line => line.split('\t'))
        .map(values => {
            values = values.concat(Array(8).fill('')).slice(0, 8);
            return {
                caseId: values[0],
                country: values[1] || null,
                borderSign: values[2] || null,
                arrestDate: values[3] || null,
                distance: values[4] ? parseInt(values[4]) : null,
                fine: values[5] ? parseInt(values[5]) : null,
                position: values[6] ? {lat: parseFloat(values[6]), lng: parseFloat(values[7])} : null,
            };
        });
}

export function loadData() {
    return fetch('data.txt')
        .then(response => response.text())
        .then(text => parseData(text));
}

function loadBorderSigns() {
    return fetch('signs.txt')
        .then(r => r.text())
        .then(tsv => tsv.trim().split('\n').map(line => line.split('\t')))
        .then(data => {
            // borderSigns = {};
            // data.forEach(values => borderSigns[values[0] + "-" + values[1]] = {
            //     lat: parseFloat(values[2]),
            //     lng: parseFloat(values[3])
            // });
        })
}
