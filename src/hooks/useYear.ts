'use client';

import { useSyncExternalStore } from 'react';

// The build-time year keeps server and client markup identical on first
// paint; after hydration it switches to the visitor's current year, so a
// site built in December still reads right in January.
const BUILT = Number(process.env.NEXT_PUBLIC_BUILD_YEAR) || new Date().getFullYear();

// The year doesn't change while a page is open, so there's nothing to subscribe to.
const subscribe = () => () => {};

export function useYear() {
  return useSyncExternalStore(subscribe, () => new Date().getFullYear(), () => BUILT);
}
