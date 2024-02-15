import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

function ImageWithJWT({ imageUrl }) {
  const [imageString, setImageString] = useState("");
  const token = localStorage.getItem("userToken");
  const dummyImage = "https://dummyimage.com/600x400/eeeeee/eeeeee";

  useEffect(() => {
    const getBase64Image = async (res) => {
      const blob = await res.blob();
      const reader = new FileReader();

      await new Promise((resolve, reject) => {
        reader.onload = resolve;
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
      return reader.result;
    };

    fetch(imageUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(getBase64Image)
      .then((imgString) => setImageString(imgString))
      .catch((err) => console.error("Error fetching image:", err));
  }, [imageUrl]);

  return (
    <img
      src={imageString.startsWith("data:text") ? dummyImage : imageString}
      alt=""
    />
  );
}
ImageWithJWT.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  // token: PropTypes.string.isRequired,
};
export default ImageWithJWT;
