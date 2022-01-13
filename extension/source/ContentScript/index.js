import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

import LocatelyPopover from "../LocatelyPopover";

console.log("helloworld from content script");

const mockLocation = {
  attributes: {
    ID: "0",
    OBJECTID_0: 1,
    StdGeographyLevel: "US.Places",
    StdGeographyName: "Boston city",
    StdGeographyID: "2507000",
    sourceCountry: "US",
    AreaName: "Boston city",
    DataLayerID: "US.Places",
    MajorSubdivisionType: "State",
    Score: 100,
    ObjectId: 1,
    MajorSubdivisionAbbr: "MA",
    MajorSubdivisionName: "Massachusetts",
    AreaID: "2507000",
    CountryAbbr: "US",
    DatasetID: "USA_ESRI_2021",
    aggregationMethod: "Query:US.Places",
    populationToPolygonSizeRating: 2.191,
    apportionmentConfidence: 2.576,
    HasData: 1,
    TOTPOP: 692769,
    TOTHH: 282307,
    AVGHHSZ: 2.28,
    TOTMALES: 333836,
    TOTFEMALES: 358933,
  },
};

const LocatelyApp = () => {
  const [locationDetails, setLocationDetails] = useState(mockLocation);

  const [referenceElement, setReferenceElement] = useState(null);

  useEffect(() => {
    document.body.addEventListener("click", function (event) {
      if (
        event.target.attributes.getNamedItem("itemprop")?.value ===
        "additionalName" || event.target.attributes.getNamedItem("itemprop")?.value ===
        "name"
      ) {
        setReferenceElement(event.target);
      } else {
        setReferenceElement(null);
      }
    });
  }, [setReferenceElement]);

  return (
    <LocatelyPopover
      referenceElement={referenceElement}
      locationDetails={locationDetails}
    />
  );
};

let locatelyContainer = document.createElement("div");
locatelyContainer.setAttribute("id", "locately-container");
document.body.appendChild(locatelyContainer);

ReactDOM.render(<LocatelyApp />, locatelyContainer);
