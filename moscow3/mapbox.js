



mapboxgl.accessToken = 'pk.eyJ1IjoiYW5kcmV3bGV2aW4iLCJhIjoiY2t5ZXM5c3cyMWJxYjJvcGJycmw0dGlyeSJ9.9QfCmimkyYicpprraBc-XQ';

const map = new mapboxgl.Map({
  container: 'map',
  center: [37.61, 55.75],
  zoom: 11,
  style: 'mapbox://styles/andrewlevin/clthwxvvg002h01qo40y1e99g',
});


const url = 'https://andrewalevin.github.io/maps/moscow3/data.yaml';
fetch(url)
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
  for (const feature of data) {
    const el = document.createElement('div');
    el.className = 'marker';

    const coordinates = feature.coordinates.split(', ').reverse();

    console.log('coordinates: ', coordinates);

    new mapboxgl.Marker(el)
      .setLngLat(coordinates)
      .setPopup(
        new mapboxgl.Popup({
            offset: 25
        })
        .setHTML(
          `<h3>${feature.properties.title}</h3>
          <p>${feature.properties.description}</p>`
        )
      )
      .addTo(map);
  }
}



map.on('zoom', () => {
  const zoom = map.getZoom();

  const zoom_el = document.getElementById('zoom');
  zoom_el.innerHTML = `Zoom: ${zoom}`;

  const zoom_trunc = zoom.toFixed(2);


  const zoom_trunc_el = document.getElementById('zoom-trunc');
  zoom_trunc_el.innerHTML = `Trunc: ${zoom_trunc}`;

  let radius = ((zoom_trunc - 5) * 10).toFixed(0);

  radius = 100;

  const radius_el = document.getElementById('radius');
  radius_el.innerHTML = `Radius: ${radius}`;

  for (const elem of document.getElementsByClassName("marker")) {
    elem.style.width = `${100} px`;
    elem.style.height = `${100} px`;
  }

});







