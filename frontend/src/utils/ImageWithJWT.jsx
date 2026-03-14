import React from "react";
import PropTypes from "prop-types";

const dummyImage = "https://dummyimage.com/600x400/eeeeee/eeeeee";

function ImageWithJWT({ imageUrl, className, alt }) {
  return (
    <img
      src={imageUrl || dummyImage}
      className={className}
      alt={alt || ""}
      onError={(e) => { e.currentTarget.src = dummyImage; }}
    />
  );
}

ImageWithJWT.propTypes = {
  imageUrl: PropTypes.string,
  className: PropTypes.string,
  alt: PropTypes.string,
};

ImageWithJWT.defaultProps = {
  imageUrl: "",
  className: "",
  alt: "",
};

export default ImageWithJWT;
