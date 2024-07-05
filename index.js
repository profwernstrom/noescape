// Initialize and add the map
let map;

async function initMap() {
  const position = {lat: 48.50, lng: 28.00};
  // Request needed libraries.
  //@ts-ignore
  const {Map} = await google.maps.importLibrary("maps");
  const {AdvancedMarkerElement} = await google.maps.importLibrary("marker");

  // The map, centered at Uluru
  map = new Map(document.getElementById("map"), {
    zoom: 7,
    center: position,
    mapId: "DEMO_MAP_ID",
  });

  new AdvancedMarkerElement({
    map: map,
    position: position,
    title: "Demo marker",
  });
}

function loadData() {
  fetch('data.txt')
    .then(r => r.text())
    .then(tsv => parseData(tsv))
    .then(data => {
      document.data = data;
      showData()
    })
}

function createTableRow(values) {
  const tr = document.createElement('tr');
  tr.id = values[0];

  const borderSign = document.createElement('td');
  borderSign.textContent = values[1] === '' ? '?' : values[1];
  tr.appendChild(borderSign)

  const arrestDate = document.createElement('td');
  arrestDate.textContent = values[2] === '' ? '?' : values[2].replace('T', ' ');
  tr.appendChild(arrestDate)

  const distance = document.createElement('td');
  distance.textContent = values[3] === '' ? '?' : values[3] + ' м';
  tr.appendChild(distance)

  const fine = document.createElement('td');
  fine.textContent = values[4] === '' ? '?' : values[4] < 0 ? '-' : values[4] + ' грн';
  tr.appendChild(fine)

  const caseRef = document.createElement('td');
  caseRef.innerHTML = '<a target="_blank" rel="nofollow" title="Судьбове рішення" href="https://reyestr.court.gov.ua/Review/' + values[0] + '">§</a>';
  tr.appendChild(caseRef)

  return tr;
}

function parseData(tsv) {
  return tsv.trim().split('\n')
    .map(line => line.split('\t'))
    .map(values => values.concat(Array(5).fill('')).slice(0, 5))
    .filter(values => values[4] === '' || values[4] >= 0);
}

function getSorter() {
  const sortColumn = document.sortColumn ? document.sortColumn : 1
  const sortDirection = document.sortDirection ? document.sortDirection : 'desc'

  const sortFunction = (a, b) => {
    let val1 = a[sortColumn];
    let val2 = b[sortColumn];
    if (val1 === undefined || val1 === null) val1 = '';
    if (val2 === undefined || val2 === null) val2 = '';
    val1 = val1.padStart(7)
    val2 = val2.padStart(7)
    return val1.toString().localeCompare(val2.toString());
  }

  if (sortDirection === 'desc') {
    return (a, b) => -sortFunction(a, b); // reverse
  } else {
    return sortFunction;
  }
}

function showData() {
  const tbody = document.getElementById('data-table-body');
  tbody.replaceChildren();
  document.data
    .toSorted(getSorter())
    .map(values => createTableRow(values))
    .forEach(tr => tbody.appendChild(tr));
}

function toggleSortDirection() {
  document.sortDirection = document.sortDirection === 'desc' ? 'asc' : 'desc';
}

initMap();
loadData();

document.getElementById('th-borderSign').onclick = function () {
  if (document.sortColumn === 1) {
    toggleSortDirection();
  } else {
    document.sortColumn = 1;
    document.sortDirection = 'asc';
  }
  showData();
}

document.getElementById('th-arrestDate').onclick = function () {
  if (document.sortColumn === 2) {
    toggleSortDirection();
  } else {
    document.sortColumn = 2;
    document.sortDirection = 'desc';
  }
  showData();
}

document.getElementById('th-distance').onclick = function () {
  if (document.sortColumn === 3) {
    toggleSortDirection();
  } else {
    document.sortColumn = 3;
    document.sortDirection = 'asc';
  }
  showData();
}

document.getElementById('th-fine').onclick = function () {
  if (document.sortColumn === 4) {
    toggleSortDirection();
  } else {
    document.sortColumn = 4;
    document.sortDirection = 'asc';
  }
  showData();
}
