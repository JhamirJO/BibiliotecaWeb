// src/components/ui/TextArea.jsx
import React, { forwardRef } from "react";

const base =
  "textarea textarea-bordered w-full " +
  "border-slate-300 ring-0 focus:ring-2 " +
  "focus:ring-[#309FFF]/40 focus:border-[#309FFF] " +
  "focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed";

const sizeMap = { sm: "textarea-sm", md: "", lg: "textarea-lg" };

const TextArea = forwardRef(function TextArea(
  { className = "", size = "md", rows = 3, ...props },
  ref
) {
  const sizeCls = sizeMap[size] ?? "";
  return (
    <textarea
      ref={ref}
      className={`${base} ${sizeCls} ${className}`}
      rows={rows}
      {...props}
    />
  );
});

export default TextArea;
