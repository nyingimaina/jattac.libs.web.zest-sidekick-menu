import { useEffect, useRef, useState } from "react";
import { ISidekickMenuItem } from "../types";

interface UseNumberedShortcutsOptions {
  enabled: boolean;
  menuRef: React.RefObject<HTMLElement>;
  eligibleItems: ISidekickMenuItem[];
  onActivate: (item: ISidekickMenuItem) => void;
}

export const useNumberedShortcuts = ({
  enabled,
  menuRef,
  eligibleItems,
  onActivate,
}: UseNumberedShortcutsOptions): { showBadges: boolean } => {
  const [hasKeyboardEvidence, setHasKeyboardEvidence] = useState(false);
  const eligibleItemsRef = useRef(eligibleItems);
  eligibleItemsRef.current = eligibleItems;
  const onActivateRef = useRef(onActivate);
  onActivateRef.current = onActivate;

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const container = menuRef.current;
      if (!container || !document.activeElement || !container.contains(document.activeElement)) {
        return;
      }

      setHasKeyboardEvidence(true);

      const match = /^Digit([1-9])$/.exec(event.code);
      if (!match) return;

      const index = parseInt(match[1], 10) - 1;
      const item = eligibleItemsRef.current[index];
      if (item) {
        event.preventDefault();
        onActivateRef.current(item);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [enabled, menuRef]);

  return { showBadges: enabled && hasKeyboardEvidence };
};
