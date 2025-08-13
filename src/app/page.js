import { dato } from '../lib/dato';

// export const revalidate = 60;
export const dynamic = 'force-dynamic';


export default async function Home() {
  let siteName = 'Ventoadv';
  try {
    const client = dato(false);
    const data = await client.request(`{ _site { globalSeo { siteName } } }`);
    siteName = data?._site?.globalSeo?.siteName || siteName;
  } catch (e) {
    // Evitiamo che il build fallisca se manca la env o la query dà errore
    console.error('DatoCMS error:', e?.response?.errors || e?.message || e);
  }

  return (
    <main style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
      <h1>{siteName}</h1>
      <p>Connessione a DatoCMS riuscita (o fallback locale).</p>
    </main>
  );
}
