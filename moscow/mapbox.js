
mapboxgl.accessToken = 'pk.eyJ1IjoiYW5kcmV3bGV2aW4iLCJhIjoiY2t5ZXM5c3cyMWJxYjJvcGJycmw0dGlyeSJ9.9QfCmimkyYicpprraBc-XQ';

const map = new mapboxgl.Map({
  container: 'map',
  center: [37.61, 55.75],
  zoom: 11,
  style: 'mapbox://styles/andrewlevin/clthwxvvg002h01qo40y1e99g',
});


const url = 'data.yaml';
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
    const element = document.createElement('div');
    element.className = 'marker';
  
    new mapboxgl.Marker(element)
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



