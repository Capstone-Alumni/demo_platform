export const createSubdomain = async (subdomain: string) => {
  const response = await fetch(
    `https://api.vercel.com/v8/projects/${process.env.PROJECT_ID_VERCEL}/domains?teamId=${process.env.TEAM_ID_VERCEL}`,
    {
      body: `{\n  "name": "${subdomain}${process.env.MAINAPP_DOMAIN}"\n}`,
      headers: {
        Authorization: `Bearer ${process.env.AUTH_BEARER_TOKEN}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
    },
  );

  const data = await response.json();

  // Domain is already owned by another team but you can request delegation to access it
  if (data.error?.code === 'forbidden') {
    throw new Error('forbidden');
  }

  // Domain is already being used by a different project
  if (data.error?.code === 'domain_taken') {
    throw new Error('existed subdomain');
  }
};

export const deleteSubdomain = async (subdomain: string) => {
  const domain = `${subdomain}${process.env.MAINAPP_DOMAIN}`;
  await fetch(
    `https://api.vercel.com/v8/projects/${process.env.PROJECT_ID_VERCEL}/domains/${domain}?teamId=${process.env.TEAM_ID_VERCEL}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.AUTH_BEARER_TOKEN}`,
      },
      method: 'DELETE',
    },
  );
};
