import { GraphQLClient } from 'graphql-request';

// dati sempre freschi
export const dynamic = 'force-dynamic';

const QUERY = /* GraphQL */ `
  query Home($limit: IntType = 10) {
    _site { globalSeo { siteName } }
    allPosts(first: $limit, orderBy: _firstPublishedAt_DESC) {
      id
      title
      slug
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
    <main style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
      <h1>{siteName}</h1>
      <ul>
        {posts.map(p => (
          <li key={p.id}>
            <a href={`/post/${p.slug}`}>{p.title}</a>
          </li>
        ))}
      </ul>
      {posts.length === 0 && <p>Nessun post pubblicato.</p>}
    </main>
  );
}
