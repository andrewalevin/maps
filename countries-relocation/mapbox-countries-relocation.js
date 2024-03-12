

const URL_ROOT =  '';


mapboxgl.accessToken = 'pk.eyJ1IjoiYW5kcmV3bGV2aW4iLCJhIjoiY2t5ZXM5c3cyMWJxYjJvcGJycmw0dGlyeSJ9.9QfCmimkyYicpprraBc-XQ';

const map = new mapboxgl.Map({
  container: 'map',
  center: [2.34, 48.85],
  zoom: 4,
  style: 'mapbox://styles/andrewlevin/cltnfvdbl002p01qw23u8d9tn',
});


fetch(`${URL_ROOT}data.yaml`)
  .then((response) => {
    return response.text();
  })
  .then((text) => {
    return jsyaml.load(text);
  })
  .then((data) => {
    mapProcess(data);
  });


function mapProcess(data) {
  
  for (const rawitem of data) {
    console.log(rawitem);

  }
}





function genHexString(len=8){
  let output = '';
  for (let i = 0; i < len; ++i) {
      output += (Math.floor(Math.random() * 16)).toString(16);
  }
  return output;
}


function paintCountry(countryCodeAlpha3, color='#6495ED', opacity=0.4){
  const id_hash = genHexString();
  map.addLayer(
    {
      id: id_hash,
      source: {
        type: 'vector',
        url: 'mapbox://mapbox.country-boundaries-v1',
      },
      'source-layer': 'country_boundaries',
      type: 'fill',
      paint: {
        'fill-color': color,
        'fill-opacity': opacity,
      },
    },
    'country-label'
  );

  map.setFilter(id_hash, [
    "in",
    "iso_3166_1_alpha_3",
    countryCodeAlpha3,
  ]);
}




map.on('load', function() {

 paintCountry('NLD', '#d2361e');

 paintCountry('GBR', '#0000ff');

 paintCountry('FRA', '#d4ac0d');

 paintCountry('RUS', '#40E0D0');


});








/*
var geocoder = new MapboxGeocoder({
  accessToken: mapboxgl.accessToken,
  mapboxgl: mapboxgl,
  countries: 'all'
});

document.querySelector('.search-container').appendChild(geocoder.onAdd(map));

function searchCountry() {
  var query = document.getElementById('search').value;
  geocoder.query(query);
}

map.on('load', function () {
  map.addSource('countries', {
    'type': 'vector',
    'url': 'mapbox://mapbox.country-boundaries-v1'
  });

  map.addLayer({
    'id': 'countries-layer',
    'type': 'fill',
    'source': 'countries',
    'source-layer': 'country_boundaries',
    'paint': {
      'fill-color': 'rgba(200, 100, 240, 0.4)',
      'fill-outline-color': 'rgba(200, 100, 240, 1)'
    }
  });

  geocoder.on('result', function (e) {
    var country = e.result.text;
    map.setFilter('countries-layer', ['==', 'admin', country]);
  });
});

*/