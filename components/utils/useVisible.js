import { useEffect, useRef, useState } from "react";

export default function useVisible(
  initialIsVisible,
  enableClickOutside = true
) {
  const [isVisible, setIsVisible] = useState(initialIsVisible);
  const ref = useRef(null);

  const handleHide = (event) => {
    if (event.key === "Escape") {
      setIsVisible(false);
    }
  };

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    if (!enableClickOutside) {
      return;
    }
    document.addEventListener("keydown", handleHide, true);
    document.addEventListener("click", handleClickOutside, true);
    document.addEventListener("touch", handleClickOutside, true);
    return () => {
      document.removeEventListener("keydown", handleHide, true);
      document.removeEventListener("click", handleClickOutside, true);
      document.removeEventListener("touch", handleClickOutside, true);
    };
  });

  return { ref, isVisible, setIsVisible };
}
