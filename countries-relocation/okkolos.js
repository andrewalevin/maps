//- The following function was copied directly from repository katiejolly-ookla/ofg-mapbox/mobile/ofg-mapbox.js
// isolate all this code in a self-invoking function
(function() {
  var q = 4; // 1, 2, 3, 4
  var year = 2023;
  var offset = 6; // difference between layer index and zoom
  var indexMin = 1; // you typically do not need to edit either the min or max
  var indexMax = 10;
  // do not edit below here
  var start = year + String(((q - 1) * 3) + 1).padStart(2, '0') + '01';
  var end;
  if (q != 4) end = year + String(((q - 1) * 3) + 4).padStart(2, '0') + '01';
  // it will adjust for q4 (first of the next year instead of adding months)
  else end = (year + 1) + '01' + '01';
  var fixed_layers = [];
  var mobile_layers = [];
  for (var i = indexMin; i <= indexMax; i++) {
    fixed_layers.push('fixed_zoom_' + 'q' + q + year + '_' + i);
    mobile_layers.push('mobile_zoom_' + 'q' + q + year + '_' + i);
  }
  // keep track of which layers are in which group, the UI label, and the legend header for that group
  var groups = [{
    id: 'q' + q + '-' + year + '-f',
    type: 'fixed',
    label: 'Q' + q + ' ' + year + ', Fixed',
    legend: 'Fixed Networks, ' + 'Q' + q + ' ' + year,
    layers: fixed_layers,
  }, {
    id: 'q' + q + '-' + year + '-m',
    type: 'mobile',
    label: 'Q' + q + ' ' + year + ', Mobile',
    legend: 'Mobile Networks, ' + 'Q' + q + ' ' + year,
    layers: mobile_layers,
  }];
  // fixed and mobile colors, legend labels, and thresholds
  var legends = {
    mobile: [{
      color: '#27173a',
      label: 'Greater than 100 Mbps',
      threshold: 100000,
    }, {
      color: '#503270',
      label: '50 to 100 Mbps',
      threshold: 50000,
    }, {
      color: '#7b549d',
      label: '20 to 50 Mbps',
      threshold: 20000,
    }, {
      color: '#a47cbf',
      label: '5 to 20 Mbps',
      threshold: 5000,
    }, {
      color: '#caaad7',
      label: 'Less than 5 Mbps',
      threshold: 0,
    }],
    fixed: [{
      color: '#062532',
      label: 'Greater than 250 Mbps',
      threshold: 250000,
    }, {
      color: '#14495f',
      label: '100 to 250 Mbps',
      threshold: 100000,
    }, {
      color: '#307188',
      label: '25 to 100 Mbps',
      threshold: 25000,
    }, {
      color: '#619aa9',
      label: '10 to 25 Mbps',
      threshold: 10000,
    }, {
      color: '#9fc2c5',
      label: 'Less than 10 Mbps',
      threshold: 0,
    }]
  };
  mapboxgl.accessToken = 'pk.eyJ1Ijoib29rbGEtb2ZnIiwiYSI6ImNrY25remY2aDBic3kycWxiM2w4aHltcmwifQ.ayGK9ETg8mEeor85CwBt2A';
  var map = new mapboxgl.Map({
    container: 'ofg-map',
    // light
    style: 'mapbox://styles/ookla-ofg/ckmwcqh2q1d9o17p8cynr5vn9/draft',
    // dark
    //      style: 'mapbox://styles/ookla-ofg/cknnzq04d01ei17s8hd18f156/draft',
    center: [-98, 38.88],
    minZoom: 1,
    maxZoom: 12,
    zoom: 1
  });
  // Add the control to the map.
  map.addControl(new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl
  }));
  map.on('load', function() {
    /** Add a custom vector tileset source. The tileset used in
     * this example contains a feature for every state and
     * county in the U.S.
     * Each tile contains five properties. For example:
     *     {
     *         avg_d_kbps: 25000,
     *         avg_u_kbps: 3000,
     *         avg_lat_ms: 100,
     *         devices: 1000,
     *         tests: 5000
     *     }
     */
    map.addSource('fixed_tiles_' + 'q' + q + year, {
      'type': 'vector',
      'url': 'mapbox://ookla-ofg.fixed_' + start + '_' + end
    });
    map.addSource('mobile_tiles_' + 'q' + q + year, {
      'type': 'vector',
      'url': 'mapbox://ookla-ofg.mobile_' + start + '_' + end
    });
    var purples = {
      'fill-color': ['step', // arg 1
        ['get', 'avg_d_kbps'], // arg 2
        legends.mobile[4].color, // arg 3
        // rest of the expression is arg 4
        legends.mobile[3].threshold, legends.mobile[3].color,
        legends.mobile[2].threshold, legends.mobile[2].color,
        legends.mobile[1].threshold, legends.mobile[1].color,
        legends.mobile[0].threshold, legends.mobile[0].color
      ],
      'fill-opacity': 0.75
    };
    var blues = {
      'fill-color': ['step', // arg 1
        ['get', 'avg_d_kbps'], // arg 2
        legends.fixed[4].color, // arg 3
        // rest of the expression is arg 4
        legends.fixed[3].threshold, legends.fixed[3].color,
        legends.fixed[2].threshold, legends.fixed[2].color,
        legends.fixed[1].threshold, legends.fixed[1].color,
        legends.fixed[0].threshold, legends.fixed[0].color
      ],
      'fill-opacity': 0.85
    };
    //- Fixed and mobile layers for all zoom levels
    for (var i = indexMin; i <= indexMax; i++) {
      map.addLayer({
        'id': 'fixed_zoom_' + 'q' + q + year + '_' + i,
        'source': 'fixed_tiles_' + 'q' + q + year,
        'source-layer': 'fixed_' + start + '_' + end + '_z' + (i + offset),
        'type': 'fill',
        'layout': {
          'visibility': 'none'
        },
        'paint': blues
      }, 'waterway-label');
      map.addLayer({
        'id': 'mobile_zoom_' + 'q' + q + year + '_' + i,
        'source': 'mobile_tiles_' + 'q' + q + year,
        'source-layer': 'mobile_' + start + '_' + end + '_z' + (i + offset),
        'type': 'fill',
        'layout': {
          'visibility': 'none'
        },
        'paint': purples
      }, 'waterway-label');
    }
    // turn on the layer we want (by groups index)
    handleLayerChange(0);
  });
  // listen for select change
  document.addEventListener('input', function(event) {
    if (event.target.id !== 'ofg-select') return;
    handleLayerChange(event.target.value);
    return false;
  }, false);
  // create select option and legend for each layer group
  for (var i = 0; i < groups.length; i++) {
    createGroupOption(i);
    createGroupLegend(i);
  }
  // cache these elements for hover display
  var overlay = document.getElementById('ofg-overlay');
  var overlayDefault = document.getElementById('ofg-overlay-default');
  // change info window on hover
  map.on('click', function(e) {
    showOverlay(false);
    var tiles = map.queryRenderedFeatures(e.point);
    // bail if there's no tiles here
    if (!tiles.length) return;
    for (var i = 0; i < tiles.length; i++) {
      // make sure we are on a data layer and have all the values we need
      if (!tiles[i].properties) continue;
      if (!tiles[i].properties.avg_d_kbps) continue;
      if (!tiles[i].properties.avg_u_kbps) continue;
      if (!tiles[i].properties.avg_lat_ms) continue;
      if (!tiles[i].properties.avg_download_latency_ms) continue;
      if (!tiles[i].properties.avg_upload_latency_ms) continue;
      if (!tiles[i].properties.tests) continue;
      if (!tiles[i].properties.devices) continue;
      showOverlay(true);
      var html = ' < table class = "ofg-table " > ';
      html += makeTableRow('Download', kbps2Mbps(tiles[i].properties.avg_d_kbps), 'Mbps');
      html += makeTableRow('Upload', kbps2Mbps(tiles[i].properties.avg_u_kbps), 'Mbps');
      html += makeTableRow('Latency', tiles[i].properties.avg_lat_ms.toLocaleString(), 'ms');
      html += makeTableRow('Download Loaded Latency', tiles[i].properties.avg_download_latency_ms.toLocaleString(), 'ms');
      html += makeTableRow('Upload Loaded Latency', tiles[i].properties.avg_upload_latency_ms.toLocaleString(), 'ms');
      html += makeTableRow('Tests', tiles[i].properties.tests.toLocaleString());
      html += makeTableRow('Devices', tiles[i].properties.devices.toLocaleString());
      html += '</table>';
      overlay.innerHTML = html;
    }
  });
  // populates the select for switching layers
  function createGroupOption(index) {
    var option = document.createElement('option');
    option.value = index;
    option.textContent = groups[index].label;
    document.getElementById('ofg-select').appendChild(option);
  }
  // create the legend for each map group
  function createGroupLegend(index) {
    var type = groups[index].type;
    var groupsEl = document.getElementById('ofg-legend-groups');
    var group = '';
    group += ' < div class = "ofg-legend-group "
    data - group - id = " ' + groups[index].id + ' " > ';
    group += ' < h3 > ' + groups[index].legend + ' < /h3>';
    for (var i = 0; i < legends[type].length; i++) {
      var color = legends[type][i].color;
      var label = legends[type][i].label;
      group += ' < div class = "ofg-legend-item " > ';
      group += ' < span class = "ofg-legend-color "
      style = "background-color: ' + color + ' " > < /span>';
      group += label + ' < /div>';
    }
    group += ' < /div>';
    var groupEl = document.createElement('div');
    groupEl.innerHTML = group;
    groupsEl.appendChild(groupEl.firstChild);
  }
  // layer toggle click handler
  // argument may be event or index (to simulate a click), either works
  function handleLayerChange(index) {
    toggleLayer(index);
    toggleLegend(index);
    checkSelect(index);
  }
  // turn on the layer we want, turn off the layers we don't want
  function toggleLayer(index) {
    // turn off all layers
    for (var g = 0; g < groups.length; g++) {
      for (var l = 0; l < groups[g].layers.length; l++) {
        map.setLayoutProperty(groups[g].layers[l], 'visibility', 'none');
      }
    }
    // turn on layers for the label that was selected
    for (var l = 0; l < groups[index].layers.length; l++) {
      map.setLayoutProperty(groups[index].layers[l], 'visibility', 'visible');
    }
  }
  // switch to the correct legend
  function toggleLegend(index) {
    // turn off active style from all labels
    var legendGroups = document.querySelectorAll('.ofg-legend-group');
    legendGroups.forEach(function(toggle) {
      toggle.style.display = 'none';
    });
    var legendGroup = document.querySelector('[data-group-id=" ' + groups[index].id + ' "]');
    legendGroup.style.display = 'block';
  }
  // make sure the select is on the correct dataset, when the data is selected programatically
  function checkSelect(index) {
    var select = document.getElementById('ofg-select');
    if (select.selectedIndex !== index) {
      select.selectedIndex = index;
    }
  }
  // convert kbps to mbps
  function kbps2Mbps(k) {
    return (k / 1000).toLocaleString(undefined, {
      maximumFractionDigits: 2
    })
  }
  // show (or hide) the data panel
  function showOverlay(condition) {
    if (condition) {
      overlayDefault.style.display = 'none';
      overlay.style.display = 'block';
    } else {
      overlayDefault.style.display = 'block';
      overlay.style.display = 'none';
    }
  }

  function makeTableRow(header, value, unit) {
    var row = '';
    row += ' < tr > < th > ' + header + ' < /th>';
    row += ' < td class = "ofg-data " > < strong > ' + value + ' < /strong> < /td>';
    row += ' < td > ' + ((unit) ? ('
        ' + unit) : '
        ') + ' < /td> < /tr > ';
        return row;
      }
    }()); // end self-invoking function