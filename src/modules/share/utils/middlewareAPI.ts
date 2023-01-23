import { NextApiRequest, NextApiResponse } from 'next';
import { NextHandler } from 'next-connect';

export const authMiddleware = async (
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler,
) => {
  const hostname = req.headers.host || '';

  const currentHost =
    process.env.NODE_ENV === 'production' && process.env.VERCEL === '1'
      ? hostname.replace('.vercel.app', '')
      : hostname.replace('.localhost:3005', '');

  if (currentHost == 'app') {
    next();
  }

  next();
};
