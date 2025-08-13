import { GraphQLClient } from 'graphql-request';

export async function GET() {
  const tokenSet = Boolean(process.env.DATOCMS_API_TOKEN);
  try {
    const client = new GraphQLClient('https://graphql.datocms.com/', {
      headers: { Authorization: `Bearer ${process.env.DATOCMS_API_TOKEN}` },
    });
    const data = await client.request(`{ _site { globalSeo { siteName } } }`);
    return new Response(JSON.stringify({ ok: true, tokenSet, data }), {
      headers: { 'content-type': 'application/json' },
    });
  } catch (e) {
    return new Response(
      JSON.stringify({
        ok: false,
        tokenSet,
        error: e?.response?.errors ?? e?.message ?? String(e),
      }),
      { status: 500, headers: { 'content-type': 'application/json' } }
    );
  }
}
