import { forwardRef } from "react";
import { Search, X } from "lucide-react";

const Filter = forwardRef(function Filter(
  {
    value = "",
    onChange,
    onClear,
    placeholder = "Buscar",
    className = "",
    name,
    id,
  },
  ref,
) {
  const clear = () => {
    onClear?.();
    onChange?.("");
  };
  return (
    <div className={`search-field ${className}`}>
      <Search size={17} strokeWidth={1.7} aria-hidden="true" />
      <input
        ref={ref}
        id={id}
        name={name}
        type="search"
        aria-label={placeholder}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Escape") clear();
        }}
      />
      {!!value && (
        <button
          type="button"
          onClick={clear}
          aria-label="Limpiar búsqueda"
          title="Limpiar búsqueda"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
});
export default Filter;
