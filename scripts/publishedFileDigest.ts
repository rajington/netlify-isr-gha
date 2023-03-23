const publishedFileDigest = async (TOKEN: string, SITE_ID: string) => {
  const { NetlifyAPI } = await import('netlify') as any; // horribly typed
  const client = new NetlifyAPI(TOKEN, { globalParams: { site_id: SITE_ID } });
  const site = await client.getSite();
  const publishedDeployId = site.published_deploy.id;

  const { default: fetch } = await import('node-fetch');

  const files = await (await fetch(`https://api.netlify.com/api/v1/deploys/${publishedDeployId}/files`, {
    headers: { Authorization: `Bearer ${TOKEN}` }
  })).json() as Array<{ path: string, sha: string }>;

  const fileDigest = JSON.stringify({ files: Object.fromEntries(files.map(file => [file.path.replace('/', ''), file.sha])) })

  return fileDigest;
}

publishedFileDigest(process.env.NETLIFY_TOKEN!, process.env.NETLIFY_SITE_ID!).then(console.log);
