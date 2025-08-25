// Frame.jsx
import React from "react";

const Frame = (props) => {
  const {
    style,
    className,
    children,
    maxWidth,
    width,
    maxHeight,
    height,
    border,
    borderRadius,
    padding,
    background,
    backgroundColor,
    backgroundBlendMode,
    aspectRatio,
    center,
    ...rest
  } = props;

  const noPadding = rest["no-padding"];
  const borderBox = rest["border-box"];

  // Flexbox alignment based on `center` prop
  const flexStyles = {};
  if (center) {
    flexStyles.display = "flex";
    if (center === "left") {
      flexStyles.justifyContent = "flex-start";
      flexStyles.alignItems = "center";
    } else if (center === "right") {
      flexStyles.justifyContent = "flex-end";
      flexStyles.alignItems = "center";
    } else if (center === "center" || center === "middle") {
      flexStyles.justifyContent = "center";
      flexStyles.alignItems = "center";
    }
  }

  // ✅ Padding strategy:
  // - If `no-padding`, force 0.
  // - If `padding` prop provided, use it.
  // - Otherwise use a CSS variable with a fallback (20px).
  //   This lets external CSS (like your media query) override it by setting --frame-padding.
  const paddingStyle = noPadding
    ? 0
    : padding !== undefined
    ? padding
    : "var(--frame-padding, 20px)";

  return (
    <div
      className={className}
      style={{
        padding: paddingStyle,
        ...(maxWidth ? { maxWidth } : null),
        ...(width ? { width } : null),
        ...(maxHeight ? { maxHeight } : null),
        ...(height ? { height } : null),
        ...(border ? { border } : null),
        ...(borderRadius ? { borderRadius } : null),
        ...(background ? { background } : null),
        ...(backgroundColor ? { backgroundColor } : null),
        ...(backgroundBlendMode ? { backgroundBlendMode } : null),
        ...(aspectRatio ? { aspectRatio } : null),
        ...(borderBox ? { boxSizing: "border-box" } : null),
        ...flexStyles,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default Frame;
