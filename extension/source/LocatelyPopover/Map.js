// Framework and third-party non-ui
import React from "react";

const Map = ({ place }) => {
  const xy = JSON.stringify(place.geometry);
  const url = `https://esrips.github.io/locately/map?coords=${xy}`;

  return <iframe src={url}></iframe>;
};

export default Map;
