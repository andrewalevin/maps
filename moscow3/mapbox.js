



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

function getRadius(zoom) {
  let radius = 8 * (zoom - 8);
  if (radius < 10)
      radius = 10;
  return radius.toFixed(0)
}


function mapProcess(data) {
  const radius = getRadius(map.getZoom());
  for (const item of data) {
    const elem = document.createElement('div');
    elem.className = 'marker';
    elem.style.width = `${radius}px`;
    elem.style.height = `${radius}px`;

    if (item.thumbnail)
      elem.setAttribute('style', `background-image: url(\'${imgs_url}${item.thumbnail}\'); background-size: cover;`);
  
    const coordinates = item.coordinates.split(', ').reverse();
    new mapboxgl.Marker(elem)
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
  const radius = getRadius(map.getZoom());

  for (const elem of document.getElementsByClassName("marker")) {
    elem.style.width = `${radius}px`;
    elem.style.height = `${radius}px`;
  }
});







