import { NextApiRequest, NextApiResponse } from 'next';

export default function onErrorAPIHandler(
  err: unknown,
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // eslint-disable-next-line no-console
  console.error('Server Error', err);
  res.status(500).end('Something broke!');
}
