import { renderHook, act } from '@testing-library/react';
import { useSwipeGesture } from './useSwipeGesture';

const fakeEvent = (clientX: number) => ({ clientX } as React.PointerEvent);

describe('useSwipeGesture', () => {
  it('returns no handlers when disabled', () => {
    const { result } = renderHook(() =>
      useSwipeGesture({ enabled: false, isOpen: false, side: 'left', onOpen: jest.fn(), onClose: jest.fn() })
    );
    expect(result.current.swipeHandlers.onPointerDown).toBeUndefined();
  });

  it('calls onOpen when closed and dragged past the threshold toward the open direction (left side)', () => {
    const onOpen = jest.fn();
    const { result } = renderHook(() =>
      useSwipeGesture({ enabled: true, isOpen: false, side: 'left', panelWidth: 300, onOpen, onClose: jest.fn() })
    );
    act(() => result.current.swipeHandlers.onPointerDown!(fakeEvent(0)));
    act(() => result.current.swipeHandlers.onPointerMove!(fakeEvent(150)));
    act(() => result.current.swipeHandlers.onPointerUp!(fakeEvent(150)));
    expect(onOpen).toHaveBeenCalled();
  });

  it('does not call onOpen when the drag does not cross the threshold', () => {
    const onOpen = jest.fn();
    const { result } = renderHook(() =>
      useSwipeGesture({ enabled: true, isOpen: false, side: 'left', panelWidth: 300, onOpen, onClose: jest.fn() })
    );
    act(() => result.current.swipeHandlers.onPointerDown!(fakeEvent(0)));
    act(() => result.current.swipeHandlers.onPointerMove!(fakeEvent(20)));
    act(() => result.current.swipeHandlers.onPointerUp!(fakeEvent(20)));
    expect(onOpen).not.toHaveBeenCalled();
  });

  it('calls onClose when open and dragged past the threshold toward the close direction (left side)', () => {
    const onClose = jest.fn();
    const { result } = renderHook(() =>
      useSwipeGesture({ enabled: true, isOpen: true, side: 'left', panelWidth: 300, onOpen: jest.fn(), onClose })
    );
    act(() => result.current.swipeHandlers.onPointerDown!(fakeEvent(200)));
    act(() => result.current.swipeHandlers.onPointerMove!(fakeEvent(0)));
    act(() => result.current.swipeHandlers.onPointerUp!(fakeEvent(0)));
    expect(onClose).toHaveBeenCalled();
  });

  it('mirrors the threshold direction for the right side', () => {
    const onOpen = jest.fn();
    const { result } = renderHook(() =>
      useSwipeGesture({ enabled: true, isOpen: false, side: 'right', panelWidth: 300, onOpen, onClose: jest.fn() })
    );
    act(() => result.current.swipeHandlers.onPointerDown!(fakeEvent(200)));
    act(() => result.current.swipeHandlers.onPointerMove!(fakeEvent(50)));
    act(() => result.current.swipeHandlers.onPointerUp!(fakeEvent(50)));
    expect(onOpen).toHaveBeenCalled();
  });

  it('resets dragOffset to 0 after pointer up', () => {
    const { result } = renderHook(() =>
      useSwipeGesture({ enabled: true, isOpen: false, side: 'left', panelWidth: 300, onOpen: jest.fn(), onClose: jest.fn() })
    );
    act(() => result.current.swipeHandlers.onPointerDown!(fakeEvent(0)));
    act(() => result.current.swipeHandlers.onPointerMove!(fakeEvent(150)));
    expect(result.current.dragOffset).toBe(150);
    act(() => result.current.swipeHandlers.onPointerUp!(fakeEvent(150)));
    expect(result.current.dragOffset).toBe(0);
  });
});
