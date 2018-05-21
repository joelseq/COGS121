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
    const { locations } = this.props;

    return (
      <div id="listing-container" className="panel-group">
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
        </div>
        {locations.map(loc => (
          <div className="panel panel-default">
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
    );
  }
}

export default Listings;
