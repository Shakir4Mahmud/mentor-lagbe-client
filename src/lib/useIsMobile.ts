"use client";

import { useSyncExternalStore } from "react";

const MOBILE_QUERY = "(max-width: 639px)";

function subscribe(callback: () => void) {
  const media = window.matchMedia(MOBILE_QUERY);
  media.addEventListener("change", callback);

  return () => {
    media.removeEventListener("change", callback);
  };
}

function getSnapshot() {
  return window.matchMedia(MOBILE_QUERY).matches;
}

function getServerSnapshot() {
  return false;
}

// Screen size without a resize listener. Server starts as "desktop", then the
// browser snapshot takes over after hydration — same behaviour as before, but
// without extra state updates while resizing.
export function useIsMobile() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
