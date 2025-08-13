import { GraphQLClient } from 'graphql-request';

// dati freschi ad ogni richiesta
export const dynamic = 'force-dynamic';

export default async function Home() {
  let usedDato = false;
  let siteName = 'Ventoadv';
  let error = null;

  try {
    const client = new GraphQLClient('https://graphql.datocms.com/', {
      headers: { Authorization: `Bearer ${process.env.DATOCMS_API_TOKEN}` },
    });

    const res = await client.request(`{ _site { globalSeo { siteName } } }`);
    const name = res?._site?.globalSeo?.siteName;
    if (name) {
      siteName = name;
      usedDato = true;
    }
  } catch (e) {
    error = e?.response?.errors ?? e?.message ?? String(e);
  }

  return (
    <main style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
      <h1>{siteName}</h1>
      <p>{usedDato ? 'DatoCMS OK ✅' : 'Fallback locale ⛑️'}</p>
      {error && (
        <pre style={{ background: '#f5f5f5', padding: 12, marginTop: 12 }}>
          {JSON.stringify(error, null, 2)}
        </pre>
      )}
    </main>
  );
}
