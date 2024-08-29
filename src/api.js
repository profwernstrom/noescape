function parseCases(tsv) {
    return tsv.trim().split('\n')
        .map(line => line.split('\t'))
        .map(values => {
            values = values.concat(Array(3).fill('')).slice(0, 3);
            return {
                caseId: values[0],
                publicationDate: values[1] || null,
                fine: values[2] || null
            };
        });
}

function parseArrests(tsv) {
    return tsv.trim().split('\n')
        .map(line => line.split('\t'))
        .map(values => {
            values = values.concat(Array(7).fill('')).slice(0, 7);
            return {
                arrestDate: values[0],
                country: values[1] || null,
                borderSign: values[2] || null,
                distance: values[3] ? parseInt(values[3]) : null,
                position: {lat: parseFloat(values[4]), lng: parseFloat(values[5])},
                caseIds: values[6].split(',')
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
            generated: values[4] === 'true',
        }));
}

export async function loadArrests() {
    const arrestsPromise = fetch(`arrests.txt`)
        .then(response => response.text())
        .then(text => parseArrests(text));
    const casesPromise = fetch(`cases.txt`)
        .then(response => response.text())
        .then(text => parseCases(text));

    return Promise.all([arrestsPromise, casesPromise])
        .then(async ([arrestsPromise, casesPromise]) => {
            const arrests = await arrestsPromise;
            const allCases = await casesPromise;
            const caseMap = {};
            allCases.forEach((courtCase) => caseMap[courtCase.caseId] = courtCase);

            const result = [];
            arrests.forEach(arrestRow => {
                const {arrestDate, country, borderSign, distance, position, caseIds} = arrestRow;
                const cases = [];
                caseIds.forEach(caseId => cases.push(caseMap[caseId]));
                result.push({id: arrestRow.caseIds[0], arrestDate, country, borderSign, position, distance, cases});
            });
            return result;
        });

}

export function loadBorderSigns() {
    return fetch('signs.txt')
        .then(r => r.text())
        .then(tsv => parseBorderSigns(tsv));
}
