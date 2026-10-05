'use client';

import { useEffect, useState } from 'react';

// The build-time year keeps server and client markup identical on first
// paint; after mount it switches to the visitor's current year, so a site
// built in December still reads right in January.
const BUILT = Number(process.env.NEXT_PUBLIC_BUILD_YEAR) || new Date().getFullYear();

export function useYear() {
  const [year, setYear] = useState(BUILT);
  useEffect(() => setYear(new Date().getFullYear()), []);
  return year;
}
