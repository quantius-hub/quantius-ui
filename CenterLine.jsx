import React from "react";

const CenterLine = ({
  children,
  lineColor = "#ccc",
  lineThickness = "1px",
  gap = "40px",
  style,
  ...rest
}) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        flexWrap: "wrap", // Allow wrapping on smaller screens
        ...style,
      }}
      {...rest}
    >
      <div
        style={{
          flex: 1,
          minWidth: "20px", // prevents disappearing line
          height: lineThickness,
          backgroundColor: lineColor,
        }}
      />
      <span
        style={{
          margin: `0 ${gap}`,
          textAlign: "center",
          whiteSpace: "normal", // allow wrapping
          flexShrink: 0, // keep text intact without squishing too much
          fontSize: "clamp(14px, 4vw, 20px)", // responsive text size
        }}
      >
        {children}
      </span>
      <div
        style={{
          flex: 1,
          minWidth: "20px",
          height: lineThickness,
          backgroundColor: lineColor,
        }}
      />
    </div>
  );
};

export default CenterLine;