import { useCallback, useRef, useState } from "react";

interface UseSwipeGestureOptions {
  enabled: boolean;
  isOpen: boolean;
  side: "left" | "right";
  panelWidth?: number;
  onOpen: () => void;
  onClose: () => void;
}

interface SwipeHandlers {
  onPointerDown?: (event: React.PointerEvent) => void;
  onPointerMove?: (event: React.PointerEvent) => void;
  onPointerUp?: (event: React.PointerEvent) => void;
  onPointerCancel?: (event: React.PointerEvent) => void;
}

export const useSwipeGesture = ({
  enabled,
  isOpen,
  side,
  panelWidth = 300,
  onOpen,
  onClose,
}: UseSwipeGestureOptions): { swipeHandlers: SwipeHandlers; isDragging: boolean; dragOffset: number } => {
  const startX = useRef<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handlePointerDown = useCallback((event: React.PointerEvent) => {
    startX.current = event.clientX;
    setIsDragging(true);
  }, []);

  const handlePointerMove = useCallback((event: React.PointerEvent) => {
    if (startX.current === null) return;
    setDragOffset(event.clientX - startX.current);
  }, []);

  const handlePointerUp = useCallback(() => {
    if (startX.current === null) return;

    const threshold = panelWidth * 0.3;
    if (Math.abs(dragOffset) > threshold) {
      const draggingTowardOpen = side === "left" ? dragOffset > 0 : dragOffset < 0;
      if (isOpen && !draggingTowardOpen) {
        onClose();
      } else if (!isOpen && draggingTowardOpen) {
        onOpen();
      }
    }

    startX.current = null;
    setIsDragging(false);
    setDragOffset(0);
  }, [dragOffset, panelWidth, side, isOpen, onOpen, onClose]);

  if (!enabled) {
    return { swipeHandlers: {}, isDragging: false, dragOffset: 0 };
  }

  return {
    swipeHandlers: {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
      onPointerCancel: handlePointerUp,
    },
    isDragging,
    dragOffset,
  };
};
