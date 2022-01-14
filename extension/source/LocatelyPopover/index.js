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

  const abrevCount = (value) => {
    var newValue = value;
    if (value >= 1000) {
      var suffixes = ["", "K", "M", "B", "T"];
      var suffixNum = Math.floor(("" + value).length / 4);
      var shortValue = "";
      for (var precision = 2; precision >= 1; precision--) {
        shortValue = parseFloat(
          (suffixNum != 0
            ? value / Math.pow(1000, suffixNum)
            : value
          ).toPrecision(precision)
        );
        var dotLessShortValue = (shortValue + "").replace(
          /[^a-zA-Z 0-9]+/g,
          ""
        );
        if (dotLessShortValue.length <= 2) {
          break;
        }
      }
      if (shortValue % 1 != 0) shortValue = shortValue.toFixed(1);
      newValue = shortValue + suffixes[suffixNum];
    }
    return newValue;
  };

  const getAttrValue = ({ name, valueType, renderer }) => {
    const attrs = locationDetails.features[0].attributes;
    switch (valueType) {
      case "COUNT":
        return abrevCount(attrs[name]);

      case "DECIMAL":
      case "INDEX":
        return attrs[name];

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
