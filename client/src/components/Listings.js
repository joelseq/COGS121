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
    const { currentListing } = this.props;

    return (
      <div className="panel-group">
        <div className="mapFilter">
          <div className="mapFilter__inBarContainer">
            <div className="mapFilter__formContainer">
              <form onSubmit={this.handleSubmit}>
                <label>
                  Min Price:
                  <input
                    className="mapFilter__field"
                    name="minPrice"
                    type="number"
                    value={this.state.minPrice}
                    onChange={this.handleChange}
                  />
                </label>
                <label className="mapFilter__fieldLabel">
                  Max Price:
                  <input
                    className="mapFilter__field"
                    name="maxPrice"
                    type="number"
                    value={this.state.maxPrice}
                    onChange={this.handleChange}
                  />
                </label>
                <input className="mapFilter__applyButton" type="submit" value="Apply" />
              </form>
            </div>
          </div>
        </div>

        <div className="sidebarContainer">
          <div className="active__container">
            <div className="">
              {currentListing ? (
                <div className="active__cardContainer">
                  <div className="active__card panel panel-default">
                    <div className="active__cardHeading">
                      <h2 className="panel-title">{currentListing.name[0]}</h2>
                    </div>
                    <div className="panel-body">
                      <div className="active__cardInfo">
                        <h4>{currentListing.zindex ? `$${currentListing.zindex[0]._}` : `Unavailable`}</h4>
                        <h5>Price</h5>
                      </div>
                      <div className="active__cardInfo">
                        <h4>{currentListing.walkscore ? `${currentListing.walkscore}` : 'Unavailable'}</h4>
                        <h5>Walkability</h5>
                      </div>
                      <div className="active__cardInfo">
                        <h4>
                          {' '}
                          {currentListing.schoolscore ? `${currentListing.schoolscore}` : 'Unavailable'}
                        </h4>
                        <h5>School Rating</h5>
              
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="active__cardContainer">
                  <div className="active__card panel panel-default">
                    <div className="panel-body">
                      <p>Hover over a neighborhood on the map</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="listings__container">
            <div className="listings__filterButtonContainer">
              <ButtonToolbar>
                <DropdownButton
                  className="listings__filterButton"
                  bsStyle="default"
                  title="Sort By Price"
                  id="dropdown-size-large"
                >
                  <MenuItem eventKey="1" onClick={this.sortAscending}>
                    Lowest to Highest
                  </MenuItem>
                  <MenuItem eventKey="2" onClick={this.sortDescending}>
                    Highest to Lowest
                  </MenuItem>
                </DropdownButton>
              </ButtonToolbar>
            </div>

            <div className="listings__cardsContainer">
              {locations.map(loc => (
                <div key={loc.name[0]} className="listings__card panel panel-default">
                  <div className="listings__cardHeading">
                    <h2 className="panel-title">{loc.name[0]}</h2>
                  </div>
                  <div className="panel-body">
                  <div className="listings__cardInfo">
                    <h4>{loc.zindex ? `$${loc.zindex[0]._}` : 'Unavailable'}</h4>
                    <h5>Price</h5>
                  </div>
                  <div className="listings__cardInfo">
                    <h4>{loc.walkscore ? `${loc.walkscore}` : 'Unavailable'}</h4>
                    <h5>Walkability</h5>
                  </div>
                  <div className="listings__cardInfo">
                    <h4>{loc.schoolscore ? `${loc.schoolscore}` : 'Unavailable'}</h4>
                    <h5>School Rating</h5>
                  </div>
                  </div>
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
