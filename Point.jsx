// Point.js
export default function Point({ children }) {
  return (
    <li
      style={{
        marginBottom: "0.5em",
        lineHeight: "1.5",
      }}
    >
      {children}
    </li>
  );
}