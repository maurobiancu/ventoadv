// Importa il client GraphQL
import { GraphQLClient } from 'graphql-request';

// Modifica la query per usare 'allPages' che si riferisce al modello "Page"
const HOMEPAGE_QUERY = `{
  # Chiediamo il primo elemento di tutte le pagine, ordinato per data di pubblicazione
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

// La funzione getStaticProps rimane invariata
export async function getStaticProps() {
  const client = new GraphQLClient('https://graphql.datocms.com/', {
    headers: {
      authorization: `Bearer ${process.env.DATO_CMS_API_TOKEN}`,
    },
  });

  const data = await client.request(HOMEPAGE_QUERY);

  return {
    props: {
      data,
    },
    revalidate: 60,
  };
}

// Modifica il componente per accedere a `allPages` invece che a `homePage`
export default function HomePage({ data }) {
  // Ora estraiamo il primo elemento dall'array 'allPages'
  const homePage = data.allPages[0];

  if (!homePage) {
    return <div>Caricamento o dati non disponibili...</div>;
  }

  return (
    <div>
      {homePage.title && <h1>{homePage.title}</h1>}
      
      {/* ...il resto del tuo codice per l'immagine e il testo... */}
    </div>
  );
}