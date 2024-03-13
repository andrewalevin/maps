

mapboxgl.accessToken = 'pk.eyJ1IjoiYW5kcmV3bGV2aW4iLCJhIjoiY2t5ZXM5c3cyMWJxYjJvcGJycmw0dGlyeSJ9.9QfCmimkyYicpprraBc-XQ';

const map = new mapboxgl.Map({
  container: 'map',
  center: [2.34, 48.85],
  zoom: 4,
  style: 'mapbox://styles/andrewlevin/cltnfvdbl002p01qw23u8d9tn',
});


map.addControl(
  new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl
  })
);



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


function paintCountry(countryCodeAlpha3List, color='#6495ED', opacity=0.4){
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
    const arrStart = ["in", "iso_3166_1_alpha_3"];

    const allOptions = arrStart.concat(countryCodeAlpha3List);

  map.setFilter(id_hash, allOptions);
}




map.on('load', function() {

  const taxedCountries = Object.keys(taxInheritance);
  console.log(taxedCountries);
  paintCountry(taxedCountries, '#ff1a71');


  const notDataCountries = allCountries.filter(item => !taxedCountries.includes(item));  
  console.log(notDataCountries);
  paintCountry(notDataCountries, '#40E8D0');


  /*
  paintCountry(['NLD'], '#d2361e');
  paintCountry(['GBR'], '#0000ff');
  paintCountry(['FRA'], '#d4ac0d');
  */





});



var option = document.createElement('option');
option.textContent = groups[index].label;
document.getElementById('ofg-select').appendChild(option);




