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

const LocatelyPopover = ({ referenceElement, locationDetails }) => {
  const [popperElement, setPopperElement] = useState(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement);

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
      <div className="locately-content">Locately content</div>
    </div>
  );
};

export default LocatelyPopover;
