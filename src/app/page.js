import { dato } from '../lib/dato';

export const revalidate = 60;

export default async function Home() {
  const client = dato(false);
  const data = await client.request(`{
    _site { globalSeo { siteName } }
  }`);

  return (
    <main style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
      <h1>{data?._site?.globalSeo?.siteName ?? 'Ventoadv'}</h1>
      <p>Connessione a DatoCMS riuscita.</p>
    </main>
  );
}
