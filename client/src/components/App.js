/*
 * Name: App.js
 * Description: React file which renders the correct component based on the filepath.
 *  Gets each component of MainForm, Results, and Map so that they are loaded correctly
 *  within the page.
 */

import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import MainForm from './MainForm';
import Results from './Results';
import Map from './Map';


const App = () => (
  <div>
    <Router>
      <Switch>
        {/* Render React components */}
        <Route exact path="/" component={MainForm} />
        <Route path="/results" component={Results} />
        <Route path="/map" component={Map} />
      </Switch>
    </Router>
  </div>
);

export default App;
