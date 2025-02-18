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

export async function loadArrests(filters) {
    const validFilters = Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value != null)
    );

    const queryParams = new URLSearchParams(validFilters).toString();
    const url = `/api/court-cases${queryParams ? `?${queryParams}` : ""}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    return await response.json();
}

export function loadBorderSigns() {
    return fetch('data/signs.txt')
        .then(r => r.text())
        .then(tsv => parseBorderSigns(tsv));
}
