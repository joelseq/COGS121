import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import MainForm from './MainForm';
import Listings from './Listings';
import Map from './Map';

// Import App styles
import './App.scss';

const App = () => (
  <div>
    <Router>
      <Switch>
        <Route exact path="/" component={MainForm} />
        <Route path="/listings" component={Listings} />
        <Route path="/map" component={Map} />
      </Switch>
    </Router>
  </div>
);

export default App;
