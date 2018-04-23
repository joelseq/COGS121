import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import App from './components/App';

import './styles/styles.scss';

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('app'),
  );
};

render(App);

if (module.hot) {
  module.hot.accept('./components/App', () => {
    render(App);
  });
}

// TO REMOVE... THE STUFF BELOW THIS LINE IS ONLY FOR BEFORE WE MOVE TO REACT

/* eslint-disable */
$('.slider').on('input change', function onChange(e) {
  const sliderValue = e.target.value;
  // Find the span for holding the slider value
  const valuesText = $(this)
    .parent()
    .parent()
    .find('.slider-value');

  valuesText.text(sliderValue);
});

function getInitialValues() {
  $('.slider-group').each(function addValues() {
    const sliderValue = $(this)
      .find('.slider')
      .val();
    $(this)
      .find('.slider-value')
      .text(sliderValue);
  });
}

$(document).ready(() => {
  getInitialValues();
});
/* eslint-enable */
