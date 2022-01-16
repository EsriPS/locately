import React, { useState, useEffect, useCallback } from "react";
import ReactDOM from "react-dom";

import LocatelyPopover from "../LocatelyPopover";
import { enrich, fetchPlaces, findStudyArea } from "./api";
import { searchWikipedia } from "./wikipediaApi";

import { debounce } from "./utils";

import * as dataCollections from "./dataCollections";
import defaultSettings from "../defaultSettings.json";

const LocatelyApp = () => {
  const [locationDetails, setLocationDetails] = useState(null);
  const [referenceElement, setReferenceElement] = useState(null);
  const [dataCollection, setDataCollection] = useState(
    dataCollections.Demographics
  );
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    // Get initial setting value
    chrome.storage.sync.get(defaultSettings, (results) => {
      setSettings(results);
      setDataCollection(dataCollections[results.dataCollection]);
    });

    // Detect settings changes and update
    chrome.storage.sync.onChanged.addListener(settingsOnChanged);

    return () => {
      chrome.storage.sync.onChanged.removeListener(settingsOnChanged);
    };
  }, [settingsOnChanged]);

  const settingsOnChanged = useCallback((e) => {
    {
      const updatedSettings = { ...settings };
      Object.entries(e).forEach(
        ([key, { newValue }]) => (updatedSettings[key] = newValue)
      );

      setSettings(updatedSettings);
      setDataCollection(dataCollections[updatedSettings.dataCollection]);

      setReferenceElement(null);
      setLocationDetails(null);
    }
  }, []);

  // Set up the locately popover events
  useEffect(() => {
    document.body.addEventListener("click", itemClicked);

    return () => {
      document.body.removeEventListener("click", itemClicked);
    };
  }, [itemClicked, dataCollection]);

  const itemClicked = useCallback(
    (event) => {
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
        setLocationDetails(null);
      }
    },
    [dataCollection, settings]
  );

  // Detect dom changes so we can search the text
  useEffect(() => {
    var observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        const filteredNodes = Array.from(mutation.addedNodes).filter(
          (addedNode) => {
            return !addedNode.parentNode?.attributes.getNamedItem(
              "data-locately-city"
            );
          }
        );
        if (filteredNodes && filteredNodes.length > 0) {
          debouncedDomUpdate();
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }, []);

  const debouncedDomUpdate = debounce(() => {
    // All the taxing stuff you do
    getLocationsFromElements(document.body);
  }, 500);

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
    const locations = await fetchPlaces(textArr);

    // Transform those locations?
    locations.forEach((location) => {
      // Create regex for location
      const locationRegex = new RegExp(`${location.text}`, "g");
      transformDomWithLocations(contentRoot, locationRegex, location);
    });
  };

  // Send locations to get geo-enriched
  const getDetailsForLocation = async ({ city, state }) => {
    const studyAreas = await findStudyArea({ city, state });
    const enrichedPlaces = await enrich(studyAreas, dataCollection);
    const wpInfo = await searchWikipedia(`${city}, ${state}`);
    setLocationDetails({ wpInfo, ...enrichedPlaces });
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
      // Prevent many nested spans
      if (
        !node.parentNode?.classList?.contains("searchmatch") &&
        !node.parentNode?.attributes?.getNamedItem("data-locately-city")
      ) {
        nodes.push({
          textNode: node,
          start: text.length,
        });
        text += node.nodeValue;
      }
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
      dataCollection={dataCollection}
      userSettings={settings}
    />
  );
};

let locatelyContainer = document.createElement("div");
locatelyContainer.setAttribute("id", "locately-container");
document.body.appendChild(locatelyContainer);

ReactDOM.render(<LocatelyApp />, locatelyContainer);
