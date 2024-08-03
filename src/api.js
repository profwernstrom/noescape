function parseData(tsv) {
    return tsv.trim().split('\n')
        .map(line => line.split('\t'))
        .map(values => {
            values = values.concat(Array(9).fill('')).slice(0, 9);
            return {
                caseId: values[0],
                country: values[1] || null,
                borderSign: values[2] || null,
                arrestDate: values[3] || null,
                publicationDate: values[4] || null,
                distance: values[5] ? parseInt(values[5]) : null,
                fine: values[6] || null,
                position: values[7] ? {lat: parseFloat(values[7]), lng: parseFloat(values[8])} : null,
            };
        });
}

function parseBorderSigns(tsv) {
    return tsv.trim().split('\n')
        .map(line => line.split('\t'))
        .map(values => ({
            country: values[0],
            title: values[1],
            lat: parseFloat(values[2]),
            lng: parseFloat(values[3]),
        }));
}

export function loadData(year) {
    return fetch(`data-${year}.txt`)
        .then(response => response.text())
        .then(text => parseData(text));
}

export function loadBorderSigns() {
    return fetch('signs.txt')
        .then(r => r.text())
        .then(tsv => parseBorderSigns(tsv));
}
