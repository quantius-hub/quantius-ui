import React from "react";

const Divider = ({ orientation = "horizontal", style, ...rest }) => {
  const isVertical = orientation === "vertical";

  const baseStyle = isVertical
    ? {
        width: "1px",
        height: "100%",
        border: "none",
        borderLeft: "1px solid #ccc",
        margin: "0 8px",
      }
    : {
        width: "100%",
        border: "none",
        borderTop: "1px solid #ccc",
        margin: "8px 0",
      };

  // Use <div> for vertical so height works in flex layouts
  const Component = isVertical ? "div" : "hr";

  return <Component style={{ ...baseStyle, ...style }} {...rest} />;
};

export default Divider;