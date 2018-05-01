import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import MainForm from './MainForm';

// Import App styles
import './App.scss';

const App = () => (
  <div>
    <Router>
      <Switch>
        <Route exact path="/" component={MainForm} />
      </Switch>
    </Router>
  </div>
);

export default App;
