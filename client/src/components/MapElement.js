/*
 * Name: MapElement.js
 * Description: React file holding the html and js for the outline of each
 * neighborhood in the map.
 */

import React, { Component } from 'react';
import { Map, GeoJSON, TileLayer, Pane } from 'react-leaflet';

const ACCESS_TOKEN = 'pk.eyJ1IjoiYW1hbmd1cHRhIiwiYSI6ImNqZzl2YnFyZzd1dmUycW1kb2RncmR1dHcifQ.6iKBun8VoyY2IUZDv7mZ9g';

class MapElement extends Component {
  onEachFeature = (feature, layer) => {
    layer.on({
      mouseover: e => this.highlightFeature(e, feature),
      mouseout: this.resetHighlight,
    });
  };

  // Highlight region on hover
  highlightFeature = (e, feature) => {
    const layer = e.target;

    layer.setStyle({
      weight: 5,
      color: 'gold',
      dashArray: '',
      fillOpacity: 0.7,
    });

    layer.bringToFront();
    this.props.mapHighlight(feature.properties.RegionID);
  };

  resetHighlight = e => {
    this.geojson.resetStyle(e.target);
    this.props.resetMapHighlight();
  };

  // Render the map regions
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
            onEachFeature={this.onEachFeature}
          />
        </Pane>
      </Map>
    );
  }
}

export default MapElement;
