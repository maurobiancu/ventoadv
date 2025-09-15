import { dato } from '../../lib/dato';

// niente prerender: leggi DatoCMS ad ogni richiesta
export const dynamic = 'force-dynamic';

const QUERY = /* GraphQL */ `
  query Test {
    allPages(first: 1, orderBy: _firstPublishedAt_DESC) {
      title
      text
      hero { url alt }
    }
  }
`;

export default async function TestPage() {
  try {
    const client = dato(false); // usa Authorization: Bearer ${DATOCMS_API_TOKEN}
    const { allPages } = await client.request(QUERY);
    const page = allPages?.[0];

    if (!page) {
      return <main style={{padding:24}}><h1>Nessun contenuto</h1></main>;
    }

    return (
      <main style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
        <h1>{page.title}</h1>
        {page.hero?.url && (
          <img
            src={`${page.hero.url}?w=1200`}
            alt={page.hero.alt || page.title}
            style={{ width: '100%', height: 'auto', borderRadius: 8, margin: '16px 0' }}
          />
        )}
        {page.text && <p style={{ lineHeight: 1.6 }}>{page.text}</p>}
      </main>
    );
  } catch (e) {
    console.error('DatoCMS /test error:', e?.response?.errors ?? e?.message ?? e);
    return <main style={{padding:24}}><h1>Errore caricamento</h1></main>;
  }
}
