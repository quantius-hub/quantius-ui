import React from "react";

const Break = ({ height = "1em" }) => {
  return (
    <div
      style={{
        height,
        width: "1px",
      }}
    />
  );
};

export default Break;