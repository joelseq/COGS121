import React, { Component } from 'react';
import Select from 'react-select';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';

import 'react-select/dist/react-select.css';

import Spinner from './Spinner';
import './MainForm.scss';

// Import states data
import stateCodes from './states.json';

class MainForm extends Component {
  static propTypes = {
    history: ReactRouterPropTypes.history.isRequired,
  };

  state = {
    state: '',
    county: '',
    city: '',
    selectedState: '',
    selectedCounty: '',
    selectedCity: '',
    selectedStateCounties: [],
    selectedCountyCities: [],
    selectedCityZips: [],
    loading: false,
    error: false,
  };

  handleChange = (val, key) => {
    this.setState({
      [key]: val,
    });
  };

  handleSelect = key => {
    const { state, county, city } = this.state;

    this.setState({
      loading: true,
    });
    console.log(`Selected: ${this.state[key].value}`); // eslint-disable-line

    if (key === 'state') {
      // The API_URL will automatically be injected by webpack depending on development
      // or production mode
      // eslint-disable-next-line
      axios.get(`${API_URL}/api/subregion?state=${state.value}`).then(res => {
        this.setState({
          selectedState: true,
          selectedStateCounties: res.data.response.list.region,
          loading: false,
        });
      });
    } else if (key === 'county') {
      // eslint-disable-next-line
      axios.get(`${API_URL}/api/subregion?state=${state.value}&county=${county.value}`).then(res => {
        this.setState({
          selectedCounty: true,
          selectedCountyCities: res.data.response.list.region,
          loading: false,
        });
      });
    } else {
      // If reached this block, it means that the state, county, and city have all
      // been selected so redirect the user to the listings route which loads the
      // Listings component and fetches the zipcodes
      this.props.history.push(`/listings?state=${state.value}&county=${county.value}&city=${city.value}`);
    }
  };

  renderFormInput = () => {
    const {
      state,
      county,
      city,
      selectedState,
      selectedCounty,
      selectedStateCounties,
      selectedCountyCities,
    } = this.state;

    if (!selectedState) {
      return (
        <React.Fragment>
          <label htmlFor="state-input">Enter State: </label>
          <Select
            value={state}
            onChange={val => this.handleChange(val, 'state')}
            options={stateCodes.map(st => ({
              value: st.abbreviation,
              label: st.name,
            }))}
          />
          <button className="MainForm__form__button" onClick={() => this.handleSelect('state')}>
            Select
          </button>
        </React.Fragment>
      );
    } else if (!selectedCounty) {
      return (
        <React.Fragment>
          <label htmlFor="county-input">Enter County: </label>
          <Select
            value={county}
            onChange={val => this.handleChange(val, 'county')}
            options={selectedStateCounties.map(elem => ({
              value: elem.name[0],
              label: elem.name[0],
            }))}
          />
          <button className="MainForm__form__button" onClick={() => this.handleSelect('county')}>
            Select
          </button>
        </React.Fragment>
      );
    }
    return (
      <React.Fragment>
        <label htmlFor="city-input">Enter City: </label>
        <Select
          value={city}
          onChange={val => this.handleChange(val, 'city')}
          options={selectedCountyCities.map(elem => ({
            value: elem.name[0],
            label: elem.name[0],
          }))}
        />
        <button className="MainForm__form__button" onClick={() => this.handleSelect('city')}>
          Select
        </button>
      </React.Fragment>
    );
  };

  render() {
    const { loading, selectedState, selectedCounty, state, county } = this.state; // eslint-disable-line

    return (
      <div className="MainForm__container">
        <h1 className="MainForm__heading text-center">Welcome to BUROW</h1>
        <p className="text-center">Dig around and find the neighbourhood that fits your needs!</p>
        <div className="MainForm__form">
          {selectedState && <p className="MainForm__selected">Selected State: {state.value}</p>}
          {selectedCounty && <p className="MainForm__selected">Selected County: {county.value}</p>}
          {loading ? <Spinner /> : this.renderFormInput()}
        </div>
      </div>
    );
  }
}

export default withRouter(MainForm);
