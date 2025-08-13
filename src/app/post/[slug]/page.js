import { GraphQLClient } from 'graphql-request';
import { StructuredText } from 'react-datocms';

// anche il dettaglio legge sempre dal CMS
export const dynamic = 'force-dynamic';

const POST_QUERY = /* GraphQL */ `
  query Post($slug: String!) {
    post(filter: { slug: { eq: $slug } }) {
      title
      slug
      img { url alt }
      content { value }
    }
  }
`;

export default async function PostPage({ params }) {
  const client = new GraphQLClient('https://graphql.datocms.com/', {
    headers: { Authorization: `Bearer ${process.env.DATOCMS_API_TOKEN}` },
  });

  const { post } = await client.request(POST_QUERY, { slug: params.slug });

  if (!post) {
    return (
      <main style={{ padding: 24 }}>
        <h1>404</h1>
        <p>Post non trovato.</p>
      </main>
    );
  }

  return (
    <main style={{ padding: 24, maxWidth: 820, margin: '0 auto' }}>
      <h1>{post.title}</h1>

      {post.img?.url && (
        <img
          src={`${post.img.url}?w=1200`}
          alt={post.img.alt || post.title}
          style={{ width: '100%', height: 'auto', borderRadius: 8, margin: '16px 0' }}
        />
      )}

      <article style={{ lineHeight: 1.6 }}>
        {post.content?.value ? <StructuredText data={post.content} /> : <p>(Nessun contenuto)</p>}
      </article>
    </main>
  );
}
