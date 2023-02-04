export default function getTenantHost(subdomain: string) {
  if (process.env.NODE_ENV === 'production') {
    return `https://${subdomain}.vercel.app`; // refactor when has new custom domain
  }

  return `http://${subdomain}.localhost:3005`;
}
