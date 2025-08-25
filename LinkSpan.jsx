import { useLocation } from "wouter-preact";

export default function LinkSpan({ url, children }) {
  const [, setLocation] = useLocation();

  const handleClick = () => {
    if (url.startsWith("http")) {
      window.location.href = url; // Full page navigation for absolute URLs
    } else {
      setLocation(url); // SPA navigation for relative URLs
    }
  };

  return (
    <span
      style={{ cursor: "pointer", color: "var(--app-color)" }}
      onClick={handleClick}
    >
      {children}
    </span>
  );
}