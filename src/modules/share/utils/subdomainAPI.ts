import axios from 'axios';

export const createSubdomain = async (subdomain: string) => {
  const domain = `${subdomain}${process.env.MAINAPP_DOMAIN}`;

  const payload = {
    name: domain,
  };

  const response = await axios({
    method: 'POST',
    url: `https://api.vercel.com/v8/projects/${process.env.PROJECT_ID_VERCEL}/domains?teamId=${process.env.TEAM_ID_VERCEL}`,
    data: payload,
    headers: {
      Authorization: `Bearer ${process.env.AUTH_BEARER_TOKEN}`,
      'Content-Type': 'application/json',
      accept: 'application/json',
    },
  });

  const { data } = response;

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

  await axios({
    method: 'DELETE',
    url: `https://api.vercel.com/v8/projects/${process.env.PROJECT_ID_VERCEL}/domains/${domain}?teamId=${process.env.TEAM_ID_VERCEL}`,
    headers: {
      Authorization: `Bearer ${process.env.AUTH_BEARER_TOKEN}`,
    },
  });
};
