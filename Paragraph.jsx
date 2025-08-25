import React from "react";

// style={{ letterSpacing: -0.5, wordSpacing: 0.7 }}

/**
 * Paragraph – a wrapper for text blocks with flexible margins, tag choice, and color.
 *
 * fmt patterns:
 *   - "p"               → render <p> with defaults
 *   - "p+14px"          → add 14px to <p> base size
 *   - "p-5%"            → subtract 5% from <p> base size
 *   - "p+1.2em"         → add 1.2em to <p> base size
 *   - "h_16px"          → render <h1> (via "h") with exact 16px font size
 *   - "h3_1.5rem"       → exact 1.5rem on <h3>
 *
 * Notes:
 * - Units supported for +/- and _ : px, %, em, rem
 * - "h" is an alias for "h1"
 * - SSR-safe: uses computed sizes if available, otherwise fallback map
 *
 * Extra props:
 * - rootFontSize: number (default 16) – used to interpret em/rem on the server
 * - contextFontSize: number (default = rootFontSize) – parent context for `em` math
 * - color: string – text color (e.g., "red", "#ff0000", "rgb(255,0,0)")
 * - word-wrap (boolean) – when present, applies break-word wrapping styles
 */
const Paragraph = ({
  children,
  marginTop,
  marginBottom,
  italics,
  fontWeight,
  lineHeight,
  color,
  fmt = "h1",
  style,
  rootFontSize = 16,
  contextFontSize,
  wordWrap: camelWordWrap, // camelCase prop
  "word-wrap": dashWordWrap, // dash-case prop
  compact,
  ...rest
}) => {
  // --- Parsing --------------------------------------------------------------
  const normalizedFmt = fmt.replace(/^h(\b|[_+\-])/, (m, sep) => `h1${sep || ""}`);

  const overrideMatch = normalizedFmt.match(/^([a-zA-Z][\w-]*)_([\d.]+)(px|%|em|rem)$/);
  const adjustMatch = normalizedFmt.match(
    /^([a-zA-Z][\w-]*)([+-])([\d.]+)(px|%|em|rem)$/
  );
  const plainMatch = normalizedFmt.match(/^([a-zA-Z][\w-]*)$/);

  let Component = "span";
  let finalFontSize;

  const ctxPx = typeof contextFontSize === "number" ? contextFontSize : rootFontSize;

  const defaultMultipliers = {
    h1: 2.0,
    h2: 1.5,
    h3: 1.17,
    h4: 1.0,
    h5: 0.83,
    h6: 0.67,
    p: 1.0,
    span: 1.0,
    div: 1.0,
  };

  const getFallbackBasePx = (tag) => {
    const mult = defaultMultipliers[tag?.toLowerCase()] ?? 1.0;
    return mult * rootFontSize;
  };

  const getComputedBasePx = (tag) => {
    if (typeof window !== "undefined" && typeof document !== "undefined") {
      const el = document.createElement(tag);
      el.style.visibility = "hidden";
      el.style.position = "absolute";
      document.body.appendChild(el);
      const px = parseFloat(window.getComputedStyle(el).fontSize);
      document.body.removeChild(el);
      if (!Number.isNaN(px) && px > 0) return px;
    }
    return getFallbackBasePx(tag);
  };

  const toPx = (amount, unit) => {
    switch (unit) {
      case "px":
        return amount;
      case "rem":
        return amount * rootFontSize;
      case "em":
        return amount * ctxPx;
      case "%":
        return NaN; // handled separately
      default:
        return amount;
    }
  };

  if (overrideMatch) {
    const [, rawTag, n, unit] = overrideMatch;
    Component = rawTag;
    finalFontSize = `${parseFloat(n)}${unit}`;
  } else if (adjustMatch) {
    const [, rawTag, op, n, unit] = adjustMatch;
    Component = rawTag;

    const basePx = getComputedBasePx(Component);
    const amount = parseFloat(n);

    if (unit === "%") {
      const factor = op === "+" ? 1 + amount / 100 : 1 - amount / 100;
      finalFontSize = `${basePx * factor}px`;
    } else {
      const deltaPx = toPx(amount, unit);
      const signed = op === "+" ? basePx + deltaPx : basePx - deltaPx;
      finalFontSize = `${signed}px`;
    }
  } else if (plainMatch) {
    Component = plainMatch[1];
  } else {
    Component = "span";
  }

  // Determine if word-wrap styles should be applied
  const applyWordWrap = camelWordWrap || dashWordWrap;

  const computedStyle = {
    marginTop: marginTop ?? "0px",
    marginBottom: marginBottom ?? "0px",
    ...(italics ? { fontStyle: "italic" } : null),
    ...(fontWeight ? { fontWeight } : null),
    ...(lineHeight ? { lineHeight } : null),
    ...(color ? { color } : null),
    ...(finalFontSize ? { fontSize: finalFontSize } : null),
    ...(applyWordWrap
      ? {
          wordWrap: "break-word",
          overflowWrap: "break-word",
          whiteSpace: "normal",
        }
      : null),
    ...(compact
      ? {
          letterSpacing: -0.5,
          wordSpacing: 0.7,
        }
      : null),
    ...style,
  };

  return (
    <Component style={computedStyle} {...rest}>
      {children}
    </Component>
  );
};

export default Paragraph;