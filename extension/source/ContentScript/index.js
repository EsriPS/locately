import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

import LocatelyPopover from "../LocatelyPopover";

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
      const locatelyFips = event.target.attributes.getNamedItem("data-locately-fips")?.value;
      if (locatelyFips) {
        // Set the reference element to position popper
        setReferenceElement(event.target);

        // Get location details and call setLocationDetails
        getDetailsForLocation(locatelyFips);
      } else {
        setReferenceElement(null);
      }
    });
  }, [setReferenceElement]);

  // Detect dom changes so we can search the text
  useEffect(() => {
    // const domain = window.location.hostname;
    // const el = document.querySelector(searchableElements[domain][0]);
    getLocationsFromElements(document.body);
    // const observer = new MutationObserver((mutations) => {
    //   mutations.forEach(({ addedNodes }) => {
    //     if (addedNodes?.length > 0) {
    //       // Send nodes to be searched
    //       console.log("do it again", addedNodes)
    //       getLocationsFromElements(document.body);
    //     }
    //   });
    // });

    // observer.observe(document.body, {
    //   childList: true,
    //   subtree: true,
    // });
  }, []);

  // Send nodes to be searched
  const getLocationsFromElements = async (contentRoot) => {
    // Make request to get locations
    const locations = [
      {
        text: "U.S.",
        fips: "stuff"
      },
      {
        text: "codylawson",
        fips: "08013",
      },
      {
        text: "Cody Lawson",
        fips: "08015",
      },
    ];

    // Transform those locations?
    locations.forEach((location) => {
      // Create regex for location
      const locationRegex = new RegExp(`${location.text}`, "g");
      transformDomWithLocations(contentRoot, locationRegex, location);
    });
  };

  // Send locations to get geo-enriched
  const getDetailsForLocation = async (fips) => {
    // Do the stuff
  };

  // Update dom with data attributes
  const transformDomWithLocations = (contentRoot, locationRegex, location) => {
    // Do the stuff
    const document = contentRoot.ownerDocument;

    let nodes = [],
      text = "",
      node,
      nodeIterator = document.createNodeIterator(
        contentRoot,
        NodeFilter.SHOW_TEXT,
        null,
        false
      );

    while ((node = nodeIterator.nextNode())) {
      nodes.push({
        textNode: node,
        start: text.length,
      });
      text += node.nodeValue;
    }

    if (!nodes.length) return;

    let match;
    while ((match = locationRegex.exec(text))) {
      const matchLength = match[0].length;

      // Prevent empty matches causing infinite loops
      if (!matchLength) {
        locationRegex.lastIndex++;
        continue;
      }

      for (let i = 0; i < nodes.length; ++i) {
        node = nodes[i];
        const nodeLength = node.textNode.nodeValue.length;

        // Skip nodes before the match
        if (node.start + nodeLength <= match.index) continue;

        // Break after the match
        if (node.start >= match.index + matchLength) break;

        // Split the start node if required
        if (node.start < match.index) {
          nodes.splice(i + 1, 0, {
            textNode: node.textNode.splitText(match.index - node.start),
            start: match.index,
          });
          continue;
        }

        // Split the end node if required
        if (node.start + nodeLength > match.index + matchLength) {
          nodes.splice(i + 1, 0, {
            textNode: node.textNode.splitText(
              match.index + matchLength - node.start
            ),
            start: match.index + matchLength,
          });
        }

        // Highlight the current node
        const spanNode = document.createElement("span");
        spanNode.setAttribute("data-locately-fips", location.fips);

        node.textNode.parentNode.replaceChild(spanNode, node.textNode);
        spanNode.appendChild(node.textNode);
      }
    }
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
