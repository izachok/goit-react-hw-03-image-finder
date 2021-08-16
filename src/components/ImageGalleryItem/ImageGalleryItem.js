import React from 'react';
import PropTypes from 'prop-types';

function ImageGalleryItem({ item, onClick }) {
  return (
    <li className="ImageGalleryItem" onClick={onClick}>
      <img
        src={item.webformatURL}
        alt={item.tags}
        className="ImageGalleryItem-image"
      />
    </li>
  );
}

ImageGalleryItem.propTypes = {
  item: PropTypes.shape({
    webformatURL: PropTypes.string.isRequired,
    tags: PropTypes.string,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};

export default ImageGalleryItem;
