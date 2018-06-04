import React from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

import Spinner from './Spinner';
import MapElement from './MapElement';
import './Results.scss';
import './Map.scss';
import './Listings.scss';
import Listings from './Listings';

class Results extends React.Component {
  // This contains the definitions of the types for the props
  // this component needs
  static propTypes = {
    location: PropTypes.shape({
      search: PropTypes.string,
    }),
  };

  // This contains default values for props this component needs
  static defaultProps = {
    location: {
      search: '',
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      locations: [],
      boundaries: null,
      minPrice: 0,
      maxPrice: 999999999,
      mapHighlightedNeighborhood: null,
    };
  }

  componentDidMount() {
    const { location } = this.props;
    const { state, county, city } = queryString.parse(location.search);

    if (state && county && city) {
      // The API_URL will automatically be injected by webpack depending on development
      // or production mode.
      // eslint-disable-next-line
      fetch(`${API_URL}/api/subregion?state=${state}&county=${county}&city=${city}`)
        .then(res => res.json())
        .then(
          result => {
            console.log(result);
            const {
              boundaries,
              response: { list, region },
            } = result;
            const { latitude, longitude } = region;

            this.setState({
              isLoaded: true,
              boundaries,
              locations: list.region,
              latitude,
              longitude,
            });
          },
          error => {
            this.setState({
              isLoaded: true,
              error,
            });
          },
        );
    }
  }

  mapHighlight = regionId => {
    const mapHighlightedNeighborhood = this.state.locations.find(e => e.id[0] === regionId);

    this.setState({
      mapHighlightedNeighborhood,
    });
  };

  resetMapHighlight = () => this.setState({ mapHighlightedNeighborhood: null });

  render() {
    const { error, isLoaded, boundaries, locations, latitude, longitude } = this.state;
    const { location } = this.props;
    const { state, city } = queryString.parse(location.search);
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <Spinner />;
    }
    const mapCenter = [parseFloat(latitude[0]), parseFloat(longitude[0])];

    return (
      <div className="container-fluid">
        
        <div className="headerContainer">
          <div className="titleContainer">
            <a href='/'><h1>burow</h1></a>
          </div>

          <div className="locationContainer">
            <h2>
              Neighbourhoods in {city}, {state}
            </h2>
          </div>
        </div>
       
        <div className="mapContainer">
            <MapElement
              center={mapCenter}
              data={boundaries}
              mapHighlight={this.mapHighlight}
              resetMapHighlight={this.resetMapHighlight}
            />
        </div>
      
        <Listings locations={locations} currentListing={this.state.mapHighlightedNeighborhood} />
      </div>
 
    );
  }
}

export default Results;
