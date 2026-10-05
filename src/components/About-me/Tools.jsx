import { Draw } from '@/components/ui/reveal';
import { logoSrc } from './data';

function Shelf({ items }) {
  return (
    <ul className="grid grid-cols-5 sm:grid-cols-10">
      {items.map((item) => (
        <li key={item.brand} className="group flex flex-col items-center gap-3 px-1 py-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoSrc(item.brand)}
            alt=""
            loading="lazy"
            className="h-10 w-10 transition-transform duration-300 group-hover:-translate-y-1 motion-reduce:transition-none sm:h-12 sm:w-12"
          />
          <span className="text-center text-xs leading-tight">{item.label}</span>
        </li>
      ))}
    </ul>
  );
}

/** "The stack": the tools on still shelves (no marquee), each logo named. */
export default function Tools({ rows }) {
  return (
    <div>
      {rows.map((row, i) => (
        <div key={i}>
          <Draw className="h-px w-full text-white/10" delay={i * 0.1} />
          <Shelf items={row} />
        </div>
      ))}
      <Draw className="h-px w-full text-white/10" delay={rows.length * 0.1} />
    </div>
  );
}
