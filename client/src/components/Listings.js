import React from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

import Spinner from './Spinner';
import MapElement from './MapElement';
import './Listings.scss';

class Listings extends React.Component {
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
            this.setState({
              isLoaded: true,
              locations: result,
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

  render() {
    const { error, isLoaded, locations } = this.state;
    const { location } = this.props;
    const { state, city } = queryString.parse(location.search);
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <Spinner />;
    }
    const { latitude, longitude } = locations.response.region;
    const mapCenter = [parseFloat(latitude[0]), parseFloat(longitude[0])];
    console.log(mapCenter);

    return (
      <div className="container">
        <h1>List View</h1>
        <Link to="/">
          <Button bsStyle="primary">Home</Button>
        </Link>
        <Link to="/map">
          <Button bsStyle="primary">Map View</Button>
        </Link>
        <h2>
          Results for {city}, {state}
        </h2>
        <div className="row">
          <div className="col-md-6">
            <MapElement center={mapCenter} data={locations.boundaries} />
          </div>
          <div className="col-md-6">
            <div id="listing-container" className="panel-group">
              {locations.response.list.region.map(loc => (
                <div className="panel panel-default">
                  <div className="panel-heading">
                    <h3 className="panel-title">{loc.name[0]}</h3>
                  </div>
                  <div className="panel-body">Price: {loc.zindex ? `$${loc.zindex[0]._}` : 'Unavailable'}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Listings;
