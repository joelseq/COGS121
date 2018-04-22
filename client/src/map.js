import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import App from './components/App';

import './styles/styles.scss';

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('app'),
  );
};

render(App);

if (module.hot) {
  module.hot.accept('./components/App', () => {
    render(App);
  });
}

var mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');

console.log("here")

mapboxgl.accessToken = 'pk.eyJ1IjoiYW1hbmd1cHRhIiwiYSI6ImNqZzl2YnFyZzd1dmUycW1kb2RncmR1dHcifQ.6iKBun8VoyY2IUZDv7mZ9g';
var map = new mapboxgl.Map({
container: 'mapDiv',
style: 'mapbox://styles/mapbox/streets-v10'
});
