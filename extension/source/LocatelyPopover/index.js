// Framework and third-party non-ui
import React, { useState, useEffect } from "react";

// Redux operations and local helpers/utils/modules
import { usePopper } from "react-popper";
import Map from "./Map";

import { abrevCount } from "../utils";

// Component specific modules (Component-styled, etc.)

// App components

// Third-party components (buttons, icons, etc.)

// JSON

// CSS
import "./styles.scss";

const LocatelyPopover = ({
  referenceElement,
  locationDetails,
  dataCollection,
  userSettings
}) => {
  const [popperElement, setPopperElement] = useState(null);
  const { styles, attributes, update } = usePopper(referenceElement, popperElement);

  // Fix position of popper when content loads
  useEffect(() => {
    if (referenceElement && locationDetails) {
      update();
    }
  }, [referenceElement, locationDetails])

  const renderHtml = (snippet) => {
    return { __html: snippet || "lorem ipsum..." };
  };

  const getAttrValue = ({ name, valueType, renderer }) => {
    const attrs = locationDetails.features[0].attributes;
    switch (valueType) {
      case "COUNT":
        return abrevCount(attrs[name]);

      case "DECIMAL":
      case "INDEX":
        return attrs[name];

      case "CURRENCY":
        return `$${attrs[name]}`;

      default:
        if (renderer) {
          return renderer(attrs);
        }
        return;
    }
  };

  return (
    <div
      className="locately-wrapper"
      ref={setPopperElement}
      style={{
        ...styles.popper,
        visibility: !referenceElement ? "hidden" : "visible",
      }}
      {...attributes.popper}
    >
      {locationDetails && referenceElement && (
        <>
          <div className="locately-visual-row">
            <div className="locately-map">
              <Map
                place={locationDetails}
                userSettings={userSettings}
              />
            </div>
            <a
              href={`https://www.google.com/search?q=${locationDetails.features[0].attributes.AreaName},%20${locationDetails.features[0].attributes.MajorSubdivisionAbbr}&tbm=isch`}
              target="_blank"
              className="locately-img"
            >
              <img src={locationDetails.wpInfo.imageUrl} />
            </a>
          </div>
          <div className="locately-description">
            <span
              dangerouslySetInnerHTML={renderHtml(
                locationDetails.wpInfo.snippet
              )}
            />
            <span>
              ...{" "}
              <span className="locately-attribution">
                —{" "}
                <a href={locationDetails.wpInfo.pageUrl} target="_blank">
                  Wikipedia
                </a>
              </span>
            </span>
          </div>
          <div className="locately-stats-row">
            {dataCollection.attributes.map((attrConfig) => {
              const value = getAttrValue(attrConfig);
              if (!value) return;
              return (
                <div className="locately-stat" key={attrConfig.name}>
                  <div className="locately-stat-label">{attrConfig.label}</div>
                  <div className="locately-stat-value">{value}</div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default LocatelyPopover;
