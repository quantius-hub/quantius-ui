import React from "react";

const colorPresets = [
  { bg: "#E53935", border: "#B71C1C" }, // Red
  { bg: "#D81B60", border: "#880E4F" }, // Pink
  { bg: "#8E24AA", border: "#4A148C" }, // Purple
  { bg: "#5E35B1", border: "#311B92" }, // Deep Purple
  { bg: "#3949AB", border: "#1A237E" }, // Indigo
  { bg: "#1E88E5", border: "#0D47A1" }, // Blue
  { bg: "#00897B", border: "#004D40" }, // Teal
  { bg: "#43A047", border: "#1B5E20" }, // Green
  { bg: "#FDD835", border: "#F57F17" }, // Yellow (golden border)
  { bg: "#FB8C00", border: "#E65100" }, // Orange
];

const Ticker = ({
  children,
  colorOption = 0,
  borderRadius = "10px",
  borderColor,
  backgroundColor
}) => {
  const colors = colorPresets[colorOption % colorPresets.length];

  const finalBg = backgroundColor || colors.bg;
  const finalBorder = borderColor || colors.border;

  return (
    <div
      style={{
        display: "inline-block",
        backgroundColor: finalBg,
        borderRadius,
        padding: "3px 7px",
        fontSize: "0.65rem",
        lineHeight: "1",
        fontWeight: "500",
        color: "#FFFFFF",
        whiteSpace: "nowrap",
        boxSizing: "border-box",
      }}
    >
      {children}
    </div>
  );
};

export default Ticker;