import React from 'react';
import PropTypes from 'prop-types';

function Button(props) {
  return (
    <button type="button" onClick={props.onClick} className="Button">
      {props.children}
    </button>
  );
}

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default Button;
