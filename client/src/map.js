import mapboxgl from 'mapbox-gl/dist/mapbox-gl';

console.log('here');

mapboxgl.accessToken =
  'pk.eyJ1IjoiYW1hbmd1cHRhIiwiYSI6ImNqZzl2YnFyZzd1dmUycW1kb2RncmR1dHcifQ.6iKBun8VoyY2IUZDv7mZ9g';
const map = new mapboxgl.Map({
  container: 'mapDiv',
  style: 'mapbox://styles/mapbox/streets-v10',
});
