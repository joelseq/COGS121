import React, { Component } from 'react';
import { Map, GeoJSON, TileLayer, Pane } from 'react-leaflet';

const ACCESS_TOKEN = 'pk.eyJ1IjoiYW1hbmd1cHRhIiwiYSI6ImNqZzl2YnFyZzd1dmUycW1kb2RncmR1dHcifQ.6iKBun8VoyY2IUZDv7mZ9g';

class MapElement extends Component {
  render() {
    const { center, data } = this.props;

    return (
      <Map className="map-element" center={center} zoom={10} scrollWheelZoom={false}>
        <Pane>
          <TileLayer
            url={`http://{s}.tile.openstreetmap.se/hydda/base/{z}/{x}/{y}.png?access_token=${ACCESS_TOKEN}`}
            id="mapbox.light"
          />
          <GeoJSON
            ref={elem => {
              this.geojson = elem && elem.leafletElement;
            }}
            data={data}
          />
        </Pane>
      </Map>
    );
  }
}

export default MapElement;
