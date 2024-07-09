let map;
let addMarker;
let selectedCase
let selectedBorderSign
let selectedArrestPosition;
let selectedCountry = 'RO';
let sortDirection = 'asc';
let sortColumnIndex = 2;
let cases = {};
let borderSigns = {};

function loadMapApi(apiKey) {
  var g = {
    key: apiKey,
    v: "quarterly",
    region: "UA",
    language: "uk",
  }
  var h, a, k, p = "The Google Maps JavaScript API", c = "google", l = "importLibrary", q = "__ib__",
    m = document, b = window;
  b = b[c] || (b[c] = {});
  var d = b.maps || (b.maps = {}), r = new Set, e = new URLSearchParams,
    u = () => h || (h = new Promise(async (f, n) => {
      await (a = m.createElement("script"));
      e.set("libraries", [...r] + "");
      for (k in g) e.set(k.replace(/[A-Z]/g, t => "_" + t[0].toLowerCase()), g[k]);
      e.set("callback", c + ".maps." + q);
      a.src = `https://maps.${c}apis.com/maps/api/js?` + e;
      d[q] = f;
      a.onerror = () => h = n(Error(p + " could not load."));
      a.nonce = m.querySelector("script[nonce]")?.nonce || "";
      m.head.append(a)
    }));
  d[l] ? console.warn(p + " only loads once. Ignoring:", g) : d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n))
}

async function initMap() {
  const {Map} = await google.maps.importLibrary('maps');
  const {AdvancedMarkerElement} = await google.maps.importLibrary('marker');

  map = new Map(document.getElementById('map'), {
    zoom: 7,
    center: {lat: 48.50, lng: 28.00},
    mapId: 'DEMO_MAP_ID',
  });

  addMarker = (title, position) => {
    return new AdvancedMarkerElement({
      map: map,
      position: position,
      title: title,
    });
  }
}

function loadData() {
  return fetch('data.txt')
    .then(r => r.text())
    .then(tsv => parseData(tsv))
    .then(data => cases = {
      'BY': data.filter(values => values[1] === 'BY'),
      'HU': data.filter(values => values[1] === 'HU'),
      'MD': data.filter(values => values[1] === 'MD'),
      'PL': data.filter(values => values[1] === 'PL'),
      'RO': data.filter(values => values[1] === 'RO'),
      'RU': data.filter(values => values[1] === 'RU'),
      'SK': data.filter(values => values[1] === 'SK'),
      '': data.filter(values => values[1] === ''),
    });
}

function loadBorderSigns() {
  return fetch('signs.txt')
    .then(r => r.text())
    .then(tsv => tsv.trim().split('\n').map(line => line.split('\t')))
    .then(data => {
      borderSigns = {};
      data.forEach(values => borderSigns[values[0] + "-" + values[1]] = {
        lat: parseFloat(values[2]),
        lng: parseFloat(values[3])
      });
    })
}

function addBorderSignMarker(title) {
  if (selectedBorderSign) {
    selectedBorderSign.setMap(null);
  }
  const position = borderSigns[title];
  selectedBorderSign = addMarker(title, position);
  map.setCenter(position);
}

function addArrestMarker(title, arrestPosition) {
  if (selectedArrestPosition) {
    selectedArrestPosition.setMap(null);
  }
  selectedArrestPosition = addMarker(title, arrestPosition);
  map.setCenter(arrestPosition);
}

function selectCase(caseNumber, arrestPosition, borderSign) {
  if (selectedCase) {
    document.getElementById(selectedCase).classList.remove('selected')
  }
  selectedCase = caseNumber;
  document.getElementById(selectedCase).classList.add('selected');
  addBorderSignMarker(selectedCountry + '-' + borderSign);
  if (arrestPosition) {
    addArrestMarker(caseNumber, arrestPosition);
  }
}

function createTableRow(values) {
  const caseNumber = values[0];
  const country = values[1];
  const borderSign = values[2];
  const arrestDate = values[3];
  const distance = values[4];
  const fine = values[5];
  const arrestPosition = values[6] && values[7] ? {lat: parseFloat(values[6]), lng: parseFloat(values[7])} : null;

  const tr = document.createElement('tr');
  tr.id = caseNumber;
  tr.onclick = () => selectCase(caseNumber, arrestPosition, borderSign);

  const borderSignElement = document.createElement('td');
  borderSignElement.textContent = borderSign === '' ? '?' : borderSign;
  if (borderSign && borderSigns[country + '-' + borderSign]) {
    borderSignElement.classList.add('known');
  }
  tr.appendChild(borderSignElement)

  const arrestDateElement = document.createElement('td');
  arrestDateElement.textContent = arrestDate === '' ? '?' : arrestDate.replace('T', ' ');
  tr.appendChild(arrestDateElement)

  const distanceElement = document.createElement('td');
  distanceElement.textContent = distance === '' ? '?' : distance + ' м';
  tr.appendChild(distanceElement)

  const fineElement = document.createElement('td');
  fineElement.textContent = fine === '' ? '?' : fine < 0 ? '-' : fine + ' грн';
  tr.appendChild(fineElement)

  const caseRefElement = document.createElement('td');
  caseRefElement.innerHTML = '<a target="_blank" rel="nofollow" title="Судьбове рішення" href="https://reyestr.court.gov.ua/Review/' + caseNumber + '">§</a>';
  tr.appendChild(caseRefElement)

  return tr;
}

function parseData(tsv) {
  return tsv.trim().split('\n')
    .map(line => line.split('\t'))
    .map(values => values.concat(Array(8).fill('')).slice(0, 8));
}

function getSorter() {

  const sortFunction = (a, b) => {
    let val1 = a[sortColumnIndex];
    let val2 = b[sortColumnIndex];
    if (!val1) val1 = 'ZZZZZZZ'; // Put unknown to the end
    if (!val2) val2 = 'ZZZZZZZ';
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
  cases[selectedCountry]
    .toSorted(getSorter())
    .map(values => createTableRow(values))
    .forEach(tr => tbody.appendChild(tr));
  if (selectedCase) {
    const selectedTableRow = document.getElementById(selectedCase);
    selectedTableRow.classList.add('selected');
    selectedTableRow.scrollIntoView({block: "center"});
  }
}

function sortColumn(column) {
  if (sortColumnIndex === column) {
    sortDirection = sortDirection === 'desc' ? 'asc' : 'desc';
  } else {
    sortColumnIndex = column;
    sortDirection = 'asc';
  }
  showData();
}

function addDataTableListeners() {
  document.getElementById('th-borderSign').onclick = () => sortColumn(2);
  document.getElementById('th-arrestDate').onclick = () => sortColumn(3);
  document.getElementById('th-distance').onclick = () => sortColumn(4);
  document.getElementById('th-fine').onclick = () => sortColumn(5)

  document.getElementById('country').onchange = function (event) {
    selectedCase = null;
    if (selectedBorderSign){
      selectedBorderSign.setMap(null);
    }
    selectedCountry = event.target.value;
    showData();
  }
}

fetch('API-KEY').then(r => r.text()).then(key => {
    loadMapApi(key);
    Promise.all([
      initMap(),
      loadBorderSigns(),
      loadData(),
    ]).then(addDataTableListeners).then(showData)
  }
);
