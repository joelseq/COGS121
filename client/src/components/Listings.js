import React, { Component } from 'react';
import { ButtonToolbar, DropdownButton, MenuItem } from 'react-bootstrap';

class Listings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locations: this.props.locations,
    };
  }

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

  applyPriceRangeHelper = a => {
    if (!a.zindex) {
      return false;
    }

    const aVal = parseInt(a.zindex[0]._, 10);

    return aVal > this.state.minPrice && aVal < this.state.maxPrice;
  };

  handleChange = event => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    console.log(name + ' ' + value + ' ' + target);
    this.setState({
      [name]: value,
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    this.setState({
      locations: this.props.locations.filter(this.applyPriceRangeHelper),
    });
  };

  sortAscending = () => {
    this.setState({
      locations: this.state.locations.sort(Listings.ascendingSortHelper),
    });
  };

  sortDescending = () => {
    this.setState({
      locations: this.state.locations.sort(Listings.descendingSortHelper),
    });
  };

  render() {
    const { locations } = this.state;

    return (
      <div className="panel-group">
        <div className="sort-listings">
          <ButtonToolbar>
            <DropdownButton bsStyle="default" title="Sort" id="dropdown-size-large">
              <MenuItem eventKey="1" onClick={this.sortAscending}>
                Ascending
              </MenuItem>
              <MenuItem eventKey="2" onClick={this.sortDescending}>
                Descending
              </MenuItem>
            </DropdownButton>
          </ButtonToolbar>

          <form onSubmit={this.handleSubmit}>
            <label>
              Min Price:
              <input name="minPrice" type="number" value={this.state.minPrice} onChange={this.handleChange} />
            </label>
            <label>
              Max Price:
              <input name="maxPrice" type="number" value={this.state.maxPrice} onChange={this.handleChange} />
            </label>
            <input type="submit" value="Apply" />
          </form>
        </div>
        <div className="listings-container">
          {locations.map(loc => (
            <div key={loc.name[0]} className="panel panel-default">
              <div className="panel-heading">
                <h3 className="panel-title">{loc.name[0]}</h3>
              </div>
              <div className="panel-body">
                <p>Price: {loc.zindex ? `$${loc.zindex[0]._}` : 'Unavailable'}</p>
                <p>Walkability: {loc.walkscore ? `${loc.walkscore}` : 'Unavailable'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Listings;
