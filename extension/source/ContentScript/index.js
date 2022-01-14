import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

import LocatelyPopover from "../LocatelyPopover";

import mockLocation from "./mockLocation.json";

const LocatelyApp = () => {
  const [locationDetails, setLocationDetails] = useState(null);
  const [referenceElement, setReferenceElement] = useState(null);
  const [settings, setSettings] = useState(null);

  // Get the user's settings
  // chrome.storage.sync.get({
  //   favoriteColor: 'red',
  //   likesColor: true
  // }, function(items) {
  //   document.getElementById('color').value = items.favoriteColor;
  //   document.getElementById('like').checked = items.likesColor;
  // });

  // Set up the locately popover events
  useEffect(() => {
    document.body.addEventListener("click", function (event) {
      const city =
        event.target.attributes.getNamedItem("data-locately-city")?.value;
      const state = event.target.attributes.getNamedItem(
        "data-locately-state"
      )?.value;
      if (city && state) {
        // Set the reference element to position popper
        setReferenceElement(event.target);

        // Get location details and call setLocationDetails
        getDetailsForLocation({ city, state });
      } else {
        setReferenceElement(null);
      }
    });
  }, [setReferenceElement]);

  // Detect dom changes so we can search the text
  useEffect(() => {
    getLocationsFromElements(document.body);
  }, []);

  // Send nodes to be searched
  const getLocationsFromElements = async (contentRoot) => {
    // Traverse contentRoot and get array of strings
    let textArr = [],
      node,
      nodeIterator = document.createNodeIterator(
        contentRoot,
        NodeFilter.SHOW_TEXT,
        null,
        false
      );
    while ((node = nodeIterator.nextNode())) {
      const trimmedValue = node.nodeValue.trim();
      if (trimmedValue) {
        textArr.push(trimmedValue);
      }
    }

    // Make request to get locations
    // const locations = await goGetThatShit(textArr);
    const locations = [
      {
        text: "U.S.",
        city: "stuff",
        state: "other stuff",
      },
      {
        text: "codylawson",
        city: "08013",
        state: "other stuff",
      },
      {
        text: "Cody Lawson",
        city: "08015",
        state: "other stuff",
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
  const getDetailsForLocation = async ({ city, state }) => {
    // Do the stuff
    console.log(city, state)
    setLocationDetails(mockLocation);
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
        spanNode.setAttribute("data-locately-city", location.city);
        spanNode.setAttribute("data-locately-state", location.state);

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
