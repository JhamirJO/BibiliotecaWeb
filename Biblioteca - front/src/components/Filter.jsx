import React, { forwardRef } from "react";
import { LimpiarFiltro } from "@/utils/Icons";
import Input from "@/components/Input"

const Filter = forwardRef(function Filter(
  {
    value,
    onChange,
    onClear,
    placeholder = "Buscar",
    className = "",
    name,
    id,
  },
  ref
) {
  const handleClear = () => {
    if (onClear) onClear();
    if (onChange) onChange("");
  };

  return (
    <div className={`relative ${className}`}>
      <Input
        ref={ref}
        id={id}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") handleClear();
        }}
      />

      {/* X derecha */}
      {!!value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
          aria-label="Limpiar búsqueda"
          title="Limpiar"
        >
          <LimpiarFiltro />
        </button>
      )}
    </div>
  );
});

export default Filter;
