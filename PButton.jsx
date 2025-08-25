import React from "react";
import { useLocation } from "wouter-preact";

const PButton = ({
  onClick,
  url,
  borderRadius = "10px",
  backgroundColor = "var(--app-color)",
  color = "#fff",
  padding = "10px 20px",
  width = "fit-content",
  fontWeight = 600,
  children,
  disabled = false,
}) => {

  const [location, navigate] = useLocation();

  const handleClick = (e) => {
    if (disabled) return;

    if (url) {
      e.preventDefault();
      navigate(url);
      return;
    }

    if (typeof onClick === "function") {
      onClick(e);
    }
  };

  const styles = {
    borderRadius,
    backgroundColor,
    color,
    padding,
    width,
    cursor: disabled ? "not-allowed" : "pointer",
    filter: disabled ? "grayscale(100%)" : "none",
    opacity: disabled ? 0.6 : 1,
    fontWeight,
    userSelect: "none",
    textAlign: "center",
    textDecoration: "none",
    display: "inline-block",
  };

  return (
    <div style={styles} onClick={handleClick}>
      {children}
    </div>
  );
};

export default PButton;