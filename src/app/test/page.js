import { dato } from '../../lib/dato';

// niente prerender: legge DatoCMS ad ogni richiesta
export const dynamic = 'force-dynamic';

const QUERY = /* GraphQL */ `
  query TestPage {
    page {
      title
      text
      hero { url alt }
      seo {
        title
        description
        image { url }
      }
    }
  }
`;

// SEO dinamico (Next.js App Router)
export async function generateMetadata() {
  const client = dato(false);
  try {
    const { page } = await client.request(QUERY);
    const seo = page?.seo;
    return {
      title: seo?.title || page?.title || 'Test',
      description: seo?.description || undefined,
      openGraph: seo?.image?.url
        ? { images: [{ url: seo.image.url }] }
        : undefined,
    };
  } catch {
    return { title: 'Test' };
  }
}

export default async function TestPage() {
  const client = dato(false);
  const { page } = await client.request(QUERY);
  if (!page) {
    return (
      <main style={{ padding: 24 }}>
        <h1>Nessun contenuto</h1>
        <p>Crea e pubblica il record per il modello “page” in DatoCMS.</p>
      </main>
    );
  }

  return (
    <main style={{ padding: 24, maxWidth: 1040, margin: '0 auto' }}>
      {/* HERO */}
      <header style={{ display: 'grid', gap: 16, gridTemplateColumns: '1.2fr 1fr', alignItems: 'center' }}>
        <div>
          <h1 style={{ marginBottom: 8 }}>{page.title}</h1>
          {page.text && (
            <p style={{ fontSize: 18, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
              {page.text}
            </p>
          )}
        </div>
        {page.hero?.url && (
          <img
            src={`${page.hero.url}?w=1000&h=600&fit=crop`}
            alt={page.hero.alt || page.title}
            style={{ width: '100%', height: 'auto', borderRadius: 12 }}
          />
        )}
      </header>
    </main>
  );
}
