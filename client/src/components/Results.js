import React from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

import Spinner from './Spinner';
import MapElement from './MapElement';
import './Results.scss';
import Listings from './Listings';


class Results extends React.Component {
  // This contains the definitions of the types for the props
  // this component needs
  static propTypes = {
    location: PropTypes.shape({
      search: PropTypes.string,
    }),
  };

  static ascendingSortHelper(a, b) {
    // If a doesn't have zindex, put b before it
    if (!a.zindex) {
      return 1;
    }
    // If b doesn't have zindex, put a before it
    if (!b.zindex) {
      return -1;
    }
    const aVal = parseInt(a.zindex[0]._, 10);
    const bVal = parseInt(b.zindex[0]._, 10);
    return aVal - bVal;
  }

  static descendingSortHelper(a, b) {
    // If a doesn't have zindex, put b before it
    if (!a.zindex) {
      return 1;
    }
    // If b doesn't have zindex, put a before it
    if (!b.zindex) {
      return -1;
    }
    const aVal = parseInt(a.zindex[0]._, 10);
    const bVal = parseInt(b.zindex[0]._, 10);
    return bVal - aVal;
  }

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
      response: null,
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
              response: result,
              locations: result.response.list.region,
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

  sortAscending = () => {
    this.setState({
      locations: this.state.locations.sort(Results.ascendingSortHelper),
    });
  };

  sortDescending = () => {
    this.setState({
      locations: this.state.locations.sort(Results.descendingSortHelper),
    });
  };

  render() {
    const { error, isLoaded, response, locations } = this.state;
    const { location } = this.props;
    const { state, city } = queryString.parse(location.search);
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <Spinner />;
    }
    const { latitude, longitude } = response.response.region;
    const mapCenter = [parseFloat(latitude[0]), parseFloat(longitude[0])];

    return (
      <div className="container">
        <h1>Listings</h1>
        <Link to="/">
          <Button bsStyle="primary">Home</Button>
        </Link>
        <h2>
          Results for {city}, {state}
        </h2>
        <div className="row">
          <div className="col-md-6">
            <MapElement center={mapCenter} data={response.boundaries} />
          </div>
          <div className="col-md-6">
            <Listings locations={locations}/>
          </div>
        </div>
      </div>
    );
  }
}

export default Results;
