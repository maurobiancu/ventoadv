import { GraphQLClient } from 'graphql-request';

// anche qui SSR per aggiornamenti immediati
export const dynamic = 'force-dynamic';

const POST_QUERY = /* GraphQL */ `
  query Post($slug: String!) {
    post(filter: { slug: { eq: $slug } }) {
      title
      slug
    }
  }
`;

export default async function PostPage({ params }) {
  const client = new GraphQLClient('https://graphql.datocms.com/', {
    headers: { Authorization: `Bearer ${process.env.DATOCMS_API_TOKEN}` },
  });

  const { post } = await client.request(POST_QUERY, { slug: params.slug });
  if (!post) return <main style={{padding:24}}><h1>404</h1><p>Post non trovato.</p></main>;

  return (
    <main style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
      <h1>{post.title}</h1>
      <p>Slug: {post.slug}</p>
      <p>{post.content}</p>
    </main>
  );
}
