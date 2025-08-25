import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { FiSearch, FiX } from "react-icons/fi"; // Added FiX for clear button

export const TextInput = forwardRef(function TextInput(
  {
    mode = "search",
    value,
    defaultValue = "",
    onChange,
    onSubmit,
    onCancel,
    placeholder = mode === "search" ? "Search…" : "Write a comment…",
    disabled = false,
    readOnly = false,
    autoFocus = false,
    label,
    helperText,
    errorText,
    maxLength,
    minRows = 3,
    maxRows = 10,
    allowTab = false,
    size = "sm",
    shellPadding,
    iconGap,
    iconSize,
    style,
    className,
    textareaStyle,
    inputStyle,
    ...rest
  },
  ref
) {
  const isControlled = value !== undefined;
  const [inner, setInner] = useState(defaultValue);
  const text = isControlled ? value : inner;

  const fieldRef = useRef(null);
  const [focusWithin, setFocusWithin] = useState(false);

  useImperativeHandle(ref, () => ({
    focus: () => fieldRef.current?.focus(),
    clear: () => {
      if (isControlled) {
        onChange?.("");
      } else {
        setInner("");
      }
      if (mode === "comment") {
        requestAnimationFrame(resizeToContent);
      }
    },
    get value() {
      return text ?? "";
    },
  }));

  const tokens = useMemo(() => {
    const map = {
      sm: { fontSize: 14, padding: 8, radius: 10, lineHeight: 20 },
      md: { fontSize: 15, padding: 8, radius: 10, lineHeight: 22 },
      lg: { fontSize: 16, padding: 8, radius: 10, lineHeight: 24 },
    };
    return map[size] ?? map.md;
  }, [size]);

  const PAD = typeof shellPadding === "number" ? shellPadding : tokens.padding;
  const ICON_SIZE = typeof iconSize === "number" ? iconSize : 18;
  const ICON_GAP = typeof iconGap === "number" ? iconGap : Math.round(PAD * 0.75);

  const resizeToContent = () => {
    if (mode !== "comment") return;
    const el = fieldRef.current;
    if (!el) return;

    const line = tokens.lineHeight;
    const minH = Math.max(minRows, 1) * line;
    const maxH = Math.max(maxRows, minRows) * line;

    el.style.height = "auto";
    el.style.overflowY = "hidden";
    const next = Math.min(Math.max(el.scrollHeight, minH), maxH);
    el.style.height = `${next}px`;
    el.style.overflowY = next >= maxH ? "auto" : "hidden";
  };

  useEffect(() => {
    if (mode === "comment") resizeToContent();
  }, [text, minRows, maxRows, tokens.lineHeight, mode]);

  useEffect(() => {
    if (autoFocus) fieldRef.current?.focus();
  }, [autoFocus]);

  const handleChange = (e) => {
    const v = e.target.value;
    if (!isControlled) setInner(v);
    onChange?.(v);
  };

  const submit = () => {
    if (!disabled && !readOnly) onSubmit?.(text?.trim?.() ?? "");
  };

  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      submit();
      return;
    }
    if (mode === "search" && e.key === "Enter") {
      e.preventDefault();
      submit();
      return;
    }
    if (e.key === "Escape") {
      if (onCancel) {
        e.preventDefault();
        onCancel();
      }
      return;
    }
    if (mode === "comment" && allowTab && e.key === "Tab") {
      e.preventDefault();
      const el = fieldRef.current;
      if (!el) return;
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const next = (text ?? "").slice(0, start) + "\t" + (text ?? "").slice(end);
      if (!isControlled) setInner(next);
      onChange?.(next);
      requestAnimationFrame(() => {
        el.selectionStart = el.selectionEnd = start + 1;
        resizeToContent();
      });
    }
  };

  const counter =
    typeof maxLength === "number" ? `${(text ?? "").length}/${maxLength}` : null;

  const hasError = Boolean(errorText);
  const baseBorder = hasError ? "#e11d48" : "#aaa";
  const subtleText = "#6b7280";
  const shellBorderColor = focusWithin ? "transparent" : baseBorder;
  const shellShadow = focusWithin
    ? `0 0 2px 2px color-mix(in srgb, var(--app-color, #3b82f6) 40%, transparent)`
    : "none";

  const INPUT_PL_WITH_ICON = PAD + ICON_SIZE + ICON_GAP;

  return (
    <div
      className={className}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 6,
        letterSpacing: "-0.25px",
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
        ...style,
      }}
      onFocusCapture={() => setFocusWithin(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setFocusWithin(false);
      }}
    >
      {label ? (
        <label
          style={{
            fontSize: 12,
            color: subtleText,
            userSelect: "none",
            fontFamily: "Inter, sans-serif",
          }}
          onClick={() => fieldRef.current?.focus()}
        >
          {label}
        </label>
      ) : null}

      <div
        style={{
          position: "relative",
          background: "#fff",
          border: `1.2px solid ${shellBorderColor}`,
          borderRadius: tokens.radius,
          transition: "border-color 120ms ease, box-shadow 120ms ease",
          boxShadow: shellShadow,
          fontFamily: "Inter, sans-serif",
        }}
        data-input-shell=""
      >
        {mode === "search" ? (
          <>
            <FiSearch
              style={{
                position: "absolute",
                top: "50%",
                left: PAD,
                transform: "translateY(-50%)",
                color: subtleText,
                pointerEvents: "none",
                width: ICON_SIZE,
                height: ICON_SIZE,
              }}
            />

            <input
              ref={fieldRef}
              className="ti-input"
              type="search"
              value={text}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled}
              readOnly={readOnly}
              maxLength={maxLength}
              aria-invalid={hasError || undefined}
              aria-describedby={hasError || helperText ? "ti-help" : undefined}
              aria-label={label ?? "Search"}
              style={{
                width: "100%",
                boxSizing: "border-box",
                outline: "none",
                border: "none",
                background: "transparent",
                color: "#111827",
                fontSize: tokens.fontSize,
                lineHeight: `${tokens.lineHeight}px`,
                letterSpacing: "-0.3px",
                paddingTop: PAD,
                paddingRight: INPUT_PL_WITH_ICON,
                paddingBottom: PAD,
                paddingLeft: INPUT_PL_WITH_ICON,
                borderRadius: tokens.radius,
                caretColor: "#111827",
                WebkitAppearance: "none",
                fontFamily: "Inter, sans-serif",
                ...inputStyle,
              }}
              {...rest}
            />

            {text ? (
              <button
                type="button"
                onClick={() => {
                  if (isControlled) {
                    onChange?.("");
                  } else {
                    setInner("");
                  }
                }}
                style={{
                  position: "absolute",
                  top: "50%",
                  right: PAD,
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  color: subtleText,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                aria-label="Clear search"
              >
                <FiX size={ICON_SIZE} />
              </button>
            ) : null}
          </>
        ) : (
          <textarea
            ref={fieldRef}
            value={text}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            maxLength={maxLength}
            rows={minRows}
            aria-invalid={hasError || undefined}
            aria-describedby={hasError || helperText ? "ti-help" : undefined}
            style={{
              width: "100%",
              boxSizing: "border-box",
              resize: "none",
              outline: "none",
              border: "none",
              background: "transparent",
              color: "#111827",
              fontSize: tokens.fontSize,
              lineHeight: `${tokens.lineHeight}px`,
              padding: PAD,
              borderRadius: tokens.radius,
              caretColor: "#111827",
              fontFamily: "Inter, sans-serif",
              ...textareaStyle,
            }}
            {...rest}
          />
        )}
      </div>

      {/* <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
          fontSize: 12,
          color: hasError ? "#be123c" : subtleText,
          fontFamily: "Inter, sans-serif",
        }}
        id="ti-help"
      >
        {counter ? <span>{counter}</span> : null}
      </div> */}
    </div>
  );
});

export default TextInput;
