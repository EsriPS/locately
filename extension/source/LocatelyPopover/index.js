// Framework and third-party non-ui
import React, { useState, useEffect } from "react";

// Redux operations and local helpers/utils/modules
import { usePopper } from "react-popper";

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
}) => {
  const [popperElement, setPopperElement] = useState(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement);

  const renderHtml = (snippet) => {
    return { __html: snippet || "lorem ipsum..." };
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
      {locationDetails && (
        <>
          <div className="locately-visual-row">
            <div className="locately-map">map</div>
            <div className="locately-img">
              <img
                height="100"
                width="100"
                src={locationDetails.wpInfo.imageUrl}
              />
            </div>
          </div>
          <div className="locately-description">
            <span
              dangerouslySetInnerHTML={renderHtml(
                locationDetails.wpInfo.snippet
              )}
            ></span>
            <span>
              ...{" "}
              <a href={locationDetails.wpInfo.pageUrl} target="_blank">
                [learn more]
              </a>
            </span>
          </div>
          <div className="locately-stats-row">
            {dataCollection.variables.map((variable) => {
              const name = variable.split(".")[1];
              const value = locationDetails.features[0].attributes[name];
              const label = locationDetails.fieldAliases[name];
              if (!value) return;
              return (
                <div className="locately-stat" key={name}>
                  <div className="locately-stat-label">{label}</div>
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
