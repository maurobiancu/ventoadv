import { GraphQLClient } from 'graphql-request';

export function dato(preview = false) {
  return new GraphQLClient('https://graphql.datocms.com/', {
    headers: {
      Authorization: `Bearer ${preview ? process.env.DATOCMS_PREVIEW_TOKEN : process.env.DATOCMS_API_TOKEN}`,
      'X-Include-Drafts': preview ? 'true' : 'false'
    }
  });
}
