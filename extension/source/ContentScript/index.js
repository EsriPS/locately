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

  // Set up the locately popover events
  useEffect(() => {
    document.body.addEventListener("click", function (event) {
      if (
        event.target.attributes.getNamedItem("itemprop")?.value ===
          "additionalName" ||
        event.target.attributes.getNamedItem("itemprop")?.value === "name"
      ) {
        // Set the reference element to position popper
        setReferenceElement(event.target);

        // Get location details and call setLocationDetails
        getDetailsForLocation(event.target.attributes.getNamedItem("fips"));
      } else {
        setReferenceElement(null);
      }
    });
  }, [setReferenceElement]);

  // Detect dom changes so we can search the text
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(({ addedNodes }) => {
        if (addedNodes?.length > 0) {
          // Send nodes to be searched
          getLocationsFromNodes(addedNodes);
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }, []);

  // Send nodes to be searched
  const getLocationsFromNodes = async (nodes) => {
    // Do the stuff
  };

  // Send locations to get geo-enriched
  const getDetailsForLocation = async (fips) => {
    // Do the stuff
  };

  // Update dom with data attributes
  const transformDomWithLocations = (discoveredLocations) => {
    // Do the stuff
  };

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
