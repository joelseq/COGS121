/*
 * Name: Map.js
 * Description: React file holding the html and js for the map on the results page. Map is 
 *   rendered through MapBox
 */

import React from 'react';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

mapboxgl.accessToken =
  'pk.eyJ1IjoiYW1hbmd1cHRhIiwiYSI6ImNqZzl2YnFyZzd1dmUycW1kb2RncmR1dHcifQ.6iKBun8VoyY2IUZDv7mZ9g';

class Map extends React.Component {
  state = {
    lng: 5,
    lat: 34,
    zoom: 1.5,
  };

  componentDidMount() {
    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/streets-v9',
      center: [-122.43, 37.77],
      zoom: 12.5,
    });

    map.on('mousemove', e => {
      const { lng, lat } = e.lngLat;

      this.setState({
        lng: lng.toFixed(4),
        lat: lat.toFixed(4),
        zoom: map.getZoom().toFixed(2),
      });
    });
  }

  render() {
    const { lng, lat, zoom } = this.state;

    return (
      <div>
        <Link to="/">
          <Button bsStyle="primary">Home</Button>
        </Link>
        <Link to="/results">
          <Button bsStyle="primary">List View</Button>
        </Link>
        <div className="inline-block absolute top left mt12 ml12 bg-darken75 color-white z1 py6 px12 round-full txt-s txt-bold">
          <div>{`Longitude: ${lng} Latitude: ${lat} Zoom: ${zoom}`}</div>
        </div>
        <div
          ref={el => {
            this.mapContainer = el;
          }}
          className="absolute top right left bottom"
          style={{ height: '700px', width: '1000px' }}
        />
      </div>
    );
  }
}

export default Map;
