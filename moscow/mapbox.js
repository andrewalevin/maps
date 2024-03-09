


mapboxgl.accessToken = 'pk.eyJ1IjoiYW5kcmV3bGV2aW4iLCJhIjoiY2t5ZXM5c3cyMWJxYjJvcGJycmw0dGlyeSJ9.9QfCmimkyYicpprraBc-XQ';

const map = new mapboxgl.Map({
    container: 'map',
    center: [37.61, 55.75],
    zoom: 11,
    style: 'mapbox://styles/andrewlevin/clthwxvvg002h01qo40y1e99g',
});



const geojson = {
  'type': 'FeatureCollection',
  'features': [
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [37.555, 55.728]
      },
      'properties': {
        'title': 'Дорогу утятам!',
        'description': 'Дорогу утятам! D'
      }
    },



    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [37.612, 55.742]
      },
      'properties': {
        'title': 'ГЭС-2',
        'description': 'ГЭС-2 - D'
      }
    },


    {
        'type': 'Feature',
        'geometry': {
          'type': 'Point',
          'coordinates': [37.607053, 55.763080]
        },
        'properties': {
          'title': 'Фаланстер',
          'description': 'Фаланстер - D'
        }
      },



  ]
};


const geojson2 = {
    'type': 'FeatureCollection',
    'features': [

  
      {
          'type': 'Feature',
          'geometry': {
            'type': 'Point',
            'coordinates': [37.607053, 55.763080]
          },
          'properties': {
            'title': 'Фаланстер',
            'description': 'Фаланстер - D'
          }
        },
        {
            'type': 'Feature',
            'geometry': {
              'type': 'Point',
              'coordinates': [37.624037, 55.735631]
            },
            'properties': {
              'title': 'Нитка',
              'description': 'Нитка - D'
            }
          },
  
  
  
    ]
  };



for (const feature of geojson.features) {
  const el = document.createElement('div');
  el.className = 'marker';

  new mapboxgl.Marker(el)
    .setLngLat(feature.geometry.coordinates)
    .setPopup(
      new mapboxgl.Popup({ offset: 25 })
        .setHTML(
          `<h3>${feature.properties.title}</h3>
          <p>${feature.properties.description}</p>`
        )
    )
    .addTo(map);
}






for (const feature of geojson2.features) {
    const el = document.createElement('div');
    el.className = 'marker';
  
    new mapboxgl.Marker()
      .setLngLat(feature.geometry.coordinates)
      .setPopup(
        new mapboxgl.Popup({ offset: 25 })
          .setHTML(
            `<h3>${feature.properties.title}</h3>
            <p>${feature.properties.description}</p>`
          )
      )
      .addTo(map);
    }







/*


55.728, 37.555


ГЭС-2


andrewlevin.clti0tq6p9ihb1mpk9yiczjbz-7ipdp


*/