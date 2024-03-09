



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

  
const imgs_url = 'https://andrewalevin.github.io/maps/moscow3/imgs/';

function mapProcess(data) {
  for (const item of data) {
    const el = document.createElement('div');
    el.className = 'marker';

    if (item.thumbnail){
      const thumbnail_url = `${imgs_url}${item.thumbnail}`;
      el.setAttribute('style', `background-image: url(\'${thumbnail_url}\'); background-size: cover;`);
    }
  
    const coordinates = item.coordinates.split(', ').reverse();
    new mapboxgl.Marker(el)
      .setLngLat(coordinates)
      .setPopup(
        new mapboxgl.Popup({
            offset: 25
        })
        .setHTML(
          `<h3>${item.title}</h3>
          <p>${item.description}</p>`
        )
      )
      .addTo(map);
  }
}




map.on('zoom', () => {
  const zoom = map.getZoom();

  const zoom_el = document.getElementById('zoom');
  zoom_el.innerHTML = `Zoom: ${zoom}`;

  const radius = getDiscribution(zoom).toFixed(0);
  console.log('Rad: ', radius );

  //let radius = (zoom_trunc* 10).toFixed(0);
  const radius_el = document.getElementById('radius');
  radius_el.innerHTML = `Radius: ${radius}`;

  for (const elem of document.getElementsByClassName("marker")) {
    elem.style.width = `${radius}px`;
    elem.style.height = `${radius}px`;
  }

});







