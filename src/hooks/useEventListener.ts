import { useEffect } from 'react';

export function useEventListener<K extends keyof DocumentEventMap>(
  eventType: K,
  handler: (event: DocumentEventMap[K]) => void,
  enabled = true
) {
  useEffect(() => {
    if (!enabled) return;

    document.addEventListener(eventType, handler);
    return () => {
      document.removeEventListener(eventType, handler);
    };
  }, [eventType, handler, enabled]);
}
