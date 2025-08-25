import React from "react";

/**
 * Flexbox – a tiny wrapper for common flexbox layouts.
 */
const Flexbox = ({
  as: Component = "div",
  style,
  children,
  width = "100%",
  height, // <-- height attribute
  borderRadius, // <-- borderRadius attribute
  padding, // <-- new padding attribute
  display = "flex",
  flexDirection = "row",
  gap = "5px",
  center = "left",
  verticalCenter = "center",
  justify,
  align,
  wrap,
  backgroundColor,
  ...rest
}) => {
  // normalize "middle" to "center"
  const normalize = (val) =>
    val === "middle" ? "center" : val;

  center = normalize(center);
  verticalCenter = normalize(verticalCenter);

  const justifyMap = {
    left: "flex-start",
    center: "center",
    right: "flex-end",
    between: "space-between",
    around: "space-around",
    evenly: "space-evenly",
  };

  const alignMap = {
    top: "flex-start",
    center: "center",
    bottom: "flex-end",
    stretch: "stretch",
    baseline: "baseline",
  };

  const computed = {
    display,
    width,
    ...(height ? { height } : null),
    ...(borderRadius ? { borderRadius } : null),
    ...(padding ? { padding } : null), // <-- applied here
    flexDirection,
    gap,
    justifyContent: justify ?? justifyMap[center] ?? center,
    alignItems: align ?? alignMap[verticalCenter] ?? verticalCenter,
    ...(wrap ? { flexWrap: wrap } : null),
    ...(backgroundColor ? { backgroundColor } : null),
    ...style,
  };

  return (
    <Component style={computed} {...rest}>
      {children}
    </Component>
  );
};

export default Flexbox;