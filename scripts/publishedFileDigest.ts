/**
 * Fetches a Netlify site's file digest for the published deploy
 * https://docs.netlify.com/api/get-started/#file-digest-method
 * 
 * @param NETLIFY_AUTH_TOKEN Netlify Authentication Token
 * @param NETLIFY_SITE_ID Netlify Site ID
 * @returns the JSON string of the published deploy's file digest
 */
const publishedFileDigest = async (NETLIFY_AUTH_TOKEN: string, NETLIFY_SITE_ID: string) => {
  const { NetlifyAPI } = await import('netlify') as any; // horribly typed
  const client = new NetlifyAPI(NETLIFY_AUTH_TOKEN, { globalParams: { site_id: NETLIFY_SITE_ID } });
  const site = await client.getSite();
  const publishedDeployId = site.published_deploy.id;

  const { default: fetch } = await import('node-fetch');

  const files = await (await fetch(`https://api.netlify.com/api/v1/deploys/${publishedDeployId}/files`, {
    headers: { Authorization: `Bearer ${NETLIFY_AUTH_TOKEN}` }
  })).json() as Array<{ path: string, sha: string }>;

  const fileDigest = JSON.stringify({ files: Object.fromEntries(files.map(file => [file.path.replace('/', ''), file.sha])) })

  return fileDigest;
}

publishedFileDigest(process.env.NETLIFY_AUTH_TOKEN!, process.env.NETLIFY_SITE_ID!).then(console.log);
