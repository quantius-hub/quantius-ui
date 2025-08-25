import React, { useState } from "react";

/**
 * Thumbnail – universal image / icon / thumbnail component
 * Features:
 *  - `href`: wraps in anchor if provided
 *  - `size`: number or CSS size string (square by default)
 *  - `src`, `alt` for image source and accessibility
 *  - supports `srcSet` & `sizes` for responsive loading
 *  - optional `aspectRatio`
 *  - placeholder while loading
 *  - fallback image if broken
 *  - optional `rounded`, `shadow`, `border`, `borderRadius`
 *  - clickable onClick
 *  - `fillWithGrid`: For non-square images, fits the image and fills the background with a customizable grid.
 *  - `gridLineCount`: The number of grid lines to show.
 *  - `gridLineWidth`: The width of the grid lines in pixels.
 *  - `gridLineColor`: The color of the grid lines.
 *  - `gridBackgroundColor`: The color of the grid background.
 */
const Thumbnail = ({
  href,
  src,
  alt = "",
  size = 48,
  srcSet,
  sizes,
  aspectRatio = 1,
  rounded = false,
  shadow = false,
  border = null,
  borderRadius = null,
  background = "transparent",
  fit = "cover",
  onClick,
  style,
  placeholder = null,
  fallback = null,
  fillWithGrid = true,
  gridLineCount = 12,
  gridLineWidth = 0.8, // New prop for line width in pixels
  gridLineColor = 'transparent', // ddd
  gridBackgroundColor = 'transparent', //f8f8f8
  ...rest
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const sizeStyle = typeof size === 'number' ? `${size}px` : size;

  const Wrapper = href ? 'a' : React.Fragment;
  const wrapperProps = href
    ? { href, style: { display: 'inline-block', lineHeight: 0 } }
    : {};

  const computedRadius = rounded ? '50%' : borderRadius || undefined;

  const handleLoad = () => setLoaded(true);
  const handleError = () => {
    setError(true);
    setLoaded(true); // Treat error as "loaded" to hide placeholder
  };

  // Conditionally determine the image fit and container background
  let containerBackgroundStyles = {};
  const imageFitStyle = fillWithGrid ? 'contain' : fit;

  if (fillWithGrid) {
    const gridCellSize = `calc(100% / ${gridLineCount})`;
    const lineWidthPx = `${gridLineWidth}px`;

    containerBackgroundStyles = {
      backgroundColor: gridBackgroundColor,
      backgroundImage: `
        linear-gradient(to right, ${gridLineColor} ${lineWidthPx}, transparent ${lineWidthPx}),
        linear-gradient(to bottom, ${gridLineColor} ${lineWidthPx}, transparent ${lineWidthPx})
      `,
      backgroundSize: `${gridCellSize} ${gridCellSize}`,
    };
  } else {
    containerBackgroundStyles = { background };
  }

  // The image element to be rendered
  const imageEl = !error && src ? (
    <img
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      onLoad={handleLoad}
      onError={handleError}
      style={{
        width: '100%',
        height: '100%',
        objectFit: imageFitStyle,
        borderRadius: computedRadius,
        display: loaded ? 'block' : 'none',
        position: 'relative',
        zIndex: 2,
      }}
      {...rest}
    />
  ) : typeof fallback === 'string' ? (
    <img
      src={fallback}
      alt={alt}
      style={{
        width: '100%',
        height: '100%',
        objectFit: imageFitStyle,
        borderRadius: computedRadius,
      }}
    />
  ) : (
    fallback
  );

  return (
    <Wrapper {...wrapperProps}>
      <div
        onClick={onClick}
        style={{
          width: sizeStyle,
          height: `calc(${sizeStyle} / ${aspectRatio})`,
          border: border || undefined,
          borderRadius: computedRadius,
          boxShadow: shadow ? '0 2px 8px rgba(0,0,0,0.15)' : undefined,
          overflow: 'hidden',
          position: 'relative',
          ...containerBackgroundStyles,
          ...style,
        }}
      >
        {!loaded && placeholder}
        {imageEl}
      </div>
    </Wrapper>
  );
};

export default Thumbnail;