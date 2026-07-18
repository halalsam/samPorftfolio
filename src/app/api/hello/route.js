import { NextResponse } from 'next/server';

// App Router Route Handler: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
export function GET() {
  return NextResponse.json({ name: 'John Doe' });
}
