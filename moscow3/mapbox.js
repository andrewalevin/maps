



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
  
    new mapboxgl.Marker(el)
      .setLngLat(feature.geometry.coordinates)
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
  const scale = (Math.trunc(zoom, 2) - 5) * 10;
  console.log('zoom: ', scale, zoom);

  for (const elem of document.getElementsByClassName("marker")) {
    elem.style.width = `${scale}px`;
    elem.style.height = `${scale}px`;
  }

});

