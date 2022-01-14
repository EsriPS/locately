// Framework and third-party non-ui
import React from "react";

const Map = ({ place }) => {
  console.log({ place });
  const xy = JSON.stringify(place.geometry);
  const city = place.features[0].attributes.AreaName;
  const state = place.features[0].attributes.MajorSubdivisionAbbr;

  const url = `https://esrips.github.io/locately/map?coords=${xy}&city=${city}&state=${state}`;
  return <iframe src={url}></iframe>;
};

export default Map;
