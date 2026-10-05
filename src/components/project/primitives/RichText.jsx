import { Fragment } from 'react';

// Renders either:
//   • a string — paragraphs split on blank lines, with **bold**, `code` and
//     [label](https://…) inline (what the local content files use), or
//   • Strapi v5 "Blocks" rich-text JSON (paragraph, heading, list, quote,
//     code, image, link + bold/italic/underline/strikethrough/code marks).
// So a CMS editor's rich text and a hand-written string look identical.

const INLINE = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;

function inlineString(text) {
  return text.split(INLINE).map((part, i) => {
    if (part.startsWith('**')) return <strong key={i} className="font-semibold text-pd-fg">{part.slice(2, -2)}</strong>;
    if (part.startsWith('`')) return <code key={i} className="bg-pd-line px-1.5 py-0.5 font-mono text-[0.85em] text-pd-fg">{part.slice(1, -1)}</code>;
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) return <a key={i} href={link[2]} target="_blank" rel="noreferrer" className="text-pd-fg underline decoration-pd-accent decoration-2 underline-offset-4">{link[1]}</a>;
    return <Fragment key={i}>{part}</Fragment>;
  });
}

function Leaf({ node }) {
  if (node.type === 'link') {
    return (
      <a href={node.url} target="_blank" rel="noreferrer" className="text-pd-fg underline decoration-pd-accent decoration-2 underline-offset-4">
        {(node.children ?? []).map((c, i) => <Leaf key={i} node={c} />)}
      </a>
    );
  }
  let el = node.text ?? '';
  if (node.code) el = <code className="bg-pd-line px-1.5 py-0.5 font-mono text-[0.85em] text-pd-fg">{el}</code>;
  if (node.bold) el = <strong className="font-semibold text-pd-fg">{el}</strong>;
  if (node.italic) el = <em>{el}</em>;
  if (node.underline) el = <u>{el}</u>;
  if (node.strikethrough) el = <s>{el}</s>;
  return <>{el}</>;
}

const kids = (node) => (node.children ?? []).map((c, i) => <Leaf key={i} node={c} />);

function Block({ node }) {
  switch (node.type) {
    case 'heading': {
      const Tag = `h${Math.min(Math.max(node.level ?? 3, 2), 4)}`;
      return <Tag className="mt-4 text-[1.4em] font-semibold leading-tight text-pd-fg">{kids(node)}</Tag>;
    }
    case 'list': {
      const Tag = node.format === 'ordered' ? 'ol' : 'ul';
      return (
        <Tag className={`space-y-2 pl-6 ${node.format === 'ordered' ? 'list-decimal' : 'list-disc'} marker:text-pd-accent`}>
          {(node.children ?? []).map((li, i) => <li key={i}>{kids(li)}</li>)}
        </Tag>
      );
    }
    case 'quote':
      return <blockquote className="border-l-2 border-pd-accent pl-5 italic text-pd-fg">{kids(node)}</blockquote>;
    case 'code':
      return <pre className="overflow-x-auto bg-pd-line p-5 font-mono text-[0.8em] text-pd-fg">{(node.children ?? []).map((c) => c.text).join('')}</pre>;
    case 'image':
      return node.image?.url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={node.image.url} alt={node.image.alternativeText ?? ''} className="w-full" />
      ) : null;
    default:
      return <p>{kids(node)}</p>;
  }
}

export default function RichText({ value, className = '' }) {
  if (!value) return null;
  const blocks = Array.isArray(value) ? value : null;
  return (
    <div className={`flex flex-col gap-5 ${className}`}>
      {blocks
        ? blocks.map((node, i) => <Block key={i} node={node} />)
        : String(value)
            .split(/\n{2,}/)
            .map((para, i) => <p key={i}>{inlineString(para.trim())}</p>)}
    </div>
  );
}
