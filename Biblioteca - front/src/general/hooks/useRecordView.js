import { useEffect, useRef } from "react";

// Preserve the list position and keyboard focus when opening an existing action.
export default function useRecordView(open, onClose, busy = false) {
  const root = useRef(null);
  const close = useRef(onClose);
  const pending = useRef(busy);
  useEffect(() => {
    close.current = onClose;
    pending.current = busy;
  });
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement;
    const position = window.scrollY;
    const frame = requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      const heading = root.current?.querySelector("h1");
      heading?.setAttribute("tabindex", "-1");
      heading?.focus({ preventScroll: true });
    });
    const escape = (event) => {
      if (
        event.key === "Escape" &&
        !pending.current &&
        !document.querySelector(".swal2-container")
      )
        close.current?.();
    };
    document.addEventListener("keydown", escape);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", escape);
      requestAnimationFrame(() => {
        window.scrollTo(0, position);
        previous?.focus?.({ preventScroll: true });
      });
    };
  }, [open]);
  return root;
}
