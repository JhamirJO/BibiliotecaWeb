import React, { forwardRef } from "react";

// util simple para combinar clases
const cx = (...classes) => classes.filter(Boolean).join(" ");

const VARIANT = {
  white: "bg-white ring-1 ring-black/5",
  slate: "bg-slate-50 ring-1 ring-black/5",
  brand: "bg-[#DEE3E9] ring-1 ring-[#104E75]/10", // tu fondo claro corporativo
  transparent: "",
};

const ELEVATION = {
  none: "",
  sm: "shadow-sm",
  md: "shadow",
  lg: "shadow-lg",
};

const PADDING = {
  xs: "p-3",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

const ROUNDED = {
  md: "rounded-lg",
  lg: "rounded-xl",
  xl: "rounded-2xl",
};

const Card = forwardRef(function Card(
  {
    as: Tag = "div",
    variant = "white",
    elevation = "md",
    padding = "md",
    rounded = "lg",
    interactive = false,          // hover suave opcional
    className = "",
    children,
    ...rest
  },
  ref
) {
  const Component = Tag;
  return (
    <Component
      ref={ref}
      className={cx(
        VARIANT[variant],
        ELEVATION[elevation],
        PADDING[padding],
        ROUNDED[rounded],
        interactive ? "transition-shadow hover:shadow-md" : "",
        "min-w-0", // evita overflow en grids
        className
      )}
      {...rest}
    >
      {children}
    </Component>
  );
});

// Secciones opcionales (por si quieres estandarizar encabezados/pies)
export const CardHeader = ({ className = "", children }) => (
  <div className={cx("mb-3", className)}>{children}</div>
);
export const CardContent = ({ className = "", children }) => (
  <div className={className}>{children}</div>
);
export const CardFooter = ({ className = "", children }) => (
  <div className={cx("mt-4", className)}>{children}</div>
);

export default Card;
