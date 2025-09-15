// Importa il client GraphQL per effettuare le richieste API
import { GraphQLClient } from 'graphql-request';

// Definisci la query GraphQL per la tua homepage.
// La query deve corrispondere esattamente ai nomi dei campi nel tuo modello DatoCMS.
// In questo caso, stiamo recuperando un'unica istanza di 'homePage'
// che probabilmente hai creato nel tuo CMS.
const HOMEPAGE_QUERY = `{
  homePage {
    # Recupera il titolo della pagina
    title
    
    # Recupera l'asset 'hero' (es. un'immagine)
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
    
    # Recupera il blocco di testo a paragrafi multipli
    text(markdown: true)
    
    # Recupera i dati SEO
    seo {
      title
      description
      image {
        url
      }
    }
  }
}`;

// Questa funzione viene eseguita al momento della compilazione (build time)
// per recuperare i dati dal CMS. Next.js la usa per prerenderizzare la pagina.
export async function getStaticProps() {
  // Crea una nuova istanza del client GraphQL con l'URL dell'API di DatoCMS
  const client = new GraphQLClient('https://graphql.datocms.com/', {
    headers: {
      // Inserisci il tuo token API come variabile d'ambiente per sicurezza
      authorization: `Bearer ${process.env.DATO_CMS_API_TOKEN}`,
    },
  });

  // Esegui la query per ottenere i dati
  const data = await client.request(HOMEPAGE_QUERY);

  // Passa i dati recuperati come 'props' al componente della pagina
  return {
    props: {
      data,
    },
    // Abilita la 'Incremental Static Regeneration' (ISR)
    // per rigenerare la pagina in background ogni 60 secondi
    // se ci sono modifiche nei dati del CMS.
    revalidate: 60,
  };
}

// Questo è il componente React che renderizza la tua pagina.
// Riceve i dati recuperati da 'getStaticProps'
export default function HomePage({ data }) {
  // Estrai i dati specifici della homepage
  const { homePage } = data;

  // Mostra un messaggio di caricamento o di errore se i dati non sono disponibili
  if (!homePage) {
    return <div>Caricamento o dati non disponibili...</div>;
  }

  return (
    <div>
      {/* Se il campo 'title' è presente, mostralo */}
      {homePage.title && <h1>{homePage.title}</h1>}
      
      {/* Se il campo 'hero' è presente, usa il componente <Image> di Next.js
          per ottimizzarne il caricamento. Dovrai importare 'Image' da 'next/image' */}
      {/* Se usi next/image, assicurati di configurare il dominio 'datocms-assets.com'
          nel file next.config.js del tuo progetto. */}
      {/* {homePage.hero?.responsiveImage && (
        <Image
          data={homePage.hero.responsiveImage}
          alt={homePage.title}
        />
      )} */}
      
      {/* Se il campo 'text' è presente, puoi renderizzarlo come HTML. */}
      {homePage.text && (
        <div dangerouslySetInnerHTML={{ __html: homePage.text }} />
      )}
      
      {/* I dati SEO non vengono visualizzati direttamente qui, ma sono importanti
          per il tag <head> della pagina. */}
      {/* Potresti usare un componente come 'next-seo' per gestire questi dati
          nella sezione <Head> della pagina. */}
    </div>
  );
}