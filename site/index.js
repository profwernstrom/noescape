// Initialize and add the map
let map;
let addMarker;
let selectedBorderSign
let selectedCountry = 'RO';

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
    .then(data => document.data = data);
}

function loadBorderSigns() {
  return fetch('signs.txt')
    .then(r => r.text())
    .then(tsv => tsv.trim().split('\n').map(line => line.split('\t')))
    .then(data => {
      document.borderSigns = {};
      data.forEach(values => document.borderSigns[values[0] + "-" + values[1]] = {
        lat: parseFloat(values[2]),
        lng: parseFloat(values[3])
      });
      console.log(document.borderSigns);
    })
}

function addBorderSignMarker(title) {
  if (selectedBorderSign) {
    selectedBorderSign.setMap(null);
  }
  const position = document.borderSigns[title];
  selectedBorderSign = addMarker(title, position);
  map.setCenter(position);
}

function createTableRow(values) {
  const caseNumber = values[0];
  const country = values[1];
  const borderSign = values[2];
  const arrestDate = values[3];
  const distance = values[4];
  const fine = values[5];

  const tr = document.createElement('tr');
  tr.id = caseNumber;

  const borderSignElement = document.createElement('td');
  borderSignElement.textContent = borderSign === '' ? '?' : borderSign;
  if (borderSign && document.borderSigns[country + '-' + borderSign]) {
    borderSignElement.onclick = () => addBorderSignMarker(country + '-' + borderSign);
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
    .map(values => values.concat(Array(6).fill('')).slice(0, 6));
}

function getSorter() {
  const sortColumn = document.sortColumn ? document.sortColumn : 1
  const sortDirection = document.sortDirection ? document.sortDirection : 'asc'

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
    .filter(values => values[1] === selectedCountry)
    .toSorted(getSorter())
    .map(values => createTableRow(values))
    .forEach(tr => tbody.appendChild(tr));
}

function toggleSortDirection() {
  document.sortDirection = document.sortDirection === 'desc' ? 'asc' : 'desc';
}

function addDataTableListeners() {
  document.getElementById('th-borderSign').onclick = function () {
    if (document.sortColumn === 2) {
      toggleSortDirection();
    } else {
      document.sortColumn = 2;
      document.sortDirection = 'asc';
    }
    showData();
  }

  document.getElementById('th-arrestDate').onclick = function () {
    if (document.sortColumn === 3) {
      toggleSortDirection();
    } else {
      document.sortColumn = 3;
      document.sortDirection = 'desc';
    }
    showData();
  }

  document.getElementById('th-distance').onclick = function () {
    if (document.sortColumn === 4) {
      toggleSortDirection();
    } else {
      document.sortColumn = 4;
      document.sortDirection = 'asc';
    }
    showData();
  }

  document.getElementById('th-fine').onclick = function () {
    if (document.sortColumn === 5) {
      toggleSortDirection();
    } else {
      document.sortColumn = 5;
      document.sortDirection = 'asc';
    }
    showData();
  }

  document.getElementById('country').onchange = function (event) {
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
