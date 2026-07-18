import React, { forwardRef } from "react";

const base =
  "input input-bordered w-full " +
  "border-slate-300 ring-0 focus:ring-2 " +
  "focus:ring-[#309FFF]/40 focus:border-[#309FFF] " +
  "focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed";

const sizeMap = { sm: "input-sm", md: "", lg: "input-lg" };

const Input = forwardRef(function Input(
  {
    as = "input",
    className = "",
    size = "md",
    numeric = false,       // 👈 NUEVO PROP
    maxLength,
    onChange,
    onKeyDown,
    ...rest
  },
  ref
) {
  const Comp = as;
  const sizeCls = sizeMap[size] ?? "";

  const handleKeyDown = (e) => {
    if (numeric) {
      const allowedKeys = [
        "Backspace",
        "Tab",
        "ArrowLeft",
        "ArrowRight",
        "Delete",
      ];

      if (allowedKeys.includes(e.key)) {
        return onKeyDown?.(e);
      }

      // Si NO es un dígito 0-9, bloqueamos
      if (!/^\d$/.test(e.key)) {
        e.preventDefault();
        return;
      }

      // Si ya se alcanzó el maxLength, bloqueamos + dígitos
      if (
        /^\d$/.test(e.key) &&
        typeof maxLength === "number" &&
        e.currentTarget.value.length >= maxLength
      ) {
        e.preventDefault();
        return;
      }
    }

    onKeyDown?.(e);
  };

  const handleChange = (e) => {
    if (numeric) {
      let value = e.target.value || "";
      value = value.replace(/\D/g, ""); // solo dígitos
      if (typeof maxLength === "number") {
        value = value.slice(0, maxLength);
      }

      // disparamos onChange con el valor sanitizado
      onChange?.({
        ...e,
        target: {
          ...e.target,
          value,
        },
      });
      return;
    }

    onChange?.(e);
  };

  return (
    <Comp
      ref={ref}
      className={`${base} ${sizeCls} ${className}`}
      maxLength={maxLength}
      onKeyDown={handleKeyDown}
      onChange={handleChange}
      {...rest}
    />
  );
});

export default Input;
