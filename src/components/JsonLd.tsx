/** Schema.org structured data as one @graph. `<` is escaped so content can't close the tag. */
export default function JsonLd({ data }: { data: object | object[] }) {
  const json = JSON.stringify({ '@context': 'https://schema.org', '@graph': Array.isArray(data) ? data : [data] });
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json.replace(/</g, '\\u003c') }} />;
}
