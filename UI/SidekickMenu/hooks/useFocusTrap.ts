import { useEffect } from "react";

export const useFocusTrap = (
  menuRef: React.RefObject<HTMLElement>,
  isOpen: boolean
) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || !menuRef.current) return;

      const focusableElements = menuRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[
        focusableElements.length - 1
      ] as HTMLElement;

      if (event.shiftKey) {
        // If Shift + Tab and focus is on the first element, move to last
        if (document.activeElement === firstElement) {
          lastElement.focus();
          event.preventDefault();
        }
      } else {
        // If Tab and focus is on the last element, move to first
        if (document.activeElement === lastElement) {
          firstElement.focus();
          event.preventDefault();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    // Clean up the event listener when the component unmounts or isOpen changes
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, menuRef]); // Dependencies for useEffect
};