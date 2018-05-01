import React from 'react';
import FontAwesome from 'react-fontawesome';

const Spinner = () => (
  <div className="spinner-container">
    <FontAwesome name="circle-o-notch" size="3x" spin />
  </div>
);

export default Spinner;
