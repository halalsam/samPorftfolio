'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Archive, BarChart3, Bell, Box, Cloud, CloudUpload, Code2, Cpu, CreditCard, Database, FileText, GitBranch, Globe,
  GraduationCap, KeyRound, Layers, Lock, Mail, Megaphone, Plug, Radio, Search, Server, Shield, ShieldCheck,
  ShoppingBag, Smartphone, Users, Workflow, Zap, ChevronDown,
} from 'lucide-react';
import BlurFade from '@/components/ui/blur-fade';
import Section from '../primitives/Section';
import RichText from '../primitives/RichText';

// Icon names a CMS editor can pick (mirrors the enum in cms/strapi arch-node).
export const ARCH_ICONS = {
  smartphone: Smartphone, shield: Shield, 'shield-check': ShieldCheck, globe: Globe, 'shopping-bag': ShoppingBag,
  cpu: Cpu, 'file-text': FileText, search: Search, 'bar-chart': BarChart3, database: Database, zap: Zap,
  'credit-card': CreditCard, mail: Mail, 'key-round': KeyRound, megaphone: Megaphone, archive: Archive,
  server: Server, radio: Radio, 'cloud-upload': CloudUpload, cloud: Cloud, bell: Bell, lock: Lock,
  'git-branch': GitBranch, 'graduation-cap': GraduationCap, users: Users, plug: Plug, code: Code2, box: Box,
  layers: Layers, workflow: Workflow,
};

/** Edges come from each node's `connectsTo`. If a block defines none at all,
 *  each layer's highlighted (or first) node fans out to the next layer. */
function edgesOf(layers) {
  const keys = new Set(layers.flatMap((l) => l.nodes.map((n) => n.key)));
  const explicit = layers.flatMap((l) => l.nodes.flatMap((n) => (n.connectsTo ?? []).filter((t) => keys.has(t)).map((to) => ({ from: n.key, to }))));
  if (explicit.length) return explicit;
  return layers.slice(0, -1).flatMap((l, i) => {
    const src = l.nodes.find((n) => n.highlight) ?? l.nodes[0];
    return src ? layers[i + 1].nodes.map((n) => ({ from: src.key, to: n.key })) : [];
  });
}

function Node({ node, setRef, state, onHover }) {
  const Icon = ARCH_ICONS[node.icon] ?? Box;
  const hl = node.highlight;
  return (
    <div
      ref={setRef}
      onMouseEnter={() => onHover(node.key)}
      onMouseLeave={() => onHover(null)}
      className={`relative z-10 flex items-center gap-3.5 rounded-[18px] border p-3.5 transition-[opacity,border-color,box-shadow] duration-300 ${
        hl ? 'border-transparent bg-pd-accent text-pd-accent-fg shadow-[0_20px_50px_-24px_var(--pd-accent)]' : 'pd-node border-pd-line text-pd-fg'
      } ${state === 'dim' ? 'opacity-35' : 'opacity-100'} ${state === 'on' && !hl ? 'border-pd-accent' : ''}`}
    >
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${hl ? 'bg-black/10' : 'bg-pd-line'}`}>
        <Icon size={18} strokeWidth={1.75} />
      </span>
      <span className="min-w-0">
        <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="text-[15px] font-semibold leading-tight">{node.name}</span>
          {node.tag ? (
            <span className={`rounded-md px-1.5 py-0.5 font-mono text-[11px] leading-none ${hl ? 'bg-black/10' : 'bg-pd-accent-soft text-pd-accent'}`}>{node.tag}</span>
          ) : null}
        </span>
        {node.detail ? <span className={`mt-1 block font-mono text-[11px] leading-snug ${hl ? 'opacity-75' : 'text-pd-muted'}`}>{node.detail}</span> : null}
      </span>
    </div>
  );
}

/**
 * blocks.architecture — a live system graph.
 * Layers become columns (stacked on mobile); edges are bezier curves drawn
 * between the real rendered node positions, with data flowing along them.
 * Hovering a node lights its connections.
 */
export default function Architecture({ block, meta }) {
  const layers = block.layers ?? [];
  const edges = edgesOf(layers);
  const wrap = useRef(null);
  const nodeEls = useRef({});
  const [geo, setGeo] = useState({ w: 0, h: 0, paths: [] });
  const [hover, setHover] = useState(null);

  const measure = useCallback(() => {
    const box = wrap.current;
    if (!box) return;
    if (!window.matchMedia('(min-width: 1024px)').matches) return setGeo({ w: 0, h: 0, paths: [] });
    const c = box.getBoundingClientRect();
    const paths = edges
      .map((e) => {
        const a = nodeEls.current[e.from]?.getBoundingClientRect();
        const b = nodeEls.current[e.to]?.getBoundingClientRect();
        if (!a || !b) return null;
        const y1 = a.top + a.height / 2 - c.top;
        const y2 = b.top + b.height / 2 - c.top;
        let d;
        if (b.left >= a.right - 1) {
          // forward: right edge → next column's left edge
          const x1 = a.right - c.left;
          const x2 = b.left - c.left;
          const dx = Math.max(28, (x2 - x1) * 0.5);
          d = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
        } else if (Math.abs(a.left - b.left) < 4) {
          // same column: a bracket out into the gutter and back
          const x = a.right - c.left;
          const k = Math.min(40, 18 + Math.abs(y2 - y1) * 0.12);
          d = `M ${x} ${y1} C ${x + k} ${y1}, ${x + k} ${y2}, ${x} ${y2}`;
        } else {
          // backward: left edge → earlier column's right edge
          const x1 = a.left - c.left;
          const x2 = b.right - c.left;
          const dx = Math.max(28, (x1 - x2) * 0.5);
          d = `M ${x1} ${y1} C ${x1 - dx} ${y1}, ${x2 + dx} ${y2}, ${x2} ${y2}`;
        }
        return { ...e, d };
      })
      .filter(Boolean);
    setGeo({ w: c.width, h: c.height, paths });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [block]);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (wrap.current) ro.observe(wrap.current);
    document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, [measure]);

  const linked = (key) => !hover || key === hover || edges.some((e) => (e.from === hover && e.to === key) || (e.to === hover && e.from === key));
  const cols = layers.map((l) => (l.nodes.length === 1 ? 'minmax(0,0.82fr)' : 'minmax(0,1fr)')).join(' ');

  return (
    <Section meta={meta} heading={block.heading}>
      {block.intro ? (
        <BlurFade inView>
          <RichText value={block.intro} className="mb-14 max-w-[62ch] text-lg leading-relaxed text-pd-muted sm:text-xl" />
        </BlurFade>
      ) : null}

      <BlurFade inView>
        <div className="relative overflow-hidden rounded-[32px] border border-pd-line p-5 sm:p-8 lg:p-10">
          {/* dot grid + glow */}
          <div aria-hidden className="pd-dots absolute inset-0" />
          <div aria-hidden className="pointer-events-none absolute -left-1/4 top-1/2 h-[120%] w-[70%] -translate-y-1/2 rounded-full bg-pd-accent opacity-[0.10] blur-[120px]" />

          <div ref={wrap} className="relative">
            {/* edges (desktop) */}
            {geo.paths.length ? (
              <svg aria-hidden className="pointer-events-none absolute inset-0 hidden lg:block" width={geo.w} height={geo.h}>
                {geo.paths.map((p) => {
                  const on = hover && (p.from === hover || p.to === hover);
                  const dim = hover && !on;
                  return (
                    <g key={`${p.from}-${p.to}`} className="transition-opacity duration-300" opacity={dim ? 0.12 : 1}>
                      <path d={p.d} fill="none" stroke={on ? 'var(--pd-accent)' : 'var(--pd-line)'} strokeWidth={on ? 2 : 1.5} />
                      <path d={p.d} fill="none" stroke="var(--pd-accent)" strokeOpacity={on ? 1 : 0.75} strokeWidth={2} strokeLinecap="round" strokeDasharray="2 10" className="pd-dash" />
                    </g>
                  );
                })}
              </svg>
            ) : null}

            <div className="flex flex-col gap-4 lg:grid lg:gap-x-14 xl:gap-x-20" style={{ gridTemplateColumns: cols }}>
              {layers.map((layer, li) => (
                <div key={layer.label} className="flex flex-col">
                  {li > 0 ? (
                    <div aria-hidden className="flex justify-center pb-4 text-pd-faint lg:hidden">
                      <ChevronDown size={18} />
                    </div>
                  ) : null}
                  <div className="mb-4 flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-pd-faint">
                    <span className="font-mono text-pd-accent">{String(li + 1).padStart(2, '0')}</span>
                    {layer.label}
                  </div>
                  <div className="grid flex-1 content-center gap-3 sm:grid-cols-2 lg:flex lg:flex-col lg:justify-center">
                    {layer.nodes.map((node) => (
                      <Node
                        key={node.key}
                        node={node}
                        setRef={(el) => {
                          nodeEls.current[node.key] = el;
                        }}
                        state={hover ? (linked(node.key) ? (node.key === hover ? 'self' : 'on') : 'dim') : 'idle'}
                        onHover={setHover}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </BlurFade>

      {block.notes?.length ? (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {block.notes.map((note, i) => (
            <BlurFade key={note} inView delay={i * 0.06} className="h-full">
              <div className="flex h-full gap-5 rounded-[24px] bg-pd-accent-soft p-6 sm:p-8">
                <span className="font-mono text-sm text-pd-accent">{String(i + 1).padStart(2, '0')}</span>
                <p className="text-lg leading-relaxed text-pd-fg">{note}</p>
              </div>
            </BlurFade>
          ))}
        </div>
      ) : null}
    </Section>
  );
}
