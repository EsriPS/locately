// Framework and third-party non-ui
import React from "react";

const Map = ({ place, userSettings }) => {
  const xy = JSON.stringify(place.geometry);
  const city = place.features[0].attributes.AreaName;
  const state = place.features[0].attributes.MajorSubdivisionAbbr;
  const basemap = userSettings.basemap || 'arcgis-navigation';

  const url = `https://esrips.github.io/locately/map?coords=${xy}&city=${city}&state=${state}&basemap=${basemap}`;
  return <iframe src={url}></iframe>;
};

export default Map;
