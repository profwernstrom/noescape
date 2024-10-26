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
            values = values.concat(Array(8).fill('')).slice(0, 8);
            return {
                arrestDate: values[0],
                arrestTime: values[1] ,
                country: values[2] || null,
                borderSign: values[3] || null,
                distance: values[4] ? parseInt(values[4]) : null,
                position: {lat: parseFloat(values[5]), lng: parseFloat(values[6])},
                caseIds: values[7].split(',')
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
    const arrestsPromise = fetch(`data/arrests.txt`)
        .then(response => response.text())
        .then(text => parseArrests(text));
    const casesPromise = fetch(`data/cases.txt`)
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
                const {arrestDate, arrestTime, country, borderSign, distance, position, caseIds} = arrestRow;
                const cases = [];
                caseIds.forEach(caseId => cases.push(caseMap[caseId]));
                const groupSize = cases.length;
                result.push({id: arrestRow.caseIds[0], arrestDate, arrestTime, country, borderSign, position, distance, groupSize, cases});
            });
            return result;
        });

}

export function loadBorderSigns() {
    return fetch('data/signs.txt')
        .then(r => r.text())
        .then(tsv => parseBorderSigns(tsv));
}
