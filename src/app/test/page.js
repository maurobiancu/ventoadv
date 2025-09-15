// Importa il client GraphQL
import { GraphQLClient } from 'graphql-request';

// Definisci la query GraphQL per il modello "Page"
const HOMEPAGE_QUERY = `{
  allPages(first: "1", orderBy: _firstPublishedAt_DESC) {
    title
    hero {
      responsiveImage {
        srcSet
        webpSrcSet
        sizes
        src
        width
        height
        alt
        title
      }
    }
    text(markdown: true)
    seo {
      title
      description
      image {
        url
      }
    }
  }
}`;

// Questa funzione si occupa del fetching dei dati.
// Non ha bisogno di essere getStaticProps. È una semplice funzione async.
async function getPageData() {
  const client = new GraphQLClient('https://graphql.datocms.com/', {
    headers: {
      authorization: `Bearer ${process.env.DATO_CMS_API_TOKEN}`,
    },
  });

  const data = await client.request(HOMEPAGE_QUERY);
  return data;
}

// Questo è il tuo componente Server Component
export default async function Page() {
  // Chiama la funzione di fetching direttamente qui
  const data = await getPageData();
  const homePage = data.allPages[0];

  if (!homePage) {
    return <div>Caricamento o dati non disponibili...</div>;
  }

  return (
    <div>
      {homePage.title && <h1>{homePage.title}</h1>}
      
      {homePage.text && (
        <div dangerouslySetInnerHTML={{ __html: homePage.text }} />
      )}
      
      {/* Aggiungi qui gli altri elementi della tua pagina */}
    </div>
  );
}

// L'App Router gestisce automaticamente la cache e la rigenerazione.
// Se vuoi un comportamento simile a `revalidate: 60`, puoi aggiungerlo
// al fetch dell'API o in un layout:
// export const revalidate = 60;