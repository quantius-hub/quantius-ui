// PointList.js
export default function PointList({ children }) {
  return (
    <ul
      style={{
        listStyleType: "disc",
        paddingLeft: "1.4em",
        margin: "0",
      }}
    >
      {children}
    </ul>
  );
}