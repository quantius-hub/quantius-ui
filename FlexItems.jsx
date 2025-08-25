import React, { useEffect, useMemo, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

/**
 * FlexItems – horizontally scrolling items (default) or a wrapping grid,
 * with optional edge gradients and arrow controls.
 */
const FlexItems = ({
  as: Component = "div",
  children,
  style,
  // layout
  mode = "horizontal", // 'horizontal' | 'grid'
  gap = "5px",
  height = "auto",
  center = "left",
  verticalCenter = "center",
  justify,
  align,
  wrap, // override for grid mode
  scrollBehavior = "smooth",

  // scrollbars
  hideScrollbar = true, // visually hide scrollbar but keep scrolling

  // edge hinting (all props)
  showEdgeFade,            // boolean | undefined; default depends on mode
  edgeFadeOnGrid = false,  // if true, show fades in grid mode too
  edgeFadeSize = "5vw",    // accepts CSS length (e.g., "5vw", "24px"); number -> px
  edgeFadeColor = "#ccc",  // background color to fade from

  // arrows
  showArrows = true,        // show left/right arrow buttons
  arrowSize = 28,           // px button size
  arrowBg = "rgba(0,0,0,0.5)", // button background
  arrowColor = "#fff",      // icon color

  ...rest
}) => {
  const normalize = (v) => (v === "middle" ? "center" : v);
  center = normalize(center);
  verticalCenter = normalize(verticalCenter);

  const justifyMap = {
    left: "flex-start",
    center: "center",
    right: "flex-end",
    between: "space-between",
    around: "space-around",
    evenly: "space-evenly",
  };
  const alignMap = {
    top: "flex-start",
    center: "center",
    bottom: "flex-end",
    stretch: "stretch",
    baseline: "baseline",
  };

  const isHorizontal = mode === "horizontal";
  const effectiveShowEdgeFade =
    typeof showEdgeFade === "boolean"
      ? showEdgeFade
      : isHorizontal
      ? true
      : edgeFadeOnGrid;

  const scrollerRef = useRef(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(true);

  const updateEdgeState = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const maxScroll = isHorizontal
      ? el.scrollWidth - el.clientWidth
      : el.scrollHeight - el.clientHeight;
    const pos = isHorizontal ? el.scrollLeft : el.scrollTop;
    setAtStart(pos <= 1);
    setAtEnd(maxScroll - pos <= 1);
  };

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    updateEdgeState();
    const onScroll = () => updateEdgeState();
    el.addEventListener("scroll", onScroll, { passive: true });

    let ro;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(updateEdgeState);
      ro.observe(el);
    }

    const onWinResize = () => updateEdgeState();
    window.addEventListener("resize", onWinResize);

    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onWinResize);
      if (ro) ro.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const containerStyles = useMemo(() => {
    const computed = {
      display: "flex",
      position: "relative",
      flexDirection: "row",
      flexWrap: isHorizontal ? "nowrap" : wrap ?? "wrap",
      gap,
      height,
      justifyContent: justify ?? justifyMap[center] ?? center,
      alignItems: align ?? alignMap[verticalCenter] ?? verticalCenter,
      overflowX: isHorizontal ? "auto" : "hidden",
      overflowY: isHorizontal ? "hidden" : "auto",
      whiteSpace: isHorizontal ? "nowrap" : "normal",
      scrollBehavior,
      WebkitOverflowScrolling: "touch",
      ...style,
    };

    if (hideScrollbar) {
      computed.scrollbarWidth = "none";
      computed.msOverflowStyle = "none";
    }

    return computed;
  }, [
    isHorizontal,
    gap,
    height,
    justify,
    align,
    center,
    verticalCenter,
    wrap,
    scrollBehavior,
    hideScrollbar,
    style,
  ]);

  // Convert edgeFadeSize: number -> px, string -> as-is
  const resolveLen = (val) =>
    typeof val === "number" ? `${val}px` : String(val);

  const edgeFadeCommon = {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: resolveLen(edgeFadeSize), // fixed: don't force "px" when user passes "vw"/"%"
    pointerEvents: "none",
    zIndex: 1,
  };

  const leftFadeStyle = {
    ...edgeFadeCommon,
    left: 0,
    background: `linear-gradient(to right, ${edgeFadeColor}, transparent)`,
    opacity: atStart ? 0 : 1,
    transition: "opacity 180ms ease",
  };
  const rightFadeStyle = {
    ...edgeFadeCommon,
    right: 0,
    background: `linear-gradient(to left, ${edgeFadeColor}, transparent)`,
    opacity: atEnd ? 0 : 1,
    transition: "opacity 180ms ease",
  };

  const arrowCommon = {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    width: `${arrowSize}px`,
    height: `${arrowSize}px`,
    borderRadius: "999px",
    background: arrowBg,
    color: arrowColor,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2, // sits above clickable children
    cursor: "pointer",
    userSelect: "none",
    border: "none",
  };

  // ——— Arrow movement: exactly two item "cells" ———
  // Safely measure first child's width and the computed column-gap.
  const getTwoCellStep = () => {
    const el = scrollerRef.current;
    if (!el) return 160; // safe fallback

    const firstEl = el.firstElementChild;
    if (!firstEl) return Math.max(160, Math.floor(el.clientWidth * 0.4));

    const rect = firstEl.getBoundingClientRect();
    // Column gap is what's used between items in horizontal flex
    const cs = getComputedStyle(el);
    // Browsers return pixel value here
    const columnGapPx = parseFloat(cs.columnGap || cs.gap || "0") || 0;

    const singleCell = rect.width + columnGapPx;
    return Math.max(80, Math.floor(singleCell * 2)); // two cells
  };

  const scrollByTwoCells = (dir) => {
    const el = scrollerRef.current;
    if (!el) return;
    const step = getTwoCellStep();
    if (isHorizontal) {
      el.scrollBy({ left: dir * step, behavior: "smooth" });
    } else {
      el.scrollBy({ top: dir * step, behavior: "smooth" });
    }
  };

  // Prevent arrow clicks from hitting underlying child elements.
  const eatPointer = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div style={{ position: "relative" }}>
      {effectiveShowEdgeFade && (
        <>
          <div aria-hidden style={leftFadeStyle} />
          <div aria-hidden style={rightFadeStyle} />
        </>
      )}

{showArrows && isHorizontal && (
  <>
    {!atStart && (
      <button
        type="button"
        aria-label="Scroll left"
        onMouseDown={eatPointer}
        onClick={() => scrollByTwoCells(-1)}
        style={{
          ...arrowCommon,
          left: 8,
        }}
      >
        <FiChevronLeft size={arrowSize - 8} />
      </button>
    )}

    {!atEnd && (
      <button
        type="button"
        aria-label="Scroll right"
        onMouseDown={eatPointer}
        onClick={() => scrollByTwoCells(1)}
        style={{
          ...arrowCommon,
          right: 8,
        }}
      >
        <FiChevronRight size={arrowSize - 8} />
      </button>
    )}
  </>
)}


      <Component
        ref={scrollerRef}
        style={containerStyles}
        onScroll={updateEdgeState}
        {...rest}
      >
        {children}
      </Component>
    </div>
  );
};

export default FlexItems;