import { GraphQLClient } from 'graphql-request';

// dati sempre freschi dal CMS
export const dynamic = 'force-dynamic';

const QUERY = /* GraphQL */ `
  query Home($limit: IntType = 10) {
    _site { globalSeo { siteName } }
    allPosts(first: $limit, orderBy: _firstPublishedAt_DESC) {
      id
      title
      slug
      img { url alt }
    }
  }
`;

export default async function Home() {
  const client = new GraphQLClient('https://graphql.datocms.com/', {
    headers: { Authorization: `Bearer ${process.env.DATOCMS_API_TOKEN}` },
  });

  const data = await client.request(QUERY, { limit: 10 });
  const siteName = data?._site?.globalSeo?.siteName ?? 'Ventoadv';
  const posts = data?.allPosts ?? [];

  return (
    <main style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <h1>{siteName}</h1>

      <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: 16 }}>
        {posts.map((p) => (
          <li key={p.id} style={{ border: '1px solid #eee', padding: 16, borderRadius: 8 }}>
            {p.img?.url && (
              <img
                src={`${p.img.url}?w=640&h=360&fit=crop`}
                alt={p.img.alt || p.title}
                style={{ maxWidth: '50%', borderRadius: 8 }}
              />
            )}
            <h3 style={{ marginTop: 12 }}>
              <a href={`/post/${p.slug}`}>{p.title}</a>
            </h3>
          </li>
        ))}
      </ul>

      {posts.length === 0 && <p>Nessun post pubblicato.</p>}
    </main>
  );
}
